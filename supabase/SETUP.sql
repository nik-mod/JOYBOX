-- Foundation only. Apply to a real Supabase project before setting the environment variables.
-- No product, price, inventory, customer, or payment fixtures are seeded.
begin;
create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
create policy "Admins can read own role" on public.admin_users for select to authenticated using(user_id=auth.uid());
create function public.is_admin() returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.admin_users where user_id=auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon,authenticated;

create table public.products (
  id uuid primary key default gen_random_uuid(),slug text not null unique check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,description text not null,short_description text not null,
  price_minor integer not null check(price_minor>0),age_label text not null,
  image_url text not null check(image_url like 'https://%'),images text[] not null default '{}',categories text[] not null default '{}',
  dimensions text not null default '',safety_info text not null,
  stock integer not null default 0 check(stock>=0),reserved_stock integer not null default 0 check(reserved_stock>=0),
  sold_quantity integer not null default 0 check(sold_quantity>=0),published boolean not null default false,
  sort_order integer not null default 0,created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
alter table public.products enable row level security;
create policy "Published products are public" on public.products for select to anon,authenticated using(published or public.is_admin());
create policy "Admins manage products" on public.products for all to authenticated using(public.is_admin()) with check(public.is_admin());
create index products_catalog_idx on public.products(published,sort_order);

create table public.store_settings (
  id integer primary key default 1 check(id=1),contact_email text not null default '',contact_phone text not null default '',
  delivery_zones jsonb not null default '[]' check(jsonb_typeof(delivery_zones)='array'),
  policies jsonb not null default '{}' check(jsonb_typeof(policies)='object'),checkout_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);
insert into public.store_settings(id) values(1);
alter table public.store_settings enable row level security;
create policy "Store information is public" on public.store_settings for select to anon,authenticated using(true);
create policy "Admins manage settings" on public.store_settings for all to authenticated using(public.is_admin()) with check(public.is_admin());

create table public.orders (
  id uuid primary key default gen_random_uuid(),order_number text not null unique,
  idempotency_key uuid not null unique,request_hash text not null,
  customer_name text not null,customer_phone text not null,customer_email text,
  delivery_city text not null,delivery_address text not null,notes text not null default '',
  subtotal_minor integer not null check(subtotal_minor>=0),delivery_minor integer not null check(delivery_minor>=0),
  total_minor integer not null check(total_minor=subtotal_minor+delivery_minor),currency text not null default 'GEL' check(currency='GEL'),
  payment_status text not null default 'pending' check(payment_status in('pending','processing','paid','failed','cancelled','refunded')),
  fulfillment_status text not null default 'pending' check(fulfillment_status in('pending','confirmed','preparing','shipped','delivered','cancelled')),
  created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create table public.order_items (
  id uuid primary key default gen_random_uuid(),order_id uuid not null references public.orders(id),
  product_id uuid references public.products(id) on delete set null,name text not null,
  quantity integer not null check(quantity>0),unit_price_minor integer not null check(unit_price_minor>0),
  unique(order_id,product_id)
);
create table public.inventory_adjustments (
  id uuid primary key default gen_random_uuid(),product_id uuid not null references public.products(id),
  actor_id uuid references auth.users(id),old_stock integer not null,new_stock integer not null,
  created_at timestamptz not null default now()
);
create table public.payments (
  id uuid primary key default gen_random_uuid(),order_id uuid not null references public.orders(id),
  provider text not null,provider_payment_id text unique,amount_minor integer not null check(amount_minor>0),
  currency text not null default 'GEL' check(currency='GEL'),status text not null check(status in('pending','processing','paid','failed','cancelled','refunded')),
  created_at timestamptz not null default now()
);
create table public.payment_events (
  id uuid primary key default gen_random_uuid(),provider text not null,event_id text not null,
  payment_id uuid references public.payments(id),processed_at timestamptz not null default now(),unique(provider,event_id)
);
create table public.shipments (
  id uuid primary key default gen_random_uuid(),order_id uuid not null references public.orders(id),
  tracking_reference text,notes text not null default '',created_at timestamptz not null default now()
);
create table public.admin_audit_logs (
  id bigint generated always as identity primary key,actor_id uuid references auth.users(id),
  entity text not null,entity_id text not null,operation text not null,created_at timestamptz not null default now()
);
create index orders_recent_idx on public.orders(created_at desc);
create index orders_fulfillment_idx on public.orders(fulfillment_status);
create index order_items_order_idx on public.order_items(order_id);
create index payments_order_idx on public.payments(order_id);
create index shipments_order_idx on public.shipments(order_id);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.inventory_adjustments enable row level security;
alter table public.payments enable row level security;
alter table public.payment_events enable row level security;
alter table public.shipments enable row level security;
alter table public.admin_audit_logs enable row level security;
create policy "Admins read orders" on public.orders for select to authenticated using(public.is_admin());
create policy "Admins read order items" on public.order_items for select to authenticated using(public.is_admin());
create policy "Admins read inventory adjustments" on public.inventory_adjustments for select to authenticated using(public.is_admin());
create policy "Admins read payments" on public.payments for select to authenticated using(public.is_admin());
create policy "Admins read payment events" on public.payment_events for select to authenticated using(public.is_admin());
create policy "Admins read shipments" on public.shipments for select to authenticated using(public.is_admin());
create policy "Admins read audit logs" on public.admin_audit_logs for select to authenticated using(public.is_admin());

create function public.audit_change() returns trigger language plpgsql security definer set search_path='' as $$
begin
  insert into public.admin_audit_logs(actor_id,entity,entity_id,operation) values(auth.uid(),tg_table_name,coalesce(new.id::text,old.id::text),tg_op);
  if tg_table_name='products' and tg_op='UPDATE' and old.stock is distinct from new.stock then
    insert into public.inventory_adjustments(product_id,actor_id,old_stock,new_stock) values(new.id,auth.uid(),old.stock,new.stock);
  end if;
  return coalesce(new,old);
end;$$;
create trigger products_audit after insert or update or delete on public.products for each row execute function public.audit_change();
create trigger settings_audit after insert or update on public.store_settings for each row execute function public.audit_change();
create trigger orders_audit after insert or update on public.orders for each row execute function public.audit_change();
create function public.touch_updated_at() returns trigger language plpgsql set search_path='' as $$ begin new.updated_at=now();return new;end;$$;
create trigger products_updated before update on public.products for each row execute function public.touch_updated_at();
create trigger orders_updated before update on public.orders for each row execute function public.touch_updated_at();
create trigger settings_updated before update on public.store_settings for each row execute function public.touch_updated_at();

create function public.transition_order(order_id uuid,next_status text) returns void language plpgsql security definer set search_path='' as $$
declare current_order public.orders;
begin
  if not public.is_admin() then raise exception 'Unauthorized'; end if;
  select * into current_order from public.orders where id=order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if not ((current_order.fulfillment_status='pending' and next_status in('confirmed','cancelled')) or
    (current_order.fulfillment_status='confirmed' and next_status in('preparing','cancelled')) or
    (current_order.fulfillment_status='preparing' and next_status in('shipped','cancelled')) or
    (current_order.fulfillment_status='shipped' and next_status='delivered')) then raise exception 'Invalid transition';end if;
  if next_status<>'cancelled' and current_order.payment_status<>'paid' then raise exception 'Verified payment required';end if;
  update public.orders set fulfillment_status=next_status where id=order_id;
end;$$;
revoke all on function public.transition_order(uuid,text) from public,anon;
grant execute on function public.transition_order(uuid,text) to authenticated;
revoke all on function public.audit_change() from public;
revoke all on function public.touch_updated_at() from public;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('product-media','product-media',true,5242880,array['image/webp','image/jpeg','image/png']);
create policy "Public product media" on storage.objects for select to anon,authenticated using(bucket_id='product-media');
create policy "Admin upload product media" on storage.objects for insert to authenticated with check(bucket_id='product-media' and public.is_admin());
create policy "Admin remove product media" on storage.objects for delete to authenticated using(bucket_id='product-media' and public.is_admin());
commit;

begin;

-- Explicit grants also support projects with automatic Data API grants disabled.
grant select on public.products, public.store_settings to anon, authenticated;
grant select on public.admin_users, public.orders, public.order_items,
  public.inventory_adjustments, public.payments, public.payment_events,
  public.shipments, public.admin_audit_logs to authenticated;
revoke insert, update, delete on public.products from anon, authenticated;
grant insert (slug, name, description, short_description, price_minor, age_label,
  image_url, images, categories, dimensions, safety_info, stock, published, sort_order),
  update (slug, name, description, short_description, price_minor, age_label,
  image_url, images, categories, dimensions, safety_info, stock, published, sort_order)
  on public.products to authenticated;
grant insert, update on public.store_settings to authenticated;

alter table public.products add column packaging text
  check (packaging in ('navy-yellow', 'pink-berry'));
grant insert (packaging), update (packaging) on public.products to authenticated;

alter table public.orders
  add column access_digest text unique check (access_digest ~ '^[0-9a-f]{64}$'),
  add column reservation_state text check (reservation_state in ('held', 'released', 'committed'));

create or replace function public.audit_change() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  insert into public.admin_audit_logs(actor_id,entity,entity_id,operation)
    values(auth.uid(),tg_table_name,coalesce(new.id::text,old.id::text),tg_op);
  if tg_table_name = 'products' and tg_op = 'UPDATE' then
    if old.stock is distinct from new.stock then
      insert into public.inventory_adjustments(product_id,actor_id,old_stock,new_stock)
        values(new.id,auth.uid(),old.stock,new.stock);
    end if;
  end if;
  return null;
end;
$$;

-- Provider adapter entry point. The public checkout route remains disabled.
create function public.reserve_order(
  checkout_key uuid, payload_digest text, token_digest text, customer jsonb, lines jsonb
) returns jsonb language plpgsql security definer set search_path='' as $$
declare
  order_row public.orders;
  product_row public.products;
  line record;
  delivery_zone jsonb;
  subtotal bigint := 0;
  delivery_fee integer;
begin
  if checkout_key is null or payload_digest is null or token_digest is null
    or payload_digest !~ '^[0-9a-f]{64}$' or token_digest !~ '^[0-9a-f]{64}$'
    or jsonb_typeof(lines) is distinct from 'array' then
    raise exception 'Invalid reservation request';
  end if;
  if jsonb_array_length(lines) not between 1 and 30 then
    raise exception 'Invalid cart size';
  end if;
  if (select count(distinct item.product_id) from jsonb_to_recordset(lines)
    as item(product_id uuid, quantity integer)) <> jsonb_array_length(lines) then
    raise exception 'Invalid or duplicate products';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(checkout_key::text, 0));
  select * into order_row from public.orders where idempotency_key = checkout_key;
  if found then
    if order_row.request_hash is distinct from payload_digest
      or order_row.access_digest is distinct from token_digest then
      raise exception 'Checkout key already used';
    end if;
    return jsonb_build_object('id', order_row.id, 'total_minor', order_row.total_minor,
      'payment_status', order_row.payment_status, 'reservation_state', order_row.reservation_state);
  end if;

  select zone into delivery_zone
  from public.store_settings as settings
  cross join lateral jsonb_array_elements(settings.delivery_zones) as zone
  where settings.id = 1 and settings.checkout_enabled and zone->>'id' = customer->>'city';
  delivery_fee := (delivery_zone->>'price_minor')::integer;
  if delivery_fee is null or delivery_fee < 0 then
    raise exception 'Delivery zone unavailable';
  end if;

  -- Lock in stable order. Product prices and inventory come from the database.
  for line in select * from jsonb_to_recordset(lines) as item(product_id uuid, quantity integer)
    order by product_id loop
    if line.quantity is null or line.quantity not between 1 and 99 then
      raise exception 'Invalid quantity';
    end if;
    select * into product_row from public.products where id = line.product_id for update;
    if not found or not product_row.published or product_row.stock < line.quantity then
      raise exception 'Product unavailable';
    end if;
    subtotal := subtotal + product_row.price_minor::bigint * line.quantity;
    update public.products set stock = stock - line.quantity,
      reserved_stock = reserved_stock + line.quantity where id = line.product_id;
  end loop;
  if subtotal + delivery_fee > 2147483647 then
    raise exception 'Order total outside supported range';
  end if;

  insert into public.orders(order_number, idempotency_key, request_hash, access_digest,
    customer_name, customer_phone, customer_email, delivery_city, delivery_address, notes,
    subtotal_minor, delivery_minor, total_minor, reservation_state)
  values ('JB-' || upper(replace(gen_random_uuid()::text, '-', '')), checkout_key,
    payload_digest, token_digest, customer->>'name', customer->>'phone',
    nullif(customer->>'email',''), delivery_zone->>'name', customer->>'address',
    coalesce(customer->>'notes',''), subtotal, delivery_fee, subtotal + delivery_fee, 'held')
  returning * into order_row;

  insert into public.order_items(order_id, product_id, name, quantity, unit_price_minor)
  select order_row.id, product.id, product.name, item.quantity, product.price_minor
  from jsonb_to_recordset(lines) as item(product_id uuid, quantity integer)
  join public.products product on product.id = item.product_id;

  return jsonb_build_object('id', order_row.id, 'total_minor', order_row.total_minor,
    'payment_status', order_row.payment_status, 'reservation_state', order_row.reservation_state);
end;
$$;

-- Call only after the adapter confirms that no payment can settle.
create function public.release_order_reservation(target_order uuid) returns boolean
language plpgsql security definer set search_path='' as $$
declare
  order_row public.orders;
  line record;
begin
  select * into order_row from public.orders where id = target_order for update;
  if not found or order_row.reservation_state is distinct from 'held'
    or order_row.payment_status not in ('pending','failed','cancelled') then
    return false;
  end if;
  for line in select product_id, quantity from public.order_items
    where order_id = target_order order by product_id loop
    update public.products set stock = stock + line.quantity,
      reserved_stock = reserved_stock - line.quantity where id = line.product_id;
    if not found then raise exception 'Reserved product missing'; end if;
  end loop;
  update public.orders set reservation_state = 'released', fulfillment_status = 'cancelled',
    payment_status = case when payment_status = 'failed' then 'failed' else 'cancelled' end
    where id = target_order;
  return true;
end;
$$;

create function public.guest_order_status(token_digest text) returns jsonb
language sql stable security definer set search_path='' as $$
  select jsonb_build_object(
    'order_number', orders.order_number, 'payment_status', orders.payment_status,
    'fulfillment_status', orders.fulfillment_status, 'total_minor', orders.total_minor,
    'created_at', orders.created_at, 'items', coalesce((
      select jsonb_agg(jsonb_build_object('name', item.name, 'quantity', item.quantity,
        'unit_price_minor', item.unit_price_minor) order by item.name, item.id)
      from public.order_items item where item.order_id = orders.id
    ), '[]'::jsonb)
  ) from public.orders where access_digest = token_digest;
$$;

revoke execute on function public.reserve_order(uuid,text,text,jsonb,jsonb),
  public.release_order_reservation(uuid), public.guest_order_status(text)
  from public, anon, authenticated;
grant execute on function public.reserve_order(uuid,text,text,jsonb,jsonb),
  public.release_order_reservation(uuid), public.guest_order_status(text) to service_role;

-- A held reservation must be reconciled by the payment adapter before cancellation.
create function public.guard_order_cancellation() returns trigger
language plpgsql set search_path='' as $$
begin
  if new.fulfillment_status = 'cancelled' and old.fulfillment_status <> 'cancelled'
    and (new.reservation_state = 'held' or new.payment_status in ('processing','paid')) then
    raise exception 'Reconcile payment and inventory before cancellation';
  end if;
  return new;
end;
$$;
create trigger guard_order_cancellation before update on public.orders
  for each row execute function public.guard_order_cancellation();
revoke execute on function public.guard_order_cancellation() from public, anon, authenticated;
commit;

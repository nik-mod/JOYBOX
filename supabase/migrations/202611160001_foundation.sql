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

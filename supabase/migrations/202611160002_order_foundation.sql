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

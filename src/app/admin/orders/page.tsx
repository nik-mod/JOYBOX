import {requireAdmin} from '@/lib/admin';
import {formatMoney} from '@/lib/money';
import {AdminNav,Notice} from '../_components';
import {updateOrder} from '../actions';
export default async function Orders({searchParams}:{searchParams:Promise<{state?:string;q?:string;status?:string}>}){
  const {client}=await requireAdmin();const {state,q='',status=''}=await searchParams;
  let query=client.from('orders').select('*').order('created_at',{ascending:false}).limit(200);
  if(q)query=query.ilike('order_number',`%${q.replace(/[%_]/g,'').slice(0,60)}%`);
  if(['pending','confirmed','preparing','shipped','delivered','cancelled'].includes(status))query=query.eq('fulfillment_status',status);
  const {data,error}=await query;if(error)throw new Error('შეკვეთები ვერ ჩაიტვირთა.');
  return <main><AdminNav/><h1>შეკვეთები</h1><Notice state={state}/><form className="admin-search"><input name="q" aria-label="შეკვეთის ნომერი" placeholder="შეკვეთის ნომერი" defaultValue={q}/><select name="status" aria-label="მიწოდების სტატუსი" defaultValue={status}><option value="">ყველა სტატუსი</option>{['pending','confirmed','preparing','shipped','delivered','cancelled'].map(s=><option key={s}>{s}</option>)}</select><button>ძებნა</button></form>{data?.length?data.map(order=><details className="admin-panel admin-order" key={order.id}><summary>{order.order_number} · {formatMoney(order.total_minor)} · {order.fulfillment_status}</summary><dl><dt>მომხმარებელი</dt><dd>{order.customer_name}</dd><dt>ტელეფონი</dt><dd>{order.customer_phone}</dd><dt>მისამართი</dt><dd>{order.delivery_city}, {order.delivery_address}</dd><dt>გადახდა</dt><dd>{order.payment_status}</dd><dt>შენიშვნა</dt><dd>{order.notes||'—'}</dd></dl><form action={updateOrder} className="admin-form"><input type="hidden" name="id" value={order.id}/><label>მიწოდების ახალი სტატუსი<select name="status"><option value="confirmed">დადასტურებული</option><option value="preparing">მზადდება</option><option value="shipped">გაგზავნილი</option><option value="delivered">მიწოდებული</option><option value="cancelled">გაუქმებული</option></select></label><button>სტატუსის განახლება</button></form><small>გადახდის სტატუსი ხელით არ იცვლება.</small></details>):<div className="admin-empty">შეკვეთები ვერ მოიძებნა.</div>}</main>;
}

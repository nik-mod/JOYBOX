import { deliveryLabels, paymentLabels } from '@/lib/order-labels';
import {requireAdmin} from '@/lib/admin';
import {brandCopy} from '@/lib/brand-copy';
import {formatMoney} from '@/lib/money';
import {AdminNav} from './_components';
export default async function Admin(){
  const {client}=await requireAdmin();
  const [orders,products]=await Promise.all([client.from('orders').select('id,total_minor,payment_status,fulfillment_status,order_number,created_at').order('created_at',{ascending:false}),client.from('products').select('id,name,stock,published')]);
  if(orders.error||products.error)throw new Error('მონაცემები ვერ ჩაიტვირთა.');
  const rows=orders.data??[];const revenue=rows.filter(o=>o.payment_status==='paid').reduce((sum,o)=>sum+o.total_minor,0);
  return <main id="main"><AdminNav current="/admin" /><p className="admin-muted">MyWonderBox / მაღაზიის მიმოხილვა</p><h1>ყველაფერი ერთ სივრცეში</h1><div className="admin-metrics">{[['შეკვეთები',rows.length],['დადასტურებული შემოსავალი',formatMoney(revenue)],['მზადდება',rows.filter(o=>o.fulfillment_status==='preparing').length],['მიწოდებულია',rows.filter(o=>o.fulfillment_status==='delivered').length]].map(([label,value])=><div className="admin-metric" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><h2>ბოლო შეკვეთები</h2>{!rows.length?<div className="admin-empty">შეკვეთები ჯერ არ არის.</div>:<div className="admin-table-wrap"><table><thead><tr><th>ნომერი</th><th>თანხა</th><th>გადახდა</th><th>მიწოდება</th></tr></thead><tbody>{rows.slice(0,10).map(o=><tr key={o.id}><td>{o.order_number}</td><td>{formatMoney(o.total_minor)}</td><td>{paymentLabels[o.payment_status as keyof typeof paymentLabels] ?? o.payment_status}</td><td>{deliveryLabels[o.fulfillment_status as keyof typeof deliveryLabels] ?? o.fulfillment_status}</td></tr>)}</tbody></table></div>}<h2>მცირე მარაგი</h2>{products.data?.filter(p=>p.published&&p.stock<5).map(p=><p key={p.id}>{brandCopy(p.name)} — {p.stock}</p>)}{!products.data?.some(p=>p.published&&p.stock<5)&&<p className="admin-muted">მცირე მარაგის მქონე აქტიური პროდუქტი არ არის.</p>}</main>;
}

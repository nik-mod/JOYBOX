import Link from 'next/link';
import {signOut} from './actions';
const adminLinks = [
  ['/admin', 'მიმოხილვა'], ['/admin/products', 'პროდუქტები'],
  ['/admin/orders', 'შეკვეთები'], ['/admin/settings', 'პარამეტრები'],
] as const;

export function AdminNav({ current }: { current: typeof adminLinks[number][0] }) {
  return <nav className="admin-nav" aria-label="ადმინისტრირება">
    {adminLinks.map(([href, title]) => <Link key={href} href={href}
      aria-current={current === href ? 'page' : undefined}>{title}</Link>)}
    <form action={signOut}><button type="submit">გასვლა</button></form>
  </nav>;
}

export function Notice({state}:{state?:string}){if(!state)return null;return <div role="status" className={`admin-notice ${state==='saved'?'success':''}`}>{state==='saved'?'ცვლილებები შენახულია.':state==='stale'?'პროდუქტი შეიცვალა. გადაამოწმეთ მიმდინარე მონაცემები და სცადეთ ხელახლა.':state==='transition'?'ამ მდგომარეობაში გადასვლა დაუშვებელია. შეამოწმეთ გადახდისა და მიწოდების სტატუსი.':state==='image-invalid'?'ატვირთეთ სწორი PNG, JPEG ან WebP სურათი, მაქსიმუმ 5 მბ.':state==='invalid'?'მონაცემები არასწორია. შეამოწმეთ ყველა ველი.':'შენახვა ვერ მოხერხდა. შეამოწმეთ მონაცემები და კავშირი.'}</div>;}

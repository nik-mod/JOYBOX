import Link from 'next/link';
import {hasSupabase} from '@/lib/config';
import {signIn} from '../actions';
export default async function Login({searchParams}:{searchParams:Promise<{state?:string}>}){
  const {state}=await searchParams;const ready=hasSupabase();
  return <main id="main" className="admin-login"><p className="admin-muted">MyWonderBox / ადმინისტრირება</p><h1>მაღაზიის მართვა</h1>{!ready?<div className="admin-panel"><h2>სამუშაო სივრცე მზადდება</h2><p>ადმინისტრირების გასააქტიურებლად საჭიროა მონაცემთა ბაზის დაკავშირება. მანამდე პროდუქტები, შეკვეთები და გადახდები არ შეიქმნება.</p><p><Link href="/" className="admin-button">მთავარ გვერდზე</Link></p></div>:<div className="admin-panel">{state&&<p role="alert" className="admin-notice">{state==='denied'?'ამ მომხმარებელს ადმინისტრატორის წვდომა არ აქვს.':'შესვლა ვერ მოხერხდა. შეამოწმეთ ელფოსტა და პაროლი.'}</p>}<form action={signIn} className="admin-form"><label>ელფოსტა<input name="email" type="email" required autoComplete="username"/></label><label>პაროლი<input name="password" type="password" required minLength={8} maxLength={128} autoComplete="current-password"/></label><button>შესვლა</button></form><small>წვდომა მხოლოდ ავტორიზებული ადმინისტრატორებისთვის.</small></div>}</main>;
}

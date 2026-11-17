import { storefrontMetadata } from '@/lib/metadata';
import { PolicyPage } from '@/components/information';
export const metadata = storefrontMetadata('/privacy', 'კონფიდენციალურობა', 'ინფორმაცია ჯოიბოქსის ვებგვერდზე პერსონალური მონაცემების დამუშავების შესახებ.');
export default function Page() { return <PolicyPage policy="privacy" title="კონფიდენციალურობის პოლიტიკა" intro="როგორ მუშავდება და ინახება შეკვეთისთვის აუცილებელი პერსონალური ინფორმაცია." />; }

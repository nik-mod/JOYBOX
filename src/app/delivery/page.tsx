import { storefrontMetadata } from '@/lib/metadata';
import { PolicyPage } from '@/components/information';
export const metadata = storefrontMetadata('/delivery', 'მიწოდების პირობები', 'ჯოიბოქსის უფასო მიწოდება საქართველოს მასშტაბით.');
export default function Page() { return <PolicyPage policy="delivery" title="მიწოდება" intro="გაიგე, როგორ იმუშავებს მიწოდება შეკვეთების მიღების დაწყების შემდეგ." />; }

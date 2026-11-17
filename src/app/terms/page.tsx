import { storefrontMetadata } from '@/lib/metadata';
import { PolicyPage } from '@/components/information';
export const metadata = storefrontMetadata('/terms', 'წესები და პირობები', 'ჯოიბოქსის ვებგვერდით სარგებლობისა და შეკვეთის გაფორმების წესები.');
export default function Page() { return <PolicyPage policy="terms" title="წესები და პირობები" intro="ჯოიბოქსის ვებგვერდით სარგებლობისა და ყუთების შეძენის პირობები." />; }

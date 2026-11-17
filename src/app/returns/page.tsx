import { storefrontMetadata } from '@/lib/metadata';
import { PolicyPage } from '@/components/information';
export const metadata = storefrontMetadata('/returns', 'დაბრუნების პირობები', 'ჯოიბოქსის ყუთების დაბრუნებისა და თანხის ანაზღაურების პირობები.');
export default function Page() { return <PolicyPage policy="returns" title="დაბრუნება და თანხის ანაზღაურება" intro="გაეცანი ყუთის დაბრუნებისა და თანხის ანაზღაურების პირობებს." />; }

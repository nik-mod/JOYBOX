import { storefrontMetadata } from '@/lib/metadata';
import { PolicyPage } from '@/components/information';
export const metadata = storefrontMetadata('/delivery', 'მიწოდების პირობები', 'გაეცანი ჯოიბოქსის მიწოდების ზონებსა და პირობებს გამოქვეყნების შემდეგ.');
export default function Page() { return <PolicyPage policy="delivery" title="მიწოდება" intro="მიწოდების ზონები, ღირებულება და შეკვეთის მიღების პირობები." />; }

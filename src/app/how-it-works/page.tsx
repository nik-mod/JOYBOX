import { storefrontMetadata } from '@/lib/metadata';
import { HowJourney } from '@/components/how-journey';
export const metadata = storefrontMetadata('/how-it-works', 'როგორ მუშაობს?', 'აირჩიე ყუთი, მიიღე სახლში და გახსენი სიურპრიზი — გაიცანი ჯოიბოქსის აღმოჩენის გზა.');
export default function HowPage() { return <HowJourney />; }

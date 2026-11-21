import { storefrontMetadata } from '@/lib/metadata';
import { HowJourney } from '@/components/how-journey';
export const metadata = storefrontMetadata('/how-it-works', 'როგორ მუშაობს?', 'გაიგე, როგორ შეარჩევ, მიიღებ და გახსნი MyWonderBox-ის სიურპრიზის ყუთს.');
export default function HowPage() { return <HowJourney />; }

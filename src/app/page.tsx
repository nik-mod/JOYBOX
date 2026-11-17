import { getProducts } from '@/lib/catalog';
import { Home } from '@/components/home';
import { storefrontMetadata } from '@/lib/metadata';

export const metadata = storefrontMetadata(
  '/', 'პატარა ყუთი, დიდი სიხარული', 'ჯოიბოქსის სიურპრიზის ყუთები ბავშვებისთვის. გაიგე როგორ მუშაობს და დაათვალიერე კოლექცია.',
);

export default async function Page() {
  return <Home products={await getProducts()} />;
}

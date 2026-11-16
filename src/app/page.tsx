import { getProducts } from '@/lib/catalog';
import { Home } from '@/components/home';
export default async function Page() { return <Home products={await getProducts()} />; }

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { PackagingPhoto } from './packaging-photo';

export function CollectionInvitation() {
  return <section className="collection-invitation" aria-label="ჯოიბოქსის ყუთები">
    <div><h2>ერთი ყუთი.<br/><em>ბევრი აღმოჩენა.</em></h2><p>გაიცანი შეფუთვები და არჩევამდე გადაამოწმე ასაკი და შიგთავსის აღწერა.</p></div>
    <Link href="/shop/joybox-navy"><PackagingPhoto color="navy-yellow"/><span>ბიჭებისთვის <ArrowUpRight size={20}/></span></Link>
    <Link href="/shop/joybox-berry"><PackagingPhoto color="pink-berry"/><span>გოგონებისთვის <ArrowUpRight size={20}/></span></Link>
  </section>;
}

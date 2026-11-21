import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { packagingColors, packagingDesigns, productHref } from '@/lib/packaging';
import { PackagingPhoto } from './packaging-photo';

export function CollectionInvitation() {
  return <section className="collection-invitation" aria-label="MyWonderBox-ის სიურპრიზის ყუთები">
    <div><h2>ერთი ყუთი.<br/><em>ბევრი აღმოჩენა.</em></h2><p>გაიცანი შეფუთვები და არჩევამდე გადაამოწმე ასაკი და შიგთავსის აღწერა.</p></div>
    {packagingColors.map(color => {
      const { storedSlug, title } = packagingDesigns[color];
      return <Link href={productHref(storedSlug)} key={color}>
        <PackagingPhoto color={color} /><span>{title} <ArrowUpRight size={20} aria-hidden="true" /></span>
      </Link>;
    })}
  </section>;
}

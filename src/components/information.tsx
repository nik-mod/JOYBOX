import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Truck, RotateCcw, LockKeyhole, BookOpen } from 'lucide-react';
import { getSettings } from '@/lib/catalog';
import { CollectionInvitation } from './collection-invitation';
import { plannedDelivery, previewReturnsStatus } from '@/lib/preview-copy';
import './editorial-pages.css';

const policies = {
  delivery: {
    label: 'მიწოდება', icon: Truck, heading: 'უფასო მიწოდება საქართველოს მასშტაბით', question: 'faq-delivery',
    preview: [plannedDelivery],
  },
  returns: {
    label: 'დაბრუნება', icon: RotateCcw, heading: 'დაბრუნება კატალოგის ეტაპზე', question: 'faq-returns',
    preview: [
      previewReturnsStatus,
      'გაყიდვების დაწყებამდე აქ გამოქვეყნდება, როგორ უნდა მოითხოვო დაბრუნება, ვინ ფარავს უკან გაგზავნის ხარჯს და როგორ ხდება თანხის ანაზღაურება. დაბრუნებაზე შეკითხვებისთვის დაგვიკავშირდი.',
    ],
  },
  privacy: {
    label: 'კონფიდენციალურობა', icon: LockKeyhole, heading: 'მონაცემები კატალოგის დათვალიერებისას', question: 'faq-account',
    preview: [
      'კატალოგის დათვალიერება ანგარიშის გარეშე შეგიძლია. ონლაინ შეკვეთისა და გადახდის ფორმები ამ ეტაპზე დახურულია.',
      'თუ დაგვირეკავ ან მოგვწერ, საკონტაქტო ინფორმაციას და შეკითხვის დეტალებს პასუხის გასაცემად გამოვიყენებთ. გაგვიზიარე მხოლოდ ის მონაცემები, რომლებიც პასუხისთვის გვჭირდება.',
      'ვებგვერდის მუშაობისა და უსაფრთხოებისთვის ჰოსტინგის სერვისმა შეიძლება დაამუშაოს ტექნიკური მონაცემები, მაგალითად IP მისამართი და მოთხოვნის დრო.',
      'შენ მიერ მოწოდებულ მონაცემებზე ინფორმაციის მისაღებად ან მათი გასწორების ან წაშლის მოსათხოვად დაგვიკავშირდი.',
    ],
  },
  terms: {
    label: 'წესები და პირობები', icon: BookOpen, heading: 'კატალოგით სარგებლობა', question: 'faq-ordering',
    preview: [
      'MyWonderBox ამ ეტაპზე კატალოგია. შეგიძლია გაეცნო ყუთებს, ფასებსა და ასაკობრივ რეკომენდაციებს. ონლაინ შეკვეთები და გადახდები დახურულია.',
      'ფასები მითითებულია ლარში. პროდუქტის გვერდზე მოცემული შეფუთვის ვიზუალიზაცია დიზაინს ასახავს. ვიდეოში ნაჩვენები ნივთები შიგთავსის ილუსტრაციული მაგალითებია. ზუსტი შიგთავსი შეიძლება განსხვავდებოდეს.',
      'შეკვეთების გახსნამდე გამოქვეყნდება გამყიდველის დეტალები, შეკვეთისა და გადახდის ნაბიჯები, მიწოდებისა და დაბრუნების პირობები.',
    ],
  },
} as const;

export async function PolicyPage({ policy, title, intro }: { policy: keyof typeof policies; title: string; intro: string }) {
  const settings = await getSettings();
  const savedPolicy = policy === 'delivery' ? undefined : settings.policies[policy]?.trim();
  const { icon: Icon, heading, question, preview } = policies[policy];
  const paragraphs = savedPolicy ? savedPolicy.split(/\n\s*\n/) : preview;

  return (
    <main className="page-shell container information-edition information-reading" id="main">
      <header className={`page-header policy-hero policy-hero-${policy}`}>
        <div><h1>{title}</h1><p>{intro}</p></div>
        <Icon className="policy-symbol" size={112} strokeWidth={1.15} aria-hidden="true" />
      </header>
      <div className="information-layout">
        <aside className="information-aside">
          <nav aria-label="ინფორმაცია შეძენამდე">
            {Object.entries(policies).map(([key, entry]) => (
              <Link key={key} href={`/${key}`} aria-current={policy === key ? 'page' : undefined}>
                {entry.label}<ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            ))}
            <Link href="/contact">კონტაქტი<ArrowUpRight size={15} aria-hidden="true" /></Link>
          </nav>
        </aside>
        <article className="prose policy-content">
          <h2>{savedPolicy ? policies[policy].label : heading}</h2>
          {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          <div className="policy-next-links">
            <Link className="text-link" href={`/faq#${question}`}>კითხვები და პასუხები <ArrowRight size={18} aria-hidden="true" /></Link>
            <Link className="text-link" href="/contact">დაგვიკავშირდი <ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
        </article>
      </div>
      <CollectionInvitation />
    </main>
  );
}

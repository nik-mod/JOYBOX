import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { FAQExplorer, type FAQ } from '@/components/faq-explorer';
import { PackagingPhoto } from '@/components/packaging-photo';
import { storefrontMetadata } from '@/lib/metadata';
import { ordersOpeningLater, plannedDelivery } from '@/lib/preview-copy';
import '@/components/editorial-pages.css';

export const metadata = storefrontMetadata('/faq', 'ხშირად დასმული კითხვები', 'პასუხები ჯოიბოქსის ყუთების შიგთავსის, ასაკის, შეკვეთისა და მიწოდების შესახებ.');

const questions: FAQ[] = [
  {
    id: 'faq-joybox',
    topic: 'boxes',
    question: 'რა არის ჯოიბოქსი?',
    answer: 'ჯოიბოქსი ბავშვებისთვის განკუთვნილი სიურპრიზის ყუთია. მასში სათამაშოების, თამაშებისა და შემოქმედებითი ნივთების შერჩეული კომბინაცია დაგხვდება.',
  },
  {
    id: 'faq-contents',
    topic: 'boxes',
    question: 'რა დევს ყუთში?',
    answer: 'ზუსტი შიგთავსი სიურპრიზად რჩება. ნივთების შესაძლო კატეგორიები და ასაკობრივი რეკომენდაცია თითოეული ყუთის გვერდზეა. შიგთავსი შეიძლება განსხვავდებოდეს ყუთებს შორის.',
  },
  {
    id: 'faq-ages',
    topic: 'boxes',
    question: 'რომელი ასაკისთვის არის ყუთები?',
    answer: 'ყუთები რეკომენდებულია 4–10 წლის ბავშვებისთვის. არჩევანისას გადაამოწმე ასაკი და უსაფრთხოების ინფორმაცია.',
  },
  { id: 'faq-ordering', topic: 'ordering', question: 'როდის შევძლებ შეკვეთას?', answer: ordersOpeningLater },
  {
    id: 'faq-account',
    topic: 'ordering',
    question: 'ანგარიშის შექმნა საჭიროა?',
    answer: 'კატალოგის დასათვალიერებლად ანგარიში არ გჭირდება. შეკვეთის დეტალებს გაყიდვების დაწყებამდე გამოვაქვეყნებთ.',
  },
  {
    id: 'faq-payment',
    topic: 'ordering',
    question: 'როგორ გადავიხდი?',
    answer: 'გადახდის მეთოდებს შეკვეთების მიღების დაწყებამდე გამოვაქვეყნებთ.',
  },
  { id: 'faq-delivery', topic: 'ordering', question: 'სად და რა ფასად მოიტანთ ყუთს?', answer: plannedDelivery },
  {
    id: 'faq-returns',
    topic: 'ordering',
    question: 'როგორია დაბრუნების პირობები?',
    answer: 'დაბრუნების დამტკიცებული პირობები გამოქვეყნდება შესაბამის გვერდზე შეკვეთების მიღების დაწყებამდე.',
  },
];

export default function FAQPage() {
  return (
    <main className="page-shell container faq-page-edition" id="main">
      <header className="page-header">
        <h1>რაც გაინტერესებს.</h1>
        <p>ყველაფერი, რაც ჯოიბოქსის გახსნამდე უნდა იცოდე.</p>
        <Link className="faq-product-link" href="/shop">
          <PackagingPhoto color="navy-yellow" />
          <span>გაიცანი ყუთები <ArrowUpRight size={19} aria-hidden="true" /></span>
        </Link>
      </header>
      <FAQExplorer questions={questions} />
    </main>
  );
}

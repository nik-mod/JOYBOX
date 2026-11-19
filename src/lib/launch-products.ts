import type { Product } from './types';
import { packagingDesigns, packagingColors } from './packaging';

// Owner-confirmed starting inventory for the local catalog.
export const launchProducts: Product[] = packagingColors.map((packaging, index) => ({
  id: index === 0 ? 'a301a032-06af-4001-befd-35f98ac0dc01' : 'a301a032-06af-4001-befd-35f98ac0dc02',
  slug: packaging === 'navy-yellow' ? 'joybox-navy' : 'joybox-berry',
  name: `ჯოიბოქსი — ${packagingDesigns[packaging].title}`,
  short_description: 'სიურპრიზის ყუთი ბავშვებისთვის. აირჩიე შენი საყვარელი შეფუთვა.',
  description: 'ჯოიბოქსი არის სიურპრიზის ყუთი ბავშვებისთვის. ზუსტი შიგთავსი გახსნამდე სიურპრიზად რჩება და შეიძლება განსხვავდებოდეს ყუთებს შორის. ვიზუალებში ნაჩვენები სათამაშოები საილუსტრაციო მაგალითებია. კონკრეტული სათამაშო, ბრენდი ან ნივთების რაოდენობა გარანტირებული არ არის. შეფუთვის ფერი აირჩიე პირადი სურვილით. შიგნით მოთავსებული თითოეული ნივთის ასაკობრივი ნიშნული და გამოყენების ინსტრუქცია ცალკე შეამოწმე.',
  price_minor: 2990,
  age_label: '4–10 წელი',
  stock: 25,
  published: true,
  image_url: packagingDesigns[packaging].image,
  images: [],
  categories: ['სიურპრიზის ყუთი'],
  dimensions: '22 × 20 × 9 სმ',
  safety_info: 'ყუთი შეიძლება შეიცავდეს მცირე ნაწილებს. არ მისცე 3 წლამდე ბავშვს ისეთი ნივთი, რომელიც შეიცავს მცირე ნაწილებს ან რომლის ასაკობრივი ნიშნულიც მას არ შეესაბამება. გამოიყენეთ ზრდასრულის მეთვალყურეობით. თამაშამდე მოაშორე შეფუთვა, ლენტები და დამცავი მასალები. შეამოწმე თითოეული ნივთის ასაკობრივი ნიშნული, გაფრთხილებები და ინსტრუქცია. დაზიანებული ნივთი ბავშვს არ მისცე. ეს ზოგადი მითითებები თითოეული სათამაშოს ინსტრუქციასთან ერთად გამოიყენე.',
  packaging,
}));

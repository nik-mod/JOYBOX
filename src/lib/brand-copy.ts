/** Bring saved catalog text and historical order labels into the current storefront. */
export function brandCopy(text: unknown) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/ჯოიბოქსის/g, 'ჩემი ვანდერბოქსის')
    .replace(/ჯოიბოქსში/g, 'ჩემს ვანდერბოქსში')
    .replace(/ჯოიბოქსით/g, 'ჩემი ვანდერბოქსით')
    .replace(/ჯოიბოქსს/g, 'ჩემს ვანდერბოქსს')
    .replace(/ჯოიბოქსი/g, 'ჩემი ვანდერბოქსი')
    .replace(/\b(?:joy[ -]?box|joyox|wonderbox)\b/gi, 'MyWonderBox');
}

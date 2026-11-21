import { Hand } from 'lucide-react';
import type { CSSProperties, MouseEvent } from 'react';

const toyPath = '/brand/mywonderbox/journey-toys';

const motions = {
  bounce: { duration: 940, poses: ['scale(1.04,.95)', 'translateY(-13%) rotate(-5deg)', 'translateY(-5%) rotate(2deg)', 'scale(1.02,.97)'] },
  gallop: { duration: 920, poses: ['translateX(-3%) rotate(5deg)', 'translate(12%,-13%) rotate(-8deg)', 'translate(10%,-3%) rotate(3deg)', 'translateY(-4%)'] },
  launch: { duration: 1160, poses: ['translate(-4%,4%) rotate(-5deg)', 'translate(10%,-18%) rotate(4deg)', 'translate(14%,-22%) rotate(7deg)', 'translate(3%,-8%)'] },
  stomp: { duration: 820, poses: ['translateX(3%) rotate(-6deg)', 'translate(-12%,-7%) rotate(5deg)', 'translateX(-9%) rotate(-2deg)', 'translateX(-4%)'] },
  roll: { duration: 980, poses: ['translateX(-8%)', 'translateX(18%) rotate(-5deg)', 'translateX(14%) rotate(2deg)', 'translateX(3%)'] },
  tumble: { duration: 840, poses: ['translateX(-5%) rotate(-8deg)', 'translate(9%,-13%) rotate(18deg)', 'translateX(7%) rotate(9deg)', 'rotate(-4deg)'] },
  wobble: { duration: 780, poses: ['rotate(10deg)', 'rotate(-9deg)', 'rotate(5deg)', 'rotate(-3deg)'] },
  spin: { duration: 1080, poses: ['rotate(-9deg) scaleX(.88)', 'rotate(13deg) scaleX(1.04)', 'rotate(-7deg) scaleX(.95)', 'rotate(4deg)'] },
} as const;

const toys = [
  { id: 'rocket', scene: 'intro', label: 'რაკეტის გაშვება', motion: 'launch', width: 328, height: 660, compactWidth: 149, displayWidth: 107, mobileWidth: 70 },
  { id: 'bear', scene: 'intro', label: 'დათუნიას ახტუნება', motion: 'bounce', width: 546, height: 660, compactWidth: 248, displayWidth: 265, mobileWidth: 167 },
  { id: 'rings', scene: 'intro', label: 'რგოლების შერხევა', motion: 'wobble', width: 499, height: 660, compactWidth: 227, displayWidth: 81, mobileWidth: 53 },
  { id: 'cube', scene: 'intro', label: 'თავსატეხი კუბის გადაგორება', motion: 'tumble', width: 633, height: 660, compactWidth: 288, displayWidth: 133, mobileWidth: 74 },
  { id: 'dinosaur', scene: 'film', label: 'დინოზავრის ამოძრავება', motion: 'stomp', width: 660, height: 403, compactWidth: 300, displayWidth: 182, mobileWidth: 84 },
  { id: 'top', scene: 'film', label: 'ბზრიალას დატრიალება', motion: 'spin', width: 606, height: 660, compactWidth: 275, displayWidth: 82, mobileWidth: 53 },
  { id: 'car', scene: 'film', label: 'მანქანის გაგორება', motion: 'roll', width: 660, height: 356, compactWidth: 300, displayWidth: 152, mobileWidth: 82 },
  { id: 'rabbit', scene: 'end', label: 'კურდღლის ახტუნება', motion: 'bounce', width: 325, height: 660, compactWidth: 148, displayWidth: 84, mobileWidth: 52 },
  { id: 'blocks', scene: 'end', label: 'კუბიკების დატრიალება', motion: 'tumble', width: 660, height: 544, compactWidth: 300, displayWidth: 122, mobileWidth: 73 },
  { id: 'unicorn', scene: 'end', label: 'უნიკორნის გახტუნება', motion: 'gallop', width: 660, height: 464, compactWidth: 300, displayWidth: 210, mobileWidth: 105 },
] as const;

type Toy = typeof toys[number];
const glints = {
  intro: [
    [5, 14, 40, 'blue'], [10, 77, 30, 'gold'], [35, 18, 24, 'gold'], [41, 74, 40, 'blue'],
    [56, 22, 34, 'blue'], [71, 15, 68, 'gold'], [89, 27, 30, 'blue'], [96, 59, 52, 'gold'],
    [54, 91, 28, 'gold'], [83, 90, 47, 'blue'],
  ],
  film: [
    [5, 16, 37, 'blue'], [12, 74, 43, 'gold'], [23, 23, 29, 'blue'], [31, 17, 56, 'gold'],
    [49, 80, 29, 'blue'], [76, 18, 38, 'blue'], [88, 17, 63, 'gold'], [96, 66, 35, 'blue'],
    [88, 86, 40, 'gold'],
  ],
  end: [
    [6, 25, 40, 'gold'], [14, 64, 26, 'blue'], [24, 79, 36, 'gold'], [78, 18, 35, 'blue'],
    [91, 30, 60, 'gold'], [94, 71, 29, 'blue'], [75, 77, 27, 'gold'],
  ],
} as const;

export function JourneyGlints({ scene }: { scene: keyof typeof glints }) {
  return (
    <div className={`journey-glints journey-glints--${scene}`} aria-hidden="true">
      {glints[scene].map(([x, y, size, tone]) => (
        <span key={`${x}-${y}`} data-tone={tone} style={{
          '--journey-star-x': `${x}%`,
          '--journey-star-y': `${y}%`,
          '--journey-star-size': `${size}px`,
        } as CSSProperties} />
      ))}
    </div>
  );
}

function playToy(event: MouseEvent<HTMLButtonElement>, toy: Toy) {
  const artwork = event.currentTarget.querySelector('img');
  const shadow = event.currentTarget.querySelector('.journey-toy-shadow');
  const spark = event.currentTarget.querySelector('.journey-toy-spark');
  if (!artwork || !shadow || !spark || !artwork.animate) return;

  for (const element of [artwork, shadow, spark]) {
    for (const animation of element.getAnimations()) animation.cancel();
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    spark.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], 480);
    return;
  }

  const { duration, poses } = motions[toy.motion];
  artwork.animate(['none', ...poses, 'none'].map(transform => ({ transform, easing: 'ease-in-out' })), duration);
  shadow.animate([
    { opacity: .82, transform: 'none' },
    { opacity: .37, transform: 'scale(.76)', offset: .46 },
    { opacity: .82, transform: 'none' },
  ], { duration, easing: 'ease-in-out' });
  spark.animate([
    { opacity: 0, transform: 'scale(.55)' },
    { opacity: 1, transform: 'scale(1)', offset: .42 },
    { opacity: 0, transform: 'scale(1.14)' },
  ], { duration, easing: 'ease-out' });
}

export function JourneyToys({ scene }: { scene: Toy['scene'] }) {
  return (
    <div className={`journey-toy-field journey-toy-field--${scene}`}>
      <div role="group" aria-label="ინტერაქტიული სათამაშოები">
        {toys.filter(toy => toy.scene === scene).map(toy => (
          <button className={`journey-toy journey-toy--${toy.id}`} type="button" key={toy.id} aria-label={toy.label}
            onClick={event => playToy(event, toy)}>
            <span className="journey-toy-shadow" aria-hidden="true" />
            <span className="journey-toy-spark" aria-hidden="true" />
            <img src={`${toyPath}/${toy.id}.webp`} alt="" loading={scene === 'intro' ? 'eager' : 'lazy'} decoding="async" draggable={false}
              srcSet={`${toyPath}/${toy.id}-compact.webp ${toy.compactWidth}w, ${toyPath}/${toy.id}.webp ${toy.width}w`}
              sizes={`(max-width: 600px) ${toy.mobileWidth}px, ${toy.displayWidth}px`}
              width={toy.width} height={toy.height} />
          </button>
        ))}
      </div>
      {scene === 'intro' && <p className="journey-toy-hint"><Hand size={16} aria-hidden="true" />შეეხე სათამაშოებს</p>}
    </div>
  );
}

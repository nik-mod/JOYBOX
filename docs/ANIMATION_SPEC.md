# JOYBOX motion

The Hero audit identified three competing movements. Headline masks clipped whole lines during a 74% translation, the photograph reached 1.14× while the copy moved up 76px, and the cream steps panel moved independently by 30px. A separate video trigger belonged to the later brand section. These have been replaced with the following sequences.

## Hero handoff

On entry, the two readable Georgian headline lines settle by 9px. The description and the two links follow in less than a second. The image loads normally.

From the top of the full-screen Hero until its bottom crosses the top of the viewport, one linear ScrollTrigger timeline with a 0.45-second scrub moves the photograph to 1.045× around the box. The copy moves 12px while its contrast stays stable. A shallow angled panel reveals the studio's cream along the bedroom floor ahead of the cut.

The Hero scrolls naturally. On coarse-pointer devices or viewports narrower than 900px the camera handoff is disabled. Local section cues remain available for visitors who allow motion.

## Supporting sections

| Surface | Motion |
| --- | --- |
| How It Works | One scroll timeline seeks the cream studio footage and masks the three Georgian steps in sequence at 30% and 60%. The standalone page retains its original step layout. |
| Discovery | A pinned GSAP timeline moves two articulated cartons through a shared 3D orbit. Hinged lids, concept toys, studio lighting and masked Georgian copy follow the same playhead. The catalog cards keep their existing interactions. See [the orbital showcase notes](ORBITAL-SHOWCASE.md). |
| Product details | Gallery images settle into the same fixed image frame on arrival and thumbnail selection. Purchase controls are immediately available through their existing state. |
| Brand story | The original logo artwork settles via short scroll-linked scale and travel beside the copy. The unboxing video is exclusive to the homepage How It Works chapter. |
| Why JOYBOX | Benefit icons settle in sequence while their copy stays in place. |
| FAQ | The homepage question list slides into position. Native details controls retain keyboard support and the answer has a short open transition. |
| Closing and footer | The closing heading moves horizontally while the CTA settles separately. The footer logo rises gently and navigation stays in place. |

## Cleanup and verification

One client registration module supplies GSAP and ScrollTrigger. Each surface owns its animations through `useGSAP` and cleans them up through media-query context reversion. Product grid contexts are refreshed when the ordered product IDs change. The CSS and GSAP paths both respect reduced motion. Layout dimensions, tab order and the document's scroll behavior remain native.

Production Chromium checks verified the Hero at desktop and mobile, reverse camera movement, the How It Works jump link, keyboard shopping CTA, cart route and mobile menu. See [UNBOXING-VIDEO.md](UNBOXING-VIDEO.md) for the supplied footage, measured scroll and seek positions, and fallback tests.

Technical references: [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) and [GSAP React integration](https://gsap.com/resources/React/).

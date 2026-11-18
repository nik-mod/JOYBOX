# JOYBOX art direction — 18 November 2026

This pass builds on the existing site and approved photography. It addresses the seven screenshots supplied with the request to improve the box contents, hero, typography, and supporting pages.

## Implemented

- Both 3D boxes now display six arranged toys. Existing licensed teddy, rabbit, unicorn, dinosaur, car, and building-block assets are reused with the existing modeled accessories. Larger rear toys and visible foreground pieces fill the interior without introducing additional model downloads.
- Refined printed cardboard materials, folded tissue geometry, inside-lid Georgian printing, lighting, and contact shadows. The two editions retain their existing branded packaging and reversible orbital sequence.
- Bounded pointer camera inspection in the 3D scene. It renders on demand and releases listeners, tweens, textures, materials, geometry, and canvas resources when unmounted.
- Hero photography retains its composition with a slightly stronger slow camera move, pointer response, a subtle warm light layer, masked lettering, and direct boys/girls collection links. Pause control, offscreen suspension, and reduced-motion handling remain available.
- Added self-hosted Noto Serif Georgian for display accents, paired with the existing sans serif for controls and reading text. Font file: 20,356 bytes; SIL Open Font License is included in `public/fonts/OFL-serif-georgian.txt`. Source: https://fonts.google.com/noto/specimen/Noto%2BSerif%2BGeorgian.
- Distinct navy, berry, cream, and yellow compositions for the homepage benefits/FAQ, About, FAQ page, contact, and information pages. The About product selector changes both its photograph and destination. Information pages include product links and a drawn icon introduction.
- Missing delivery, returns, and contact information remains explicitly unavailable. This visual change does not invent business terms, stock quantities, or payment availability.

## Verification

Production build passed. `git diff --check` passed.

Isolated headless Chrome was used throughout; the user's browser and desktop were not controlled. Production preview: `http://localhost:3098`.

`docs/qa/art-direction/interaction-report.json` records:

- Hero defers video and WebGL; pointer movement and the pause control work.
- Stationary 3D produces no additional draw calls; pointer inspection produces renders.
- The 3D sequence reverses between editions, and navigation releases its canvas and pin spacers.
- About product selection supports keyboard operation and rapid reversals.
- 40 route/viewport checks at 320, 390, 768, 1440, and 1920 pixels pass without horizontal overflow.
- Reduced motion retains static composition and product choice without 3D pins.
- No browser runtime errors.

The local 60-frame scroll sample recorded a 6.1 ms median and 6.7 ms p95 requestAnimationFrame interval in headless Chrome using Intel UHD Graphics via ANGLE/D3D11. This is a single local sample, not a cross-device frame-rate guarantee or a GPU execution-time measurement.

`docs/qa/art-direction/commerce-report.json` records passing URL filters/browser back, animated filter panel/Escape focus return, cart limits and persistence, keyboard/interruptible product disclosures, disabled unconfigured checkout, FAQ search/topics, and mobile-menu navigation/focus restoration. No browser runtime errors were reported.

Final screenshots are in `docs/qa/art-direction/`. Visually reviewed both open boxes, desktop hero, supporting page compositions, and mobile typography. The final refinement softened harsh floor shadows, exposed the paint palette, and shortened the About closing headline to avoid an orphaned question mark on mobile.

## Design audit and limits

The design detector's remaining accent-rule warning refers to the intentional horizontal 3px scroll-linked gold rule at the top of the homepage benefits section. It is not a decorative card side tab; it was retained.

The toys remain illustrative existing 3D assets with different source styles. This pass improves their arrangement, material presentation, grounding, and interaction; it does not claim that every toy is a newly authored photorealistic model or promised box content. Small screens and reduced-motion visitors retain the approved photography fallback. No database, checkout, or deployment changes are included in this pass.

# Visual refinement — 17 November 2026

Implemented against the ten supplied screenshots; approved logo and hero retained.

- Landscape catalog frames, full two-column width and object-fit contain preserve packaging edges.
- Brand story now uses opposing scroll-linked packaging compositions and a three-step editorial footer.
- Why JOYBOX includes age guidance and distinct illustrated benefit rows.
- About page features supplied packaging rather than a repeated logo image; outdated collection copy replaced with confirmed price and ages.
- Empty cart uses approved product imagery. Policy pages have contextual navigation and packaging composition; contact has a branded visual. Missing policies/contact details remain honestly unavailable.
- Shared route arrival motion uses pathname-aware GSAP cleanup without delaying navigation or capturing clicks.
- Native FAQ disclosures animate opening and closing with interruption handling. Enter/Space behavior and reduced-motion native fallback retained.
- Orbital showcase: enlarged hero toys, higher placement, increased environment lighting and hardware render pixel budget (2.4M pixels, max DPR 2), higher hardware shadow resolution. Software renderer remains bounded at 550k pixels.

## Verification

Production build and TypeScript passed; all 13 commerce/database tests passed. Isolated headless Chrome (no user screen control) checked homepage, shop, About, FAQ, cart, delivery and contact at 360/390/768px and desktop routes at 1440px: no horizontal overflow or page errors. FAQ forward/reverse/rapid toggles, keyboard and reduced motion passed. Add to cart persisted after navigation/reload. Screenshots are in docs/qa/refined-*.png.

## Limits

Toy geometry has not been replaced: the supplied licensed miniature doll and unicorn assets remain visibly stylized. Rendering/scale improvements do not make them photorealistic. Premium replacement models with approved licenses are still needed for that final standard. Visuals remain illustrative contents, not inventory promises. Physical-device GPU performance has not been measured. Hosted checkout/payment dependencies are unchanged.


## Second art-direction pass

Replaced the simplified teddy with a detailed Google Scanned Objects bear, restored the 2048px unicorn asset, removed the small doll/ladybug, and curated both reveals with larger primary toys and visible foreground accessories. New model attribution is in public/brand/orbit-models/credits.txt. No generated toy imagery or unverified inventory was added.

About now has a studio split lead, editorial brand statement, three transparent principles and a product closing composition. Homepage story now uses cream studio styling; FAQ has a navy editorial introduction, live search, numbered disclosures and useful contact navigation. Help pages have stronger hierarchy; contact and empty cart use calmer packaging compositions. Approved hero and logo remain intact.

A mobile Georgian-word overflow found during QA was corrected with responsive type and safe wrapping. Build/type check and all 13 tests pass. Isolated Chrome checks at 360/390/768/1440px found no page errors or horizontal overflow after the fix. Cart persistence passed. Final screenshots are studio-*.png and refined-*-390.png. Full-page screenshots may capture headings before their scroll reveal; verify by scrolling to the section.


## Hero motion pass

Added independently controlled camera layers: slow photographic zoom with visible pause/resume control, a reversible ScrollTrigger lens move, and bounded desktop pointer response. Headline lines reveal through masks with coordinated supporting copy and CTA timing. Camera work pauses offscreen and while the document is hidden; all motion is removed for reduced-motion preferences. Listeners, media contexts and triggers are cleaned up.

Build and TypeScript passed. Isolated Chrome verified changing camera transforms, stable paused transforms, forward scroll and return to identity, CTA navigation, 390px layout without overflow and reduced-motion fallback. No page errors. Reverse motion was checked by transform identity; CSS `none` and an identity translate are equivalent. Screenshots: hero-motion-desktop.png and hero-motion-mobile.png.

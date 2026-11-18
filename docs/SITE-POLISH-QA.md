# JOYBOX refinement and verification — 18 November 2026

This pass refines the existing Georgian storefront and supplied brand photography. It adds no generated images, invented reviews, product certifications, delivery promises, or contact details.

## Motion and loading

- Route arrival animates the page heading instead of the entire `main` element. Fixed ScrollTrigger pins therefore retain a stable ancestor, including during client navigation.
- Homepage video and orbital timelines use moderated scrub smoothing. Forward and reverse scrolling converge to the same visual state; navigation removes pins and the WebGL canvas.
- Video loads only near its section after scrolling starts. The 3D scene loads within 400px of the viewport. Reduced-motion and data-saving preferences retain still compositions.
- The homepage video has a bounded loading timeout, seek-error handling, and a static fallback that releases the pin.
- FAQ and product disclosures share interruptible height animation with consistent padding. Native keyboard behavior remains available; reduced motion uses native expansion.
- Mobile navigation has a brief GSAP entrance/exit, Escape handling, focus restoration, and immediate route navigation.
- Scroll-linked movement is limited to imagery on supporting pages. Text remains readable, and the homepage's duplicate decorative numbers no longer overlap mobile headings.

## Page refinements

- Shop: direct all/boys/girls filters, existing URL-backed search and advanced filters, smoother menus, full packaging composition, responsive image sources, and clearer price/action hierarchy.
- Product details: shorter display titles, price and availability together, age and dimensions above purchase controls, concise contents guidance, accessible disclosures, and quantity controls that account for items already in the cart.
- Cart: linked product photography in the empty state, clearer product discovery, persistent contents, and guarded quantity controls.
- About: cleaner Georgian heading composition, restrained image movement, and visible supporting copy.
- FAQ: topic navigation, live search, clear/reset actions, useful empty results, and smooth native disclosures.
- Contact: contained image composition, useful next destinations, and honest unavailable-contact state.
- Delivery, returns, privacy and terms: consistent reading layout and related-page navigation. Approved settings content is preserved; unpublished terms remain explicitly unavailable.
- Error, missing-page and invalid-order states: clearer semantic headings and recovery paths.
- Footer: concise brand context and improved touch targets.

## Measured loading change

Fresh isolated desktop Chrome sessions at 1440 × 900, on the same local production preview, recorded resource transfer sizes at the initial homepage view:

| Measurement | Before | After |
| --- | ---: | ---: |
| Resource transfer bytes | 7,832,685 | 707,847 |
| Approximate decimal MB | 7.83 | 0.71 |

This is a **91% reduction in initial resource transfer**, primarily from deferring video and toy models. Those assets still download when the visitor approaches their sections. This is not a field Core Web Vitals score or a claim that total session traffic fell by 91%.

Raw evidence: `qa/site-polish/resources-before.json` and `resources-after.json`.

## Verification

- Production build and TypeScript checks passed; all 13 existing commerce/database tests passed.
- Forty route/viewport checks covered 20 routes at desktop 1440px and mobile 390px, with no runtime errors, horizontal overflow, or broken loaded images. The missing-page route correctly returns 404.
- Forty-eight additional layout checks covered eight key routes at 320, 360, 390, 768, 1024 and 1920px.
- Fifteen interaction checks passed: URL filter/history restoration, filter dismissal, product/cart limits and persistence, interrupted disclosure transitions, FAQ filtering, mobile menu/focus, homepage media loading and forward/reverse scrubbing, orbital edition switching, navigation cleanup, and reduced motion.
- The existing 16-check cinematic How It Works browser suite passed, including rapid/reverse seeking, interruption, chapter buttons, mobile composition, network failure fallback, byte ranges, and Chromium/WebKit/Firefox seeking.
- Final screenshots were inspected for product photo cropping, Georgian text wrapping, mobile contact/cart/FAQ layouts, studio composition, and mobile benefit labels. The label overlap found during visual review was corrected and checked again.

Reports and screenshots are in `docs/qa/site-polish/`; dedicated video results are in `docs/qa/how-video/browser-report.json`. All browser checks used isolated headless sessions without controlling the user's screen.

## Remaining launch dependencies

The preview still uses the existing guarded checkout. Payment provider setup, approved delivery/policy/contact details, actual numeric inventory, production hosting and hosted end-to-end commerce verification remain separate launch tasks listed in `REMAINING-TASKS.md`.

Admin route checks cover their current unauthenticated/configuration states; they do not establish an authenticated hosted-admin audit. Physical-device GPU performance, real iOS Safari, screen-reader testing and deployed field metrics remain unverified. Existing licensed toy models are retained; this pass does not claim to replace their geometry or make illustrative contents an inventory promise.

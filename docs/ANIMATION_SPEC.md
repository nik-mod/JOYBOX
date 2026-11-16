# Motion

Implementation: `src/components/home.tsx`, GSAP with ScrollTrigger and `@gsap/react` useGSAP scope/cleanup.

Hero text enters with 24px vertical displacement and opacity over 0.75 seconds, staggered by 0.1 seconds. The scene settles in with a subtle opacity transition. Supporting sections reveal once with 24px motion over 0.65 seconds as they enter view.

At widths of at least 900px, the hero background shifts 60px and scales to 1.035 through the hero's scroll range. Scrub is 0.6 and ease is `none`; reverse scrolling reverses that same timeline. No pinning or scroll hijacking is used. Mobile omits this background movement.

`prefers-reduced-motion: reduce` bypasses GSAP effects and removes CSS transitions/smooth scrolling. Content is visible in base styles. Only transforms and opacity are animated. Match-media contexts and useGSAP cleanup remove triggers on navigation.

This is a 2D cinematic treatment. There is no simulated interactive 3D lid or claim of genuine 3D. Real 3D would require approved geometry/material assets and separate performance QA.

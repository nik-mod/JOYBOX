# Homepage orbital showcase

The collection uses a perspective Three.js scene beside Georgian HTML product copy. Each carton measures 22 × 20 × 9 cm. The beveled walls have a 2.6 mm board thickness, a raised tissue lining, and a rear-hinged lid with tucked side tabs and score details. Textures come from the supplied navy and berry dielines. The printed front, lid and side panels use artwork with the production guides removed. The rear uses the solid printed panel from the same sheet. Static layouts use the original packaging photos.

The plush bear and rabbit use fabric maps and sheen. Imported models also include a detailed toy car and scans of a dinosaur, unicorn, miniature doll, building blocks and a decorative bead. The physical surfaces of the retro rocket, puzzle cube, bracelets and paint set were modeled for the showcase. All toys are labeled as illustrations. [Model credits and licenses](../public/brand/orbit-models/credits.txt).

Each CTA resolves to a published product for that packaging when available. Otherwise it opens the matching packaging preview without a price.

| Scroll progress | Composition |
| --- | --- |
| 0–15% | Both closed cartons enter the cream studio and the camera moves closer. |
| 13–42% | The navy carton turns toward the camera. The lid hinges back while the toys rise in sequence and settle in the packing paper. |
| 42–70% | The navy toys retract and the lid closes. The closed boxes travel around opposite sides of the invisible ellipse. The low camera pulls back for clearance as the scene changes to the berry edition. |
| 70–90% | The berry lid opens and the second set of toys rises into view. |
| 90–100% | The berry pose holds and the camera eases back into the exit. |

One GSAP ScrollTrigger playhead drives both models, studio lighting, background color and typography. A prefiltered studio environment adds broad reflections. The renderer draws on demand and uses a lower drawing-buffer limit and shadow resolution for software-rendered contexts. Native buttons let visitors jump to either settled pose with a keyboard. Touch, short or narrow screens, reduced motion, WebGL failure and late loads use the supplied photos. The scene loads near the viewport and releases its renderer, observer and asset resources on unmount, breakpoint changes and context loss.

The eight optimized GLBs total about 2.23 MB. Production Chromium checks covered the closed entrance, both open arrangements, the crossover, fast scroll, keyboard selection, shopping navigation and the photo fallbacks. The navy composition matched pixel for pixel when returning to the same scroll position in reverse. The crossover fit at 1040×960, 1440×900 and 1920×1080. Resizing across the breakpoint remounted the canvas, and a forced WebGL loss restored the active photo and its link focus. Reduced motion and the 390px touch layout made no model or orbital texture requests.

At 1440×900, Chromium with SwiftShader used a roughly 340,000-pixel drawing buffer. One standalone 68-frame scroll sample measured about 16.7 ms median and 16.8 ms p95 between animation frames. This measures browser frame cadence. Physical mobile devices and dedicated GPU performance remain unverified. The production build, type check and all 13 automated tests passed.

Implementation references [Three.js WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html) and [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).

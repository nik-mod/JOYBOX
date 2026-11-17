# Homepage How It Works film

The source is the owner-supplied `asd.mp4`, a 10-second, 1280×720 studio shot at 24 fps. The closed navy and yellow box turns from about 3 seconds, the lid begins lifting around 4.5 seconds, and the toys become visible after 6 seconds. The shipped edit starts at source time 1.25s and ends before the later close-up crops the lid and carton. The cut uses the source colors and packaging artwork.

`public/brand/joybox-unboxing.mp4` is the 5.5-second, 2.29 MB silent H.264 edit. It keeps the source resolution and color metadata and places the MP4 metadata before the media data. Keyframes are three frames apart (125 ms). The WebP stills are from the first and last frames of the same edit.

| Scroll progress | Film and Georgian copy |
| --- | --- |
| 0–30% | “აირჩიე ყუთი” shows the closed box. The edit reaches 1.92s as the turn starts. |
| 30–60% | “მიიღე სახლში” follows the turn toward the camera. The edit reaches 3.25s at the start of the opening. |
| 60–100% | “გახსენი სიურპრიზი!” accompanies the rising lid and toy reveal. The open frame holds for the last 5% of travel. |

The Hero retains the approved navy bedroom photograph. A shallow cream cut leads into the studio. The film and its poster share a feathered frame over the full-bleed cream surface, with the box on the right and text on the left. The studio floor blends into the packaging showcase.

One GSAP timeline masks each outgoing step before uncovering the next and updates the paused video through `currentTime`. Seek requests are rounded to the nearest source frame and coalesced to the latest target. Desktop pinning runs for 700–1100px. If the film loads after the visitor enters the stage, the unpinned timeline starts at the section anchor. Reduced motion, touch and smaller screens show the open still and all three steps without requesting video. A media failure keeps the poster and step copy visible. Cleanup releases the observer, listeners, source, pending seek and trigger.

Production browser checks passed in Chromium, Firefox and Playwright WebKit. At 1440×900 the stage pinned for 927px. The closed box, turn, lid lift and fully open frame appeared at approximately 1.0s, 2.63s, 3.7s and 5.46s. Reverse scrolling returned to the turn. The checks also covered rapid scroll changes, holding the selected frame, resizing, keyboard navigation, browser Back, reduced motion and HTTP byte-range serving. Chromium checks verified the image fallback after a failed video request and the unpinned handoff after a delayed request. Touch widths of 360px, 390px and 768px made zero video requests. Physical iOS Safari and deployed media serving remain unverified.

The production build, TypeScript check and all 13 automated tests passed.

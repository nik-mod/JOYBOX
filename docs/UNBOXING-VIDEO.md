# Homepage How It Works film

The source is the owner-supplied `asd.mp4`, a 10-second, 1280×720 studio shot at 24 fps. The closed navy and yellow box turns from about 3 seconds, the lid begins lifting around 4.5 seconds, and the toys become visible after 6 seconds. The shipped edit starts at source time 1.25s and ends before the later close-up crops the lid and carton. The cut uses the source colors and packaging artwork.

`public/brand/joybox-unboxing.mp4` is the 5.5-second, 5.93 MB silent H.264 edit, encoded directly from the source at CRF 16. It keeps the source resolution, frame rate, and color metadata, with MP4 metadata placed before the media data. Every frame is a keyframe, so a seek can decode that frame independently. The WebP stills are from the first and last frames of the same edit.

| Scroll progress | Film and Georgian copy |
| --- | --- |
| 0–30% | “აირჩიე ყუთი” shows the closed box. The edit reaches 1.92s as the turn starts. |
| 30–60% | “მიიღე სახლში” follows the turn toward the camera. The edit reaches 3.25s at the start of the opening. |
| 60–100% | “გახსენი სიურპრიზი!” accompanies the rising lid and toy reveal. The open frame holds for the last 5% of travel. |

The Hero retains the approved navy bedroom photograph. A shallow cream cut leads into the studio. The film and its poster share a feathered frame over the full-bleed cream surface, with the box on the right and text on the left. The studio floor blends into the packaging showcase.

One GSAP timeline masks each outgoing step before uncovering the next and updates the paused video through `currentTime`. It issues one seek at a time and keeps the newest target when the decoder is busy. Desktop pinning runs for 940–1500px, with 1,242px of travel at a 900px viewport height. The video plate is capped at 1,700 CSS pixels to limit enlargement. If the film loads after the visitor enters the stage, the unpinned timeline starts at the section anchor. Reduced motion, touch and smaller screens show the open still and all three steps without requesting video. A media failure or stuck seek returns the scene to the poster and step copy. Cleanup releases the observer, listeners, source, seek timer, and trigger.

The updated production build was checked for forward and reverse scrubbing, rapid direction changes, frame hold, resize cleanup, reduced motion, failed media fallback, and byte-range serving. At 1440×900 the closed box, turn, lid lift, and final reveal appeared at approximately 0.96s, 2.59s, 4.38s, and 5.46s. A continuous headless Chrome pass completed 118 ordered seeks during a 4.2-second scroll. Physical iOS Safari and deployed media serving remain unverified.

The production build, TypeScript check and all 13 automated tests passed.

The dedicated /how-it-works route uses a separate two-box video. See HOW-IT-WORKS-CINEMA.md for its sequence, encodes and verification.

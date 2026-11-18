# How It Works — cinematic page report

Implemented 18 November 2026. Scope: `/how-it-works`. Existing homepage cinema, Supabase, authentication, cart and checkout logic are unchanged.

## Composition and behavior

A midnight editorial introduction leads into a borderless pinned film stage. Georgian copy sits beside the video on desktop and above it on mobile. The film keeps its 16:9 ratio using `object-fit: contain`; it is never stretched or cropped to fill the viewport. A subtle edge mask blends the footage into the page without a color grade. The original clip's particles and lighting are baked into the supplied footage; no new effects were added.

Three masked chapters and a thin scroll-position line follow the film. Chapter buttons support keyboard activation and seek to their corresponding story position. A skip link bypasses the pinned section. The final frame holds before normal scrolling continues into the catalog CTA.

GSAP ScrollTrigger pins for 300vh on desktop/tablet and 250vh on narrow screens. No wheel or touch events are intercepted. The video never calls `play()` and has no autoplay, loop or native controls. Scroll progress writes frame-quantized `currentTime`; requests coalesce while a seek is pending. Reversing scroll reverses the same timeline. Stopping holds the target frame after the short 0.28-second scrub smoothing settles.

## Source inspection and derivatives

Owner source: `JOYBOX_product_animation_opening…_9b197d4a_1080p.mp4` on the Desktop. The original is preserved unchanged; generated derivatives are in public/brand.

- Original: 9,257,260 bytes; H.264 High, 1920 × 1080, 24 fps, 358 video frames, 14.9167s video duration. The container including AAC audio is about 14.93s. Long original keyframe spacing was unsuitable for responsive random seeking.
- Original SHA-256: `0e6fee17ca85d0df0c4b18f35f3942fc6c049f0cdda343f3d9e7b9b9550c9b03`.
- Desktop: `how-journey.mp4`, 1920 × 1080, 13,182,197 bytes; H.264, CRF 21, no B-frames, maximum keyframe gap 0.25s.
- Mobile: `how-journey-mobile.mp4`, 960 × 540, 4,873,660 bytes; H.264, CRF 22, no B-frames, maximum keyframe gap 0.1667s.
- Silent encodes preserve the source frame rate and colors. Both have `moov` before `mdat` for fast-start. Desktop is deliberately larger than the source because of the much shorter GOP; mobile reduces transfer size.
- Closed poster: 37,472 bytes; final reveal still: 79,980 bytes. Both are WebP frames extracted from this exact source.
- Reproduce with `python scripts/encode-how-journey.py SOURCE.mp4 --ffmpeg PATH_TO_FFMPEG`. FFmpeg is a development tool, not an application dependency. Reinspect timing if replacing the source.

| Scroll interval | Footage / chapter |
| --- | --- |
| 0–28% | Closed boxes, source 0–2.60s; აირჩიე ყუთი |
| 28–47% | Anticipation / subtle lid movement, source 2.60–4.39s; მიიღე სახლში |
| 47–94% | Opening and toy emergence, source 4.39–14.875s; გახსენი სიურპრიზი! |
| 94–100% | Hold the final usable frame |

The delivery chapter is a visual metaphor, not an artificial delivery scene or a shipping promise. The page labels the film conceptual, explains that contents vary, and retains the notice that payment/delivery details are pending.

## Accessibility, loading and failure handling

Reduced motion, Save-Data and very short viewports use a static reveal with all three chapters and no video request or pin. Ordinary mobile screens get the smaller encoded video. Media loading starts within 1200px of the section; the poster stays present until video data is ready. A 15-second initial timeout or media error restores the static narrative. Three consecutive seeks taking over 900ms also switch to a still. A failure while pinned preserves the visible section anchor when removing pin geometry.

Cleanup removes the observer, events, timeout, pending animation frame, ScrollTrigger and media source. Match-media contexts revert their animations. Navigation releases the pin spacer.

## Executed verification

- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm test`: 13/13 existing commerce/database tests passed.
- No lint script is configured.
- `node tests/how-journey.browser.cjs`: 16 checks passed against the production preview. Evidence: `docs/qa/how-video/browser-report.json` and final-*.png screenshots.
- Chrome: forward samples 1.083 / 3.333 / 6.125 / 12.833 / 14.875s; reverse returned to 3.333s; stationary scroll held its frame; rapid changes converged on the latest target.
- Measured Chrome seek-event completion across 173 local samples: median 1.1ms, p95 9.5ms, maximum 23.6ms. These are local media-event timings, not field performance or guarantees of frame-perfect composition. Video seeking was reliable enough that a heavier canvas/image-sequence implementation was not warranted.
- Chromium/Chrome, Playwright WebKit and Firefox forward/reverse seeking passed with no page errors. Browser differences stay within the tested tolerance; H.264 seeking is not claimed to be frame-perfect on every decoder.
- Responsive resizing at 360, 390, 768, 1024, 1440 and 1920px passed without horizontal overflow. Mobile source selection and touch/mobile Chrome emulation passed.
- Keyboard milestone activation, mobile navigation while pinned, final CTA navigation and pin cleanup passed.
- Reduced motion produced zero video requests, no pin and three readable chapters. An aborted video request restored the static narrative.
- Local server returned HTTP 206 and a correct Content-Range for the encoded MP4.
- Mechanical design detector: no findings on the changed route/component/CSS.

## Limits before deployment

Physical iOS Safari and Android devices have not been tested. Playwright WebKit and touch emulation are useful checks but do not establish physical-device decoder or GPU behavior. Verify byte ranges and caching on the deployment host, profile the video over mobile networks and measure field Core Web Vitals there. Payment activation and business launch blockers are outside this page change.

import { gsap, ScrollTrigger } from './motion';

const assets = ['box-interior', 'core', 'arm-left', 'arm-right', 'leg-left', 'leg-right'] as const;
type Art = Record<typeof assets[number], HTMLImageElement>;
const crop = { x: 875, y: 65, width: 625, height: 838 };
const legLayerSize = 184;
const radians = Math.PI / 180;
export const bearMotion = '(min-width: 320px) and (min-height: 600px) and (max-aspect-ratio: 12/5) and (prefers-reduced-motion: no-preference)';

function poseAtStart() {
  return { x: 1090, y: 415, tilt: 0, squash: 1, wallShadow: 0,
    left: 38, right: -43, elbowLeft: 0, elbowRight: -5, grip: 0,
    braceLeft: 1, braceRight: 1, step: 0, leadExtension: 0, tuck: .18, plant: 0, seat: 0, shadow: 0 };
}

const restingPaws = [{ x: 1020, y: 487 }, { x: 1248, y: 468 }];
const pawsOnRim = [{ x: 1010, y: 506 }, { x: 1237, y: 490 }];
const feetOnRug = [{ x: 1148, y: 851 }, { x: 1254, y: 854 }];
const seatOnRug = { x: 1198, y: 848 };

function pawPosition(index: number, grip: number) {
  const rest = restingPaws[index];
  const rim = pawsOnRim[index];
  return { x: gsap.utils.interpolate(rest.x, rim.x, grip), y: gsap.utils.interpolate(rest.y, rim.y, grip) };
}

function clipInterior(ctx: CanvasRenderingContext2D, grip = 0, braceLeft = 0, braceRight = 0) {
  ctx.beginPath();
  ctx.moveTo(crop.x, crop.y);
  ctx.lineTo(crop.x + crop.width, crop.y);
  ctx.lineTo(crop.x + crop.width, 473);
  ctx.lineTo(922, 505);
  ctx.lineTo(crop.x, 494);
  ctx.closePath();
  for (const [index, brace] of [braceLeft, braceRight].entries()) {
    if (brace <= 0) continue;
    const paw = pawPosition(index, grip);
    ctx.moveTo(paw.x + 39 * brace, paw.y - 5);
    ctx.ellipse(paw.x, paw.y - 5, 39 * brace, 32 * brace, 0, 0, 2 * Math.PI);
  }
  ctx.clip();
}

// Transverse strips follow a continuous bend through the elbow. The sleeve
// and paw stay connected. During the climb the strip follows a curve to the rim.
function drawArm(
  ctx: CanvasRenderingContext2D, image: HTMLImageElement, p: ReturnType<typeof poseAtStart>, side: -1 | 1,
) {
  const x = 76 * side;
  const angle = side === -1 ? p.left : p.right;
  const bend = side === -1 ? p.elbowLeft : p.elbowRight;
  const brace = side === -1 ? p.braceLeft : p.braceRight;
  const paw = pawPosition(side === -1 ? 0 : 1, p.grip);
  ctx.save();
  ctx.translate(x, 32);
  const startX = 21 * Math.sin(angle * radians);
  const startY = -21 * Math.cos(angle * radians);
  const pitch = p.tilt * radians;
  const dx = paw.x - p.x;
  const dy = paw.y - p.y;
  const endX = dx * Math.cos(pitch) + dy * Math.sin(pitch) - x;
  const endY = (dy * Math.cos(pitch) - dx * Math.sin(pitch)) / p.squash - 32;
  const reach = Math.hypot(endX - startX, endY - startY);
  const elbowX = (startX + endX) / 2 + side * Math.min(22, reach * .16);
  const elbowY = (startY + endY) / 2;
  let px = startX;
  let py = startY;
  const rows = 28;
  const length = 166;
  for (let row = 0; row < rows; row++) {
    const part = row / rows;
    const elbow = gsap.utils.clamp(0, 1, (part - .31) / .38);
    const turn = (angle + bend * elbow * elbow * (3 - 2 * elbow)) * radians;
    const sy = image.height * part;
    const sourceHeight = Math.min(image.height - sy, image.height / rows + 15);
    const rest = 1 - part;
    const bendX = rest * rest * startX + 2 * rest * part * elbowX + part * part * endX;
    const bendY = rest * rest * startY + 2 * rest * part * elbowY + part * part * endY;
    const tangentX = 2 * (rest * (elbowX - startX) + part * (endX - elbowX));
    const tangentY = 2 * (rest * (elbowY - startY) + part * (endY - elbowY));
    const vx = -Math.sin(turn) * length;
    const vy = Math.cos(turn) * length;
    ctx.save();
    ctx.translate(gsap.utils.interpolate(px, bendX, brace), gsap.utils.interpolate(py, bendY, brace));
    ctx.rotate(Math.atan2(-gsap.utils.interpolate(vx, tangentX, brace), gsap.utils.interpolate(vy, tangentY, brace)));
    const stripLength = gsap.utils.interpolate(length, Math.hypot(tangentX, tangentY), brace);
    ctx.drawImage(image, 0, sy, image.width, sourceHeight, -42, 0, 84, stripLength * sourceHeight / image.height);
    ctx.restore();
    px += vx / rows;
    py += vy / rows;
  }
  ctx.restore();
}

function drawCore(ctx: CanvasRenderingContext2D, image: HTMLImageElement, compression: number, taper: number) {
  const upperHeight = .6;
  const upperSource = image.height * upperHeight;
  const upperDrawn = 386 * upperHeight;
  ctx.drawImage(image, 0, 0, image.width, upperSource, -143, -184, 285, upperDrawn);
  // Leave the head and bow stable as the belly compresses under the tucked legs.
  const lowerTop = -184 + upperDrawn;
  const lowerSource = image.height - upperSource;
  const lowerDrawn = 386 - upperDrawn;
  const bands = 10;
  for (let band = 0; band < bands; band++) {
    const from = band / bands;
    const to = (band + 1) / bands;
    const top = lowerDrawn * from - compression * from * (.35 + .65 * from);
    const bottom = lowerDrawn * to - compression * to * (.35 + .65 * to);
    const inset = 142.5 * taper * from * from;
    ctx.drawImage(image, 0, upperSource + from * lowerSource, image.width, lowerSource / bands,
      -143 + inset, lowerTop + top, 285 - inset * 2, bottom - top);
  }
}

function legPose(p: ReturnType<typeof poseAtStart>, side: -1 | 1) {
  const pitch = p.tilt * radians;
  const cos = Math.cos(pitch);
  const sin = Math.sin(pitch);
  const toScene = (x: number, y: number) => ({
    x: p.x + x * cos - y * p.squash * sin,
    y: p.y + x * sin + y * p.squash * cos,
  });
  const lift = gsap.utils.clamp(0, 1, (p.tuck - .18) / .82);
  const reach = side === -1 ? p.leadExtension : 0;
  const hip = toScene(side * (51 + p.tuck * 14), 137 - p.tuck * 71 - p.seat * 38);
  const hanging = toScene(side * (53 + p.tuck * 26), 246 - p.tuck * 102 + side * p.step * 27);
  const reaching = {
    x: p.x + side * (52 + p.tuck * 10) - p.step * 10 - reach * 10,
    y: p.y + (243 - p.tuck * 87) * p.squash + side * p.step * 24 + reach * 39,
  };
  const rug = feetOnRug[side === -1 ? 0 : 1];
  const toe = {
    x: gsap.utils.interpolate(gsap.utils.interpolate(hanging.x, reaching.x, lift), rug.x, p.plant),
    y: gsap.utils.interpolate(gsap.utils.interpolate(hanging.y, reaching.y, lift), rug.y, p.plant),
  };
  const height = toe.y - hip.y;
  const toeDepth = Math.min(height * .65, 35 - p.plant * 17 + p.seat * 31 + lift * 13 - reach * 21);
  return {
    hip, toe, height, toeDepth, lift,
    curve: side * (lift * 16 + p.seat * 12 + 3),
    width: 83 + p.tuck * 6 + p.seat * 5,
    front: p.seat,
  };
}

function drawLeg(
  ctx: CanvasRenderingContext2D, image: HTMLImageElement, leg: ReturnType<typeof legPose>, foreground: boolean,
) {
  const { hip, toe, height, toeDepth, curve, width, front } = leg;
  if (height <= 0 || (foreground && front <= 0)) return;
  const ankleX = gsap.utils.interpolate(hip.x, toe.x, .55) + curve;
  const ankleY = toe.y - toeDepth;
  ctx.save();
  if (foreground) {
    // The foot turns toward the viewer while tucking or sitting. Let the
    // rounded forefoot come in front of the belly while the hip stays behind.
    ctx.globalAlpha = front;
    ctx.beginPath();
    ctx.ellipse(ankleX, toe.y - toeDepth * .4, width * .62, toeDepth * 1.16, 0, 0, 2 * Math.PI);
    ctx.clip();
  }
  // Stretch the plush above the foot. Compressing the sole area rolls it down
  // onto the rug, even when the hip moves during the wave or the sit.
  const soleStart = Math.round(image.height * .55);
  const draw = (sy: number, sourceHeight: number, x: number, y: number, dx: number, span: number) => {
    ctx.save();
    ctx.transform(1, 0, dx / span, 1, x - width / 2, y);
    ctx.drawImage(image, 0, sy, image.width, sourceHeight, 0, 0, width, span);
    ctx.restore();
  };
  const upperScale = (ankleY - hip.y) / soleStart;
  // Overlap a few source rows where the shin and foot meet to keep fur
  // continuous at fractional pixel positions.
  draw(0, soleStart + 4, hip.x, hip.y,
    (ankleX - hip.x) * (soleStart + 4) / soleStart, ankleY - hip.y + 4 * upperScale);
  draw(soleStart, image.height - soleStart, ankleX, ankleY, toe.x - ankleX, toeDepth);
  ctx.restore();
}

function drawLiftedLeg(
  ctx: CanvasRenderingContext2D, layer: CanvasRenderingContext2D, image: HTMLImageElement,
  leg: ReturnType<typeof legPose>,
) {
  const { hip, toe, lift, height, width } = leg;
  if (lift <= 0 || height <= 0) return;
  const x = Math.floor(Math.min(hip.x, toe.x) - width / 2 - 24);
  const y = Math.floor(hip.y);
  const density = layer.canvas.width / legLayerSize;
  layer.setTransform(1, 0, 0, 1, 0, 0);
  layer.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
  layer.setTransform(density, 0, 0, density, -x * density, -y * density);
  drawLeg(layer, image, leg, false);

  // The entire knee and paw come forward together. Feather the upper joint
  // into the belly, where the leg turns away, and keep the toe edge defined.
  layer.save();
  layer.globalCompositeOperation = 'destination-in';
  const join = layer.createLinearGradient(0, hip.y, 0, hip.y + height * .52);
  join.addColorStop(0, '#0000');
  join.addColorStop(1, '#000');
  layer.fillStyle = join;
  layer.fillRect(x, y, legLayerSize, legLayerSize);
  layer.restore();

  ctx.save();
  ctx.globalAlpha = lift;
  ctx.drawImage(layer.canvas, x, y, legLayerSize, legLayerSize);
  ctx.restore();
}

function drawRugContact(
  ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, depth: number, opacity: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, depth / radius);
  const contact = ctx.createRadialGradient(0, 0, radius * .13, 0, 0, radius);
  contact.addColorStop(0, `rgba(48, 27, 18, ${opacity})`);
  contact.addColorStop(.5, `rgba(48, 27, 18, ${opacity * .37})`);
  contact.addColorStop(1, 'rgba(48, 27, 18, 0)');
  ctx.fillStyle = contact;
  ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
  ctx.restore();
}

function clipSeatToPile(ctx: CanvasRenderingContext2D) {
  const { x, y } = seatOnRug;
  ctx.beginPath();
  ctx.moveTo(crop.x, crop.y);
  ctx.lineTo(crop.x + crop.width, crop.y);
  ctx.lineTo(crop.x + crop.width, y + 4);
  ctx.lineTo(x + 76, y + 4);
  // Small variations at the contact edge let the exposed carpet read as pile.
  for (let offset = 76; offset >= -76; offset -= 4) {
    ctx.lineTo(x + offset, y + Math.sin(offset * 1.9) * 1.3 + Math.sin(offset * .51) * 1.7);
  }
  ctx.lineTo(crop.x, y + 4);
  ctx.closePath();
  ctx.clip();
}

function paintBear(
  ctx: CanvasRenderingContext2D, actor: CanvasRenderingContext2D, art: Art,
  p: ReturnType<typeof poseAtStart>, legLayer: CanvasRenderingContext2D,
) {
  ctx.clearRect(crop.x, crop.y, crop.width, crop.height);
  ctx.drawImage(art['box-interior'], 907, 202, 452, 321);

  if (p.wallShadow > .001) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(922, 505);
    ctx.lineTo(1445, 477);
    ctx.lineTo(1445, 775);
    ctx.lineTo(922, 797);
    ctx.closePath();
    ctx.clip();
    ctx.translate(p.x - 38, p.y + 100);
    ctx.scale(.8, 1.24);
    const shade = ctx.createRadialGradient(0, 0, 13, 0, 0, 153);
    shade.addColorStop(0, `rgba(53, 28, 13, ${p.wallShadow})`);
    shade.addColorStop(1, 'rgba(53, 28, 13, 0)');
    ctx.fillStyle = shade;
    ctx.fillRect(-153, -153, 306, 306);
    ctx.restore();
  }

  if (p.shadow > .001) {
    ctx.save();
    ctx.translate(p.x - 14, 855);
    ctx.scale(1, .175);
    const radius = 123 + (1 - p.shadow) * 36;
    const ink = ctx.createRadialGradient(0, 0, 6, 0, 0, radius);
    ink.addColorStop(0, `rgba(54, 30, 17, ${p.shadow * .52})`);
    ink.addColorStop(.53, `rgba(54, 30, 17, ${p.shadow * .19})`);
    ink.addColorStop(1, 'rgba(54,30,17,0)');
    ctx.fillStyle = ink;
    ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
    ctx.restore();
  }
  if (p.plant > .001) {
    for (const foot of feetOnRug) {
      drawRugContact(ctx, foot.x - 3, foot.y, 44, 10, p.plant * .57);
    }
  }
  const seatPressure = gsap.utils.clamp(0, 1, (p.seat - .58) / .42);
  if (seatPressure > 0) {
    drawRugContact(ctx, seatOnRug.x - 12, seatOnRug.y + 1, 89, 12, seatPressure * .56);
    drawRugContact(ctx, seatOnRug.x - 4, seatOnRug.y + 2, 59, 6, seatPressure * .72);
  }

  actor.clearRect(crop.x, crop.y, crop.width, crop.height);
  // While lifting, the carton wall and foreground toys occlude the lower body.
  // Tucked feet clear the rim before the matte is released.
  const behindRim = p.x < 1158;
  const transformBear = () => {
    actor.translate(p.x, p.y);
    actor.rotate(p.tilt * radians);
    actor.scale(1, p.squash);
  };
  actor.save();
  if (behindRim) clipInterior(actor, p.grip, p.braceLeft, p.braceRight);
  transformBear();
  drawArm(actor, art['arm-left'], p, -1);
  drawArm(actor, art['arm-right'], p, 1);
  actor.restore();

  actor.save();
  if (behindRim) clipInterior(actor);
  const leftLeg = legPose(p, -1);
  const rightLeg = legPose(p, 1);
  drawLeg(actor, art['leg-left'], leftLeg, false);
  drawLeg(actor, art['leg-right'], rightLeg, false);
  actor.save();
  if (seatPressure > 0) clipSeatToPile(actor);
  transformBear();
  // The face, neck, ribbon and chest share one piece of artwork and one pose.
  // Fold the lower torso behind the rising knees so the feet clear its
  // silhouette before the legs extend again on the way to the rug.
  const bellyCompression = p.seat * 24 + Math.max(0, p.tuck - .18) * 86 + p.plant * (1 - p.seat) * 12;
  if (bellyCompression > 0) drawCore(actor, art.core, bellyCompression, .12 * p.plant * (1 - p.seat));
  else actor.drawImage(art.core, -143, -184, 285, 386);
  actor.restore();
  drawLiftedLeg(actor, legLayer, art['leg-right'], rightLeg);
  drawLiftedLeg(actor, legLayer, art['leg-left'], leftLeg);
  drawLeg(actor, art['leg-left'], leftLeg, true);
  drawLeg(actor, art['leg-right'], rightLeg, true);
  actor.restore();

  // Grade the bear independently. The box and room keep their original colors.
  actor.save();
  actor.globalCompositeOperation = 'source-atop';
  const shade = .21 - p.shadow * .09;
  const light = actor.createLinearGradient(p.x - 140, 0, p.x + 130, 0);
  light.addColorStop(0, `rgba(47, 29, 22, ${shade + .10})`);
  light.addColorStop(1, `rgba(55, 37, 26, ${shade * .46})`);
  actor.fillStyle = light;
  actor.fillRect(crop.x, crop.y, crop.width, crop.height);
  actor.restore();
  ctx.drawImage(actor.canvas, crop.x, crop.y, crop.width, crop.height);
  if (behindRim) {
    // The yellow block sits in front of the bear until it clears the carton.
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(1123, 457);
    ctx.lineTo(1177, 452);
    ctx.lineTo(1201, 459);
    ctx.lineTo(1201, 493);
    ctx.lineTo(1123, 497);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(art['box-interior'], 907, 202, 452, 321);
    ctx.restore();
  }
}

function startScene(hero: HTMLElement, track: HTMLElement, image: HTMLImageElement, canvas: HTMLCanvasElement, art: Art) {
  const ctx = canvas.getContext('2d');
  const actor = document.createElement('canvas').getContext('2d');
  const legLayer = document.createElement('canvas').getContext('2d');
  if (!ctx || !actor || !legLayer) return;
  const p = poseAtStart();
  const lens = { y: 50, rise: 0 };
  let copyOffset = 0;
  let wide = false;
  let risePosition = 38;
  let cameraCrop = 0;
  let horizontalPosition = 59;
  const measure = () => {
    const height = hero.offsetHeight;
    track.style.setProperty('--bear-hero-height', `${height}px`);
    copyOffset = window.innerWidth <= 850 ? Math.min(100, Math.max(0, height - window.innerHeight)) : 0;
    wide = window.innerWidth / window.innerHeight > 1.89;
    horizontalPosition = Number.parseFloat(getComputedStyle(image).objectPosition);
    const scale = widthScale();
    cameraCrop = image.offsetHeight - 941 * scale;
    const headerHeight = document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 0;
    risePosition = cameraCrop < 0
      ? gsap.utils.clamp(0, 38, 100 * (103 * scale - headerHeight - 12) / -cameraCrop)
      : 38;
    canvas.style.width = `${crop.width * scale}px`;
    canvas.style.height = `${crop.height * scale}px`;
    canvas.style.left = `${image.offsetLeft + (image.offsetWidth - 1672 * scale) * horizontalPosition / 100 + crop.x * scale}px`;
    canvas.style.top = `${image.offsetTop + cameraCrop / 2 + crop.y * scale}px`;
  };
  const align = () => {
    const y = wide ? lens.y + (risePosition - 50) * lens.rise : 50;
    canvas.style.transform = wide ? `translateY(${cameraCrop * (y - 50) / 100}px)` : '';
    image.style.objectPosition = `${horizontalPosition}% ${y}%`;
  };
  const paint = () => {
    if (wide) align();
    if (copyOffset) track.style.setProperty('--bear-copy-y', `${copyOffset * Math.min(1, scene.progress() / .15)}px`);
    paintBear(ctx, actor, art, p, legLayer);
  };
  const scene = gsap.timeline({ paused: true, defaults: { ease: 'sine.inOut' }, onUpdate: paint });
  // The first frame is also the static poster. Move the resting paws down
  // onto the rim as the bear leans in, then push off.
  scene.to(p, { y: 431, x: 1094, tilt: -4, squash: .96, left: 53,
    right: -59, elbowLeft: -24, elbowRight: 23, grip: 1, duration: .207 }, .02)
    // Push against the rim, bring the first knee up, and shift weight forward.
    .to(p, { y: 340, x: 1123, tilt: 5, squash: 1.015, tuck: 1, step: .87,
      left: 45, right: -41, elbowLeft: -26, elbowRight: 22, duration: .15 }, .227)
    .to(p, { braceRight: 0, duration: .082 }, .325)
    .to(p, { leadExtension: 1, duration: .094 }, .348)
    .to(p, { braceLeft: 0, duration: .075 }, .437)
    .to(p, { y: 294, x: 1159, tilt: 9, tuck: 1.18, step: .28,
      left: 32, right: -48, elbowLeft: -17, elbowRight: 27, duration: .072 }, .377)
    .to(p, { x: 1188, tilt: 5, tuck: .60, step: -.38, duration: .092 }, .449)
    .to(p, { leadExtension: 0, duration: .13 }, .466)
    .to(p, { y: 616, duration: .202, ease: 'power1.in' }, .449)
    .to(p, { wallShadow: .23, duration: .15 }, .444)
    // Extend the legs on the way down; catch the landing with a short squash.
    .to(p, { x: 1203, tilt: -2, squash: .95, tuck: 0, step: 0,
      left: 13, right: -12, elbowLeft: -7, elbowRight: 8, duration: .11, ease: 'power1.inOut' }, .541)
    .to(p, { shadow: .96, duration: .115 }, .535)
    .to(p, { plant: 1, duration: .054 }, .597)
    .to(p, { y: 600, squash: 1, tilt: 1, duration: .083 }, .651)
    // Raise the shoulder once. Three smaller elbow changes make the wave.
    .to(p, { right: -105, elbowRight: -36, tilt: -3, duration: .080 }, .739)
    .to(p, { elbowRight: -15, tilt: -2, duration: .040 }, .819)
    .to(p, { elbowRight: -45, tilt: -3, duration: .042 }, .859)
    .to(p, { elbowRight: -19, duration: .042 }, .901)
    .to(p, { x: seatOnRug.x, y: 683, tilt: -2, squash: .975, seat: 1, wallShadow: .14,
      left: 27, right: -22, elbowLeft: -10, duration: .15 }, .914)
    .to(p, { elbowRight: 8, duration: .12 }, .944)
    .to(lens, { rise: 1, duration: .22 }, .18)
    .to(lens, { y: 92, rise: 0, duration: .25 }, .43)
    .to({}, { duration: .032 }, 1.068);

  const density = Math.min(1.5, Math.max(1, widthScale() * window.devicePixelRatio));
  canvas.width = Math.round(crop.width * density);
  canvas.height = Math.round(crop.height * density);
  ctx.setTransform(density, 0, 0, density, -crop.x * density, -crop.y * density);
  actor.canvas.width = canvas.width;
  actor.canvas.height = canvas.height;
  actor.setTransform(density, 0, 0, density, -crop.x * density, -crop.y * density);
  legLayer.canvas.width = Math.round(legLayerSize * density);
  legLayer.canvas.height = legLayer.canvas.width;
  measure();
  align();
  paintBear(ctx, actor, art, p, legLayer);
  track.dataset.bear = 'ready';
  const trigger = ScrollTrigger.create({
    id: 'joybox-hero-bear',
    trigger: track,
    animation: scene,
    start: () => `top top-=${Math.max(0, -Number.parseFloat(getComputedStyle(hero).top))}`,
    end: 'bottom bottom',
    scrub: .42,
    refreshPriority: 2,
    onRefreshInit() { image.style.removeProperty('object-position'); measure(); align(); },
  });
  const resize = new ResizeObserver(() => ScrollTrigger.refresh(true));
  resize.observe(hero);
  ScrollTrigger.refresh();
  return () => {
    resize.disconnect();
    trigger.kill();
    scene.kill();
    ctx.clearRect(crop.x, crop.y, crop.width, crop.height);
    delete track.dataset.bear;
    track.style.removeProperty('--bear-hero-height');
    track.style.removeProperty('--bear-copy-y');
    image.style.removeProperty('object-position');
  };

  function widthScale() {
    return Math.max(image.offsetWidth / 1672, image.offsetHeight / 941);
  }
}

export function mountHeroBear(hero: HTMLElement, context: gsap.Context) {
  const track = hero.closest<HTMLElement>('.hero-bear-track');
  const canvas = hero.querySelector<HTMLCanvasElement>('.hero-bear');
  const image = hero.querySelector<HTMLImageElement>('.hero-photo img');
  if (!track || !canvas || !image) return;
  if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;
  let alive = true;
  let loading = false;
  let art: Art | undefined;
  let stop: (() => void) | undefined;
  const install = context.add('installHeroBear', () => { if (art) stop = startScene(hero, track, image, canvas, art); });
  const load = () => {
    if (!alive || window.scrollY > 120) return;
    if (art) {
      if (!image.complete || !image.naturalWidth) return;
      install();
      window.removeEventListener('scroll', load);
    } else if (!loading) {
      loading = true;
      void Promise.all(assets.map(async name => {
        const part = new Image();
        part.fetchPriority = 'low';
        part.src = `/brand/hero-teddy/${name}.webp`;
        await part.decode();
        return [name, part] as const;
      })).then(entries => {
        if (!alive) return;
        art = Object.fromEntries(entries) as Art;
        load();
      }).catch(() => window.removeEventListener('scroll', load));
    }
  };
  image.addEventListener('load', load, { once: true });
  window.addEventListener('scroll', load, { passive: true });
  load();
  return () => {
    alive = false;
    stop?.();
    image.removeEventListener('load', load);
    window.removeEventListener('scroll', load);
  };
}

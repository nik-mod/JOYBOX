import {
  Color, DataTexture, DirectionalLight, HemisphereLight, LinearFilter, Mesh, MeshBasicMaterial,
  NeutralToneMapping, PCFShadowMap, PerspectiveCamera, PlaneGeometry, PMREMGenerator, RGBAFormat, Scene,
  ShadowMaterial, SRGBColorSpace, TextureLoader, WebGLRenderer, type Texture,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { makeModelWorkshop } from './orbital-models';
import { arrangeOrbitalToys, disposeToyModels, loadOrbitalToys } from './orbital-toys';

export type OrbitalPose = {
  angle: number;
  camera: number;
  blush: number;
  navyLid: number;
  navyToys: number;
  pinkLid: number;
  pinkToys: number;
};

const warmLight = new Color('#fff0dd');
const pinkLight = new Color('#fff2f3');
const warmGround = new Color('#cda788');
const pinkGround = new Color('#d9a5bc');

function makeContactTexture(round = false) {
  const size = 64;
  const rgba = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = Math.abs((x + .5) * 2 / size - 1);
      const v = Math.abs((y + .5) * 2 / size - 1);
      const edge = Math.min(1, Math.max(0, (1 - Math.max(u, v)) * 4));
      const offset = (y * size + x) * 4;
      rgba.fill(255, offset, offset + 3);
      rgba[offset + 3] = Math.round(255 * Math.exp(-(round ? 3.1 * (u * u + v * v) : 3.9 * (u ** 4 + v ** 4))) * edge);
    }
  }
  const texture = new DataTexture(rgba, size, size, RGBAFormat);
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

export async function mountOrbitalScene(host: HTMLElement, signal: AbortSignal, onContextLost: () => void) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'high-performance' });
  if (!context) throw new Error('WebGL 2 unavailable');
  const rendererInfo = context.getExtension('WEBGL_debug_renderer_info');
  const software = rendererInfo && /swiftshader|llvmpipe|software/i.test(context.getParameter(rendererInfo.UNMASKED_RENDERER_WEBGL));

  const renderer = new WebGLRenderer({ canvas, context, alpha: true, antialias: true });
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.localClippingEnabled = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;

  const images = new TextureLoader();
  const textures: Texture[] = [];
  let released = false;
  const releaseRenderer = () => {
    if (released) return;
    released = true;
    signal.removeEventListener('abort', releaseRenderer);
    textures.forEach(texture => texture.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };
  signal.addEventListener('abort', releaseRenderer, { once: true });

  let loadedModels: Awaited<ReturnType<typeof loadOrbitalToys>> | undefined;
  try {
    const loadArtwork = Promise.all(['navy', 'berry'].map(async color => {
      const [front, side, right, back, lid] = await Promise.all(['front', 'side', 'right', 'back', 'lid'].map(async face => {
        const texture = await images.loadAsync(`/brand/orbit-${color}-${face}.webp`);
        if (signal.aborted || released) {
          texture.dispose();
          throw new Error('Showcase cancelled');
        }
        textures.push(texture);
        texture.colorSpace = SRGBColorSpace;
        texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
        return texture;
      }));
      return { front, side, right, back, lid };
    }));
    const [artwork, models] = await Promise.allSettled([loadArtwork, loadOrbitalToys(signal)]);
    if (models.status === 'fulfilled') loadedModels = models.value;
    signal.throwIfAborted();
    if (artwork.status === 'rejected') throw artwork.reason;
    if (models.status === 'rejected') throw models.reason;
    signal.removeEventListener('abort', releaseRenderer);

    const scene = new Scene();
    const studio = new RoomEnvironment();
    const pmrem = new PMREMGenerator(renderer);
    const reflection = pmrem.fromScene(studio, .055, .1, 80, { size: 128 });
    scene.environment = reflection.texture;
    scene.environmentIntensity = .52;
    studio.dispose();
    pmrem.dispose();
    const camera = new PerspectiveCamera(36, 1, .1, 45);
    const hemisphere = new HemisphereLight('#fff9f1', warmGround, .42);
    const key = new DirectionalLight(warmLight, 1.6);
    key.position.set(-4.6, 6.4, 3.6);
    key.castShadow = true;
    const shadowSize = software ? 1024 : 2048;
    key.shadow.mapSize.set(shadowSize, shadowSize);
    key.shadow.camera.left = key.shadow.camera.bottom = -4.4;
    key.shadow.camera.right = key.shadow.camera.top = 4.4;
    key.shadow.camera.near = .5;
    key.shadow.camera.far = 15;
    key.shadow.normalBias = .006;
    key.shadow.bias = -.0002;
    key.shadow.radius = software ? 12 : 22;
    const rim = new DirectionalLight('#fff2e7', .34);
    rim.position.set(3.5, 4.4, -4.2);
    scene.add(hemisphere, key, rim);

    const workshop = makeModelWorkshop();
    const boxes = artwork.value.map((art, index) => {
      const box = workshop.box(art, index === 1);
      const toys = arrangeOrbitalToys(models.value, index === 1);
      toys.forEach(({ toy }) => box.root.add(toy));
      return { ...box, toys };
    });
    const contact = makeContactTexture();
    const toyContact = makeContactTexture(true);
    const contactGeometry = new PlaneGeometry(1, 1);
    const interiorShadows = boxes.map(box => box.toys.map(({ toy, footprint }) => {
      const shadow = new Mesh(contactGeometry, new MeshBasicMaterial({ map: toyContact, color: '#5c4031',
        transparent: true, opacity: .18, depthWrite: false, toneMapped: false }));
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.set(toy.position.x, .56, toy.position.z);
      shadow.scale.set(Math.max(.23, footprint[0] * .9), Math.max(.20, footprint[1] * .8), 1);
      box.root.add(shadow);
      return shadow;
    }));
    const floor = new Mesh(contactGeometry, new ShadowMaterial({ opacity: .035, depthWrite: false }));
    floor.scale.set(11, 11, 1);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -.022;
    floor.receiveShadow = true;
    scene.add(floor);
    const shadows = boxes.map(({ root }) => {
      const material = new MeshBasicMaterial({ map: contact, color: '#342519', opacity: .24, transparent: true,
        depthWrite: false, toneMapped: false });
      const shadow = new Mesh(contactGeometry, material);
      shadow.rotation.x = -Math.PI / 2;
      scene.add(shadow, root);
      return shadow;
    });

    let pose: OrbitalPose | undefined;
    let request = 0;
    let framing = 1;
    let disposed = false;
    const inspection = { x: 0, y: 0 };

    function render() {
      request = 0;
      if (!pose || disposed || context?.isContextLost()) return;

      const parallax = Math.sin(pose.angle);
      const travel = Math.max(0, parallax);
      const extraWidth = Math.max(1, 1.185 / camera.aspect) / framing - 1;
      const dolly = pose.camera + .22 * travel + extraWidth * travel ** .65;
      camera.position.set(.09 + .26 * parallax + inspection.x * .48,
        3.43 * framing * dolly + inspection.y * .18, 7.45 * framing * dolly);
      camera.lookAt(.015 - .18 * parallax, .77, 0);
      key.color.copy(warmLight).lerp(pinkLight, pose.blush);
      hemisphere.groundColor.copy(warmGround).lerp(pinkGround, pose.blush);
      key.intensity = 1.6 - pose.blush * .09;

      for (const [index, box] of boxes.entries()) {
        const angle = pose.angle + index * Math.PI;
        const near = Math.cos(angle);
        const side = Math.sin(angle);
        const opening = index === 0 ? pose.navyLid : pose.pinkLid;
        box.root.position.set(side * 1.65 - near * .62, 0, near * 1.57 + side * .16);
        box.root.rotation.y = .41 - side * .16 - near * .08 + (pose.camera - 1) * .84 - opening * .12;
        box.lid.rotation.x = -2.18 * opening;

        const revealed = index === 0 ? pose.navyToys : pose.pinkToys;
        box.toys.forEach(({ toy, raised, yaw, z }, toyIndex) => {
          const rise = Math.min(1, Math.max(0, (revealed - toyIndex * .038) / .70));
          const softened = rise * rise * (3 - 2 * rise);
          toy.visible = rise > .002;
          toy.position.y = .16 + (raised - .16) * softened;
          toy.position.z = z - .035 * (1 - softened);
          toy.rotation.y = yaw + .14 * (1 - softened);
          interiorShadows[index][toyIndex].material.opacity = softened * .18;
        });

        const shadow = shadows[index];
        shadow.position.set(box.root.position.x + .14, -.012, box.root.position.z - .13);
        shadow.rotation.z = -box.root.rotation.y;
        shadow.scale.set(3.22, 2.94, 1);
        shadow.material.opacity = .28 + near * .04;
      }

      renderer.render(scene, camera);
    }

    const queueRender = () => {
      if (!request && !disposed) request = requestAnimationFrame(render);
    };

    const size = () => {
      const { width, height } = host.getBoundingClientRect();
      if (width < 2 || height < 2) return;
      const pixelBudget = software ? 550_000 : 2_400_000;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(pixelBudget / (width * height)));
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      framing = Math.max(1, 1.04 / camera.aspect);
      camera.updateProjectionMatrix();
      queueRender();
    };

    function lost(event: Event) {
      event.preventDefault();
      if (!disposed) onContextLost();
    }

    canvas.setAttribute('aria-hidden', 'true');
    canvas.addEventListener('webglcontextlost', lost);
    host.append(canvas);
    const resize = new ResizeObserver(size);
    resize.observe(host);
    size();

    return {
      inspect(x: number, y: number) {
        inspection.x = x; inspection.y = y;
        queueRender();
      },
      draw(next: OrbitalPose, immediately = false) {
        if (!immediately && pose && pose.angle === next.angle && pose.camera === next.camera
          && pose.blush === next.blush && pose.navyLid === next.navyLid && pose.navyToys === next.navyToys
          && pose.pinkLid === next.pinkLid && pose.pinkToys === next.pinkToys) return;
        pose = { ...next };
        if (immediately) {
          if (request) cancelAnimationFrame(request);
          render();
        } else queueRender();
      },
      dispose() {
        if (disposed) return;
        disposed = true;
        if (request) cancelAnimationFrame(request);
        resize.disconnect();
        canvas.removeEventListener('webglcontextlost', lost);
        shadows.forEach(shadow => shadow.material.dispose());
        interiorShadows.flat().forEach(shadow => shadow.material.dispose());
        boxes.forEach(box => box.surfaces.forEach(material => material.dispose()));
        key.shadow.dispose();
        floor.material.dispose();
        reflection.dispose();
        disposeToyModels(boxes.flatMap(box => box.toys.map(({ toy }) => toy)));
        contact.dispose();
        toyContact.dispose();
        contactGeometry.dispose();
        workshop.dispose();
        releaseRenderer();
      },
    };
  } catch (error) {
    if (loadedModels) disposeToyModels(Object.values(loadedModels));
    releaseRenderer();
    throw error;
  }
}

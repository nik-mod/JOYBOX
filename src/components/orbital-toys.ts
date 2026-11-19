import {
  Box3, Color, ExtrudeGeometry, Group, InstancedMesh, LatheGeometry, Material,
  Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Object3D, Plane, Shape, Texture,
  Vector2, Vector3, type BufferGeometry,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const names = ['teddy', 'rabbit', 'car', 'dinosaur', 'unicorn', 'blocks'] as const;
type ToyName = typeof names[number];
type Contents = Record<ToyName, Group>;

// Hide the part of a model that is still inside the raised paper liner.
const tissueLine = new Plane(new Vector3(0, 1, 0), -.495);

export async function loadOrbitalToys(signal: AbortSignal) {
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const results = await Promise.allSettled(names.map(async (name) => {
    const response = await fetch(`/brand/orbit-models/${name === 'teddy' ? 'teddy-scan' : name === 'unicorn' ? 'unicorn-hq' : name}.glb`, { signal });
    if (!response.ok) throw new Error(`Unable to load ${name}`);
    const { scene } = await loader.parseAsync(await response.arrayBuffer(), '');
    if (name === 'teddy') scene.rotation.x = Math.PI / 2;
    scene.updateMatrixWorld(true);
    return [name, scene] as const;
  }));
  const models = results.flatMap(result => result.status === 'fulfilled' ? [result.value] : []);
  if (signal.aborted || models.length !== names.length) {
    disposeToyModels(models.map(([, model]) => model));
    throw new Error('Unable to load showcase toys');
  }
  return Object.fromEntries(models) as Contents;
}

export function disposeToyModels(models: Object3D[]) {
  const geometries = new Set<BufferGeometry>();
  const materials = new Set<Material>();
  const textures = new Set<Texture>();
  const images = new Set<ImageBitmap>();
  models.forEach(model => model.traverse(object => {
    if (!(object instanceof Mesh)) return;
    if (object instanceof InstancedMesh) object.dispose();
    geometries.add(object.geometry);
    const list = Array.isArray(object.material) ? object.material : [object.material];
    list.forEach(material => materials.add(material));
  }));
  materials.forEach(material => {
    Object.values(material).forEach(value => { if (value instanceof Texture) textures.add(value); });
    material.dispose();
  });
  textures.forEach(texture => {
    if (typeof ImageBitmap !== 'undefined' && texture.image instanceof ImageBitmap) images.add(texture.image);
    texture.dispose();
  });
  images.forEach(image => image.close());
  geometries.forEach(geometry => geometry.dispose());
}

function painted(color: string, roughness: number, metalness = 0, clearcoat = .22) {
  return new MeshPhysicalMaterial({ color, roughness, metalness, clearcoat, clearcoatRoughness: .25 });
}

function fittedSurface(parent: Object3D, geometry: BufferGeometry, material: Material, x = 0, y = 0, z = 0) {
  const mesh = new Mesh(geometry, material);
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}

function turned(points: number[][], segments = 40) {
  return new LatheGeometry(points.map(([x, y]) => new Vector2(x, y)), segments);
}

function rocket() {
  const model = new Group();
  const ivory = painted('#f1e6d0', .31, .08, .58);
  const red = painted('#aa3b2a', .29, .19, .55);
  const metal = painted('#b0a897', .28, .78);
  const glass = painted('#2e4d64', .15, .19, .85);

  fittedSurface(model, turned([
    [0, .075], [.086, .075], [.112, .118], [.127, .195], [.137, .291], [.140, .387],
    [.135, .479], [.125, .55], [.114, .585], [.112, .590],
  ]), ivory);
  fittedSurface(model, turned([
    [.112, .589], [.109, .611], [.096, .663], [.079, .71], [.057, .754], [.033, .788], [.012, .808], [0, .813],
  ]), red);
  fittedSurface(model, turned([[.094, .076], [.131, .076], [.135, .087], [.13, .124], [.11, .142], [.094, .142]]), metal);
  fittedSurface(model, turned([[.136, .286], [.143, .286], [.143, .312], [.138, .312]]), red);
  fittedSurface(model, turned([[.066, .002], [.073, .002], [.074, .012], [.067, .029], [.060, .031], [.055, .029], [.055, .019], [.066, .002]]), metal, 0, .467, .128).rotation.x = Math.PI / 2;
  fittedSurface(model, turned([[0, 0], [.054, 0], [.054, .009], [.048, .015], [.029, .020], [0, .022]]), glass, 0, .467, .137).rotation.x = Math.PI / 2;

  const fin = new Shape();
  fin.moveTo(.092, .335);
  fin.bezierCurveTo(.15, .295, .186, .183, .23, .09);
  fin.bezierCurveTo(.252, .04, .247, .018, .23, .017);
  fin.lineTo(.111, .016);
  fin.lineTo(.092, .335);
  const finGeometry = new ExtrudeGeometry(fin, { depth: .020, bevelEnabled: true, bevelThickness: .008,
    bevelSize: .008, bevelSegments: 3, curveSegments: 12 }).translate(0, 0, -.010);
  for (let index = 0; index < 3; index++) {
    fittedSurface(model, finGeometry, red).rotation.y = .16 + 2 * Math.PI * index / 3;
  }
  return model;
}

function puzzleCube() {
  const model = new Group();
  const core = new RoundedBoxGeometry(.381, .381, .381, 3, .026);
  fittedSurface(model, core, painted('#161d22', .61, 0, .08), 0, .201);
  const tileGeometry = new RoundedBoxGeometry(.120, .120, .017, 3, .008);
  const tiles = new InstancedMesh(tileGeometry, painted('#ffffff', .37), 54);
  model.add(tiles);
  const palette = ['#bf3d36', '#e4ae37', '#256d96', '#f4f0de', '#47936b', '#df783a'];
  const anchor = new Object3D();
  const tile = new Object3D();
  anchor.add(tile);
  const tint = new Color();
  for (let face = 0; face < 6; face++) {
    anchor.position.y = .201;
    anchor.rotation.set(face >= 4 ? (face === 4 ? -1 : 1) * Math.PI / 2 : 0, face < 4 ? face * Math.PI / 2 : 0, 0);
    for (let cell = 0; cell < 9; cell++) {
      tile.position.set((cell % 3 - 1) * .127, (Math.floor(cell / 3) - 1) * .127, .192);
      tile.updateWorldMatrix(true, false);
      tiles.setMatrixAt(face * 9 + cell, tile.matrixWorld);
      tiles.setColorAt(face * 9 + cell, tint.set(palette[(face + cell * 5 + Math.floor(cell / 3)) % 6]));
    }
  }
  return model;
}

function bracelets() {
  const model = new Group();
  const colors = ['#d1859a', '#e6bc80', '#a978b0', '#7ca49e', '#e7bbb3', '#f5dec5'];
  const bead = turned([[.012, -.025], [.028, -.026], [.041, -.014], [.045, 0], [.041, .015],
    [.029, .027], [.012, .026], [.011, -.026]], 12);
  const beads = new InstancedMesh(bead, painted('#ffffff', .29), 26);
  model.add(beads);
  const place = new Object3D();
  const tint = new Color();
  for (let index = 0; index < 26; index++) {
    const ring = Math.floor(index / 13);
    const angle = index % 13 * Math.PI * 2 / 13;
    place.position.set(Math.cos(angle) * .159 + ring * .101 - .05,
      .057 + ring * .06 + Math.sin(angle) * (ring ? .037 : .014), Math.sin(angle) * .134 - ring * .051);
    place.rotation.set(Math.PI / 2, 0, angle);
    place.updateMatrix();
    beads.setMatrixAt(index, place.matrix);
    beads.setColorAt(index, tint.set(colors[(index + ring * 2) % colors.length]));
  }
  return model;
}

function paintSet() {
  const model = new Group();
  const palette = new Shape();
  palette.moveTo(-.29, -.08);
  palette.bezierCurveTo(-.27, -.25, .08, -.24, .25, -.13);
  palette.bezierCurveTo(.33, -.07, .34, .12, .20, .155);
  palette.bezierCurveTo(.10, .16, .09, .071, -.01, .09);
  palette.bezierCurveTo(-.082, .10, -.23, .13, -.29, -.08);
  const aperture = new Shape();
  aperture.absellipse(.196, .067, .035, .023, 0, Math.PI * 2, true);
  palette.holes.push(aperture);
  fittedSurface(model, new ExtrudeGeometry(palette, { depth: .023, bevelEnabled: true, bevelSize: .010,
    bevelThickness: .008, curveSegments: 18, bevelSegments: 3 }), painted('#d6ac74', .69, 0, .12), 0, .019).rotation.x = -Math.PI / 2;
  const pigment = turned([[0, 0], [.046, 0], [.045, .012], [.036, .021], [.021, .028], [0, .032]], 22);
  for (const [x, z, color] of [[-.217, .026, '#b95462'], [-.151, .105, '#d3a12c'], [-.043, .145, '#6d8b6d'], [.067, .133, '#557b9c'], [.169, .091, '#a36597']] as const) {
    fittedSurface(model, pigment, painted(color, .48, 0, .12), x, .049, z);
  }
  const brush = new Group();
  fittedSurface(brush, turned([[0, 0], [.008, .006], [.011, .03], [.015, .15], [.012, .223], [.011, .252], [0, .254]], 18), painted('#af6950', .46));
  fittedSurface(brush, turned([[.01, .248], [.015, .250], [.014, .302], [.011, .304]], 18), painted('#b6a48d', .26, .78));
  fittedSurface(brush, turned([[.010, .301], [.011, .315], [.008, .345], [.003, .354], [0, .357]], 18), painted('#593d34', .91));
  brush.rotation.set(Math.PI / 2.24, Math.PI / 3.9, -Math.PI / 2.8);
  brush.position.set(-.16, .065, -.055);
  model.add(brush);
  model.rotation.x = .26;
  return model;
}

function ringStack() {
  const model = new Group();
  const wood = painted('#c89258', .53, 0, .13);
  fittedSurface(model, turned([[0, 0], [.19, 0], [.21, .026], [.21, .056], [.19, .073], [0, .073]]), wood);
  fittedSurface(model, turned([[0, .06], [.037, .06], [.037, .49], [.027, .52], [0, .525]]), wood);
  const rings = ['#2d6889', '#719268', '#e2af43', '#b54e36'];
  rings.forEach((color, index) => {
    const r = .192 - index * .027;
    fittedSurface(model, turned([[.045, 0], [r - .021, 0], [r, .022], [r, .055],
      [r - .02, .076], [.045, .077], [.045, 0]], 28), painted(color, .34), 0, .076 + index * .081);
  });
  return model;
}

function spinningTop(bodyColor: string, bandColor: string) {
  const model = new Group();
  fittedSurface(model, turned([[0, 0], [.024, .025], [.056, .066], [.12, .114], [.151, .154],
    [.161, .192], [.151, .224], [.125, .244], [.038, .254], [0, .254]]), painted(bodyColor, .34));
  fittedSurface(model, turned([[.153, .15], [.162, .177], [.163, .193], [.159, .20]]), painted(bandColor, .35));
  fittedSurface(model, turned([[0, .25], [.031, .25], [.029, .312], [.039, .334], [.032, .356], [0, .365]]), painted('#d3a773', .57));
  return model;
}

function playCamera(bodyColor: string, lensColor: string) {
  const model = new Group();
  const wood = painted('#daa76c', .57, 0, .13);
  const paint = painted(bodyColor, .36);
  fittedSurface(model, new RoundedBoxGeometry(.52, .31, .20, 3, .043), wood, 0, .16);
  fittedSurface(model, new RoundedBoxGeometry(.49, .23, .205, 3, .032), paint, 0, .15);
  fittedSurface(model, turned([[0, 0], [.115, 0], [.119, .018], [.115, .057], [.094, .069], [0, .069]], 32),
    painted(lensColor, .28), .041, .15, .107).rotation.x = Math.PI / 2;
  fittedSurface(model, turned([[0, 0], [.071, 0], [.066, .012], [0, .018]], 28),
    painted('#233948', .18, .14, .6), .041, .15, .173).rotation.x = Math.PI / 2;
  fittedSurface(model, new RoundedBoxGeometry(.072, .025, .064, 2, .01), wood, -.153, .32, .017);
  fittedSurface(model, new RoundedBoxGeometry(.066, .045, .012, 2, .01), painted('#efe0ba', .38), -.166, .217, .107);
  return model;
}

type Placement = [object: Object3D, x: number, z: number, yaw: number, height: number, limit: number, base: number];

export function arrangeOrbitalToys(models: Contents, pink: boolean) {
  const placements: Placement[] = pink ? [
    [models.rabbit, -.60, -.39, .13, 1.30, .78, .55],
    [models.teddy.clone(true), .10, -.48, -.12, 1.06, .89, .55],
    [models.unicorn, .59, .13, .65, .89, .94, .56],
    [models.blocks.clone(true), -.12, .13, -.18, .48, .66, .55],
    [bracelets(), -.62, .56, -.21, .31, .72, .57],
    [paintSet(), .43, .54, -.15, .34, .83, .64],
    [spinningTop('#bd6984', '#e8ba65'), .71, -.49, .10, .55, .44, .61],
    [playCamera('#789d93', '#e5c28c'), -.22, .60, .17, .33, .47, .60],
  ] : [
    [models.teddy, -.53, -.41, -.12, 1.36, 1.08, .55],
    [rocket(), .70, -.46, .23, 1.14, .66, .55],
    [models.dinosaur, .47, .10, -.35, .60, .96, .55],
    [models.blocks, -.57, .19, .14, .46, .70, .55],
    [puzzleCube(), -.16, .59, -.22, .48, .51, .56],
    [models.car, .61, .61, 1.37, .38, .80, .57],
    [ringStack(), .16, -.48, 0, .78, .44, .60],
    [spinningTop('#d79c43', '#3e7195'), .16, .40, -.12, .42, .37, .56],
  ];
  return placements.map(([object, x, z, yaw, targetHeight, limit, raised]) => {
    // A cloned shared model may already have been centered for the other box.
    object.position.set(0, 0, 0);
    object.updateMatrixWorld(true);
    const bounds = new Box3().setFromObject(object);
    const center = bounds.getCenter(new Vector3());
    const size = bounds.getSize(new Vector3());
    const scale = Math.min(targetHeight / size.y, limit / Math.max(size.x, size.z));
    const fitted = new Group();
    fitted.add(object);
    object.position.set(-center.x, -bounds.min.y, -center.z);
    fitted.scale.setScalar(scale);
    const toy = new Group();
    toy.add(fitted);
    toy.position.set(x, -.42, z);
    toy.rotation.y = yaw;
    toy.traverse(node => {
      if (!(node instanceof Mesh)) return;
      const list = Array.isArray(node.material) ? node.material : [node.material];
      for (const material of list) {
        if (material instanceof MeshStandardMaterial) {
          material.clippingPlanes = [tissueLine];
          material.clipShadows = true;
          if (material.map) material.map.anisotropy = 4;
        }
      }
      node.castShadow = true;
      node.receiveShadow = true;
    });
    return { toy, yaw, z, raised, footprint: [size.x * scale, size.z * scale] as const };
  });
}

import {
  CanvasTexture, DataTexture, DoubleSide, ExtrudeGeometry, Group, LinearFilter, LinearMipmapLinearFilter,
  Mesh, MeshStandardMaterial, PlaneGeometry, RepeatWrapping, RGBAFormat, Shape,
  SRGBColorSpace, type BufferGeometry, type Texture,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export type BoxArtwork = { front: Texture; side: Texture; right: Texture; back: Texture; lid: Texture };

function kraftTexture() {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  let seed = 733;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const fiber = ((seed >>> 24) - 127) * .092 + Math.sin(x * Math.PI / 5) * 1.9
        + Math.sin(x * .15 + y * .15) * Math.sin(x * .038 - y * .32) * 3.1;
      const i = (y * size + x) * 4;
      data[i] = 196 + fiber;
      data[i + 1] = 154 + fiber;
      data[i + 2] = 113 + fiber;
      data[i + 3] = 255;
    }
  }
  const texture = new DataTexture(data, size, size, RGBAFormat);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

function tissueLiner() {
  const tissue = new PlaneGeometry(2.102, 1.90, 52, 48);
  tissue.rotateX(-Math.PI / 2);
  const vertices = tissue.getAttribute('position');
  for (let i = 0; i < vertices.count; i++) {
    const x = vertices.getX(i);
    const z = vertices.getZ(i);
    const edge = Math.max(Math.abs(x) / 1.051, Math.abs(z) / .95);
    const fold = .023 * Math.sin(13 * x + 5 * z) ** 5 + .012 * Math.sin(6 * z - 15 * x) ** 3;
    const curl = edge ** 7 * (.21 + .069 * Math.sin(10 * x - 7 * z) + .035 * Math.cos(23 * z + 4 * x));
    const lowerRidge = .035 * Math.exp(-((x - .48) ** 2 / .13 + (z - .34) ** 2 / .12));
    vertices.setY(i, .524 + curl + fold + lowerRidge);
  }
  tissue.computeVertexNormals();
  return tissue;
}

export function makeModelWorkshop() {
  const width = 2.2;
  const depth = 2;
  const height = .9;
  const board = .026;
  const panels = new Map<string, BufferGeometry>();
  const kraft = kraftTexture();
  const tissue = tissueLiner();
  // Ink printed directly on the inside of the lid, using the site's local Georgian font.
  const printCanvas = document.createElement('canvas');
  printCanvas.width = 1024; printCanvas.height = 320;
  const ink = printCanvas.getContext('2d')!;
  ink.fillStyle = '#685034'; ink.textAlign = 'center';
  ink.font = '800 63px "Noto Georgian"';
  ink.fillText('პატარა ყუთი.', 512, 119);
  ink.fillText('დიდი სიხარული.', 512, 209);
  const insidePrint = new CanvasTexture(printCanvas);
  insidePrint.colorSpace = SRGBColorSpace;
  const printMaterial = new MeshStandardMaterial({ map: insidePrint, transparent: true, roughness: 1,
    polygonOffset: true, polygonOffsetFactor: -1, depthWrite: false });
  const printGeometry = new PlaneGeometry(1.25, .39);
  const paper = new MeshStandardMaterial({ map: kraft, bumpMap: kraft, bumpScale: .010, roughness: .96 });
  const rim = new MeshStandardMaterial({ color: '#d4ad7a', bumpMap: kraft, bumpScale: .006, roughness: .94 });
  const crease = new MeshStandardMaterial({ color: '#8b653d', roughness: .98 });
  const flap = new Shape();
  flap.moveTo(0, .060);
  flap.lineTo(.044, .103);
  flap.lineTo(1.74, .096);
  flap.quadraticCurveTo(1.816, .091, 1.842, .028);
  flap.lineTo(1.842, 0);
  flap.lineTo(0, 0);
  const foldedTab = new ExtrudeGeometry(flap, { depth: .018, bevelEnabled: true, bevelSegments: 2,
    bevelThickness: .006, bevelSize: .006, curveSegments: 10 });

  function panel(parent: Group, size: [number, number, number], at: [number, number, number],
    faces: MeshStandardMaterial | MeshStandardMaterial[]) {
    const key = size.join(',');
    let geometry = panels.get(key);
    if (!geometry) {
      geometry = new RoundedBoxGeometry(...size, 2, .007);
      panels.set(key, geometry);
    }
    const mesh = new Mesh(geometry, faces);
    mesh.position.set(...at);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
  }

  function box(art: BoxArtwork, pink: boolean) {
    const root = new Group();
    const printed = (map: Texture) => new MeshStandardMaterial({
      map, bumpMap: kraft, bumpScale: .0024, roughness: .79, envMapIntensity: .6,
    });
    const { front, side, right, back, lid: top } = Object.fromEntries(
      Object.entries(art).map(([name, image]) => [name, printed(image)]),
    ) as Record<keyof BoxArtwork, MeshStandardMaterial>;
    const tucked = new MeshStandardMaterial({ color: pink ? '#932452' : '#092447', roughness: .93 });
    const filler = new MeshStandardMaterial({ color: pink ? '#ead7cc' : '#e6d6b9', bumpMap: kraft,
      bumpScale: .005, roughness: .94, side: DoubleSide });
    const middle = (height - board) / 2;
    panel(root, [width - 2 * board, board, depth - 2 * board], [0, board / 2, 0], paper);
    panel(root, [width, height - board, board], [0, middle, (depth - board) / 2], [rim, rim, rim, paper, front, paper]);
    panel(root, [width, height - board, board], [0, middle, -(depth - board) / 2], [rim, rim, rim, paper, paper, back]);
    panel(root, [board, height - board, depth - 2 * board], [-(width - board) / 2, middle, 0], [paper, side, rim, paper, rim, rim]);
    panel(root, [board, height - board, depth - 2 * board], [(width - board) / 2, middle, 0], [right, paper, rim, paper, rim, rim]);

    const padding = new Mesh(tissue, filler);
    padding.receiveShadow = true;
    root.add(padding);

    const lid = new Group();
    lid.position.set(0, height - board, -depth / 2 + .006);
    root.add(lid);
    panel(lid, [width, board - .002, depth - .006], [0, board / 2 + .001, depth / 2 - .005], [tucked, tucked, top, paper, tucked, crease]);
    panel(lid, [width - .07, .056, .020], [0, -.025, depth - .044], paper);
    panel(lid, [width - .06, .008, .017], [0, -.001, .028], crease);
    const innerMark = new Mesh(printGeometry, printMaterial);
    innerMark.rotation.x = Math.PI / 2;
    innerMark.position.set(0, -.013, 1.16);
    lid.add(innerMark);
    for (const sign of [-1, 1]) {
      const tab = new Mesh(foldedTab, paper);
      tab.rotation.set(Math.PI, -Math.PI / 2, 0, 'YXZ');
      tab.position.set(sign * (width / 2 - .029), 0, .061);
      tab.castShadow = true;
      tab.receiveShadow = true;
      lid.add(tab);
    }
    return { root, lid, surfaces: [front, side, right, back, top, tucked, filler] };
  }

  return {
    box,
    dispose() {
      panels.forEach(geometry => geometry.dispose());
      foldedTab.dispose();
      tissue.dispose();
      printGeometry.dispose();
      printMaterial.dispose();
      insidePrint.dispose();
      kraft.dispose();
      paper.dispose();
      rim.dispose();
      crease.dispose();
    },
  };
}

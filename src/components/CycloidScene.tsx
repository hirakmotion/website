"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { cycloidParams, cycloidProfile } from "@/lib/cycloid";

type Props = {
  pins: number;
  /** Called every frame with input and output revolutions (output is reversed). */
  onFrame?: (inputRev: number, outputRev: number) => void;
  onFail?: () => void;
  className?: string;
};

const OUTPUT_HOLES = 6;
const OUTPUT_RADIUS = 0.5;
const OUTPUT_PIN = 0.075;
const CENTER_HOLE = 0.2;
const DISC_T = 0.15;
const DISC_GAP = 0.02;
const HOUSING_DEPTH = 0.44;
const INPUT_REV_PER_SEC = 0.45;

type Rig = {
  setPins: (pins: number) => void;
  dispose: () => void;
};

function holePath(cx: number, cy: number, r: number) {
  const h = new THREE.Path();
  h.absarc(cx, cy, r, 0, Math.PI * 2, true);
  return h;
}

function discGeometry(pins: number) {
  const p = cycloidParams(pins);
  const shape = new THREE.Shape(cycloidProfile(p, 540).map(([x, y]) => new THREE.Vector2(x, y)));
  shape.holes.push(holePath(0, 0, CENTER_HOLE));
  for (let k = 0; k < OUTPUT_HOLES; k++) {
    const a = (k / OUTPUT_HOLES) * Math.PI * 2;
    shape.holes.push(holePath(OUTPUT_RADIUS * Math.cos(a), OUTPUT_RADIUS * Math.sin(a), OUTPUT_PIN + p.e));
  }
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: DISC_T,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.005,
    bevelSegments: 2,
    curveSegments: 40,
  });
  geo.translate(0, 0, -DISC_T / 2);
  return { geo, p };
}

function ringGeometry(outer: number, inner: number, depth: number) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, outer, 0, Math.PI * 2, false);
  shape.holes.push(holePath(0, 0, inner));
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.015,
    bevelSegments: 3,
    curveSegments: 128,
  });
  geo.translate(0, 0, -depth / 2);
  return geo;
}

function zCylinder(r: number, length: number, segments = 32) {
  const g = new THREE.CylinderGeometry(r, r, length, segments);
  g.rotateX(Math.PI / 2);
  return g;
}

function createRig(container: HTMLDivElement, onFrameRef: React.RefObject<Props["onFrame"]>): Rig {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.display = "block";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envRT = pmrem.fromScene(room, 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.85;

  const key = new THREE.DirectionalLight(0xfff1e6, 2.2);
  key.position.set(3, 4, 5);
  const rim = new THREE.DirectionalLight(0xff7a2e, 3.2);
  rim.position.set(-4, -1.5, -2);
  const fill = new THREE.DirectionalLight(0x9fb4ff, 0.6);
  fill.position.set(-3, 3, 4);
  scene.add(key, rim, fill);

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);

  const mats = {
    copper: new THREE.MeshPhysicalMaterial({ color: 0xc0652d, metalness: 1, roughness: 0.3, clearcoat: 0.35, clearcoatRoughness: 0.35 }),
    bronze: new THREE.MeshStandardMaterial({ color: 0x5a4a40, metalness: 1, roughness: 0.38 }),
    steel: new THREE.MeshStandardMaterial({ color: 0xd8dde4, metalness: 1, roughness: 0.18 }),
    darkSteel: new THREE.MeshStandardMaterial({ color: 0x8a919b, metalness: 1, roughness: 0.3 }),
    housing: new THREE.MeshStandardMaterial({ color: 0x1b1e23, metalness: 0.7, roughness: 0.5 }),
    flange: new THREE.MeshStandardMaterial({ color: 0x262a31, metalness: 0.85, roughness: 0.42 }),
  };

  const root = new THREE.Group();
  root.rotation.set(-0.42, 0.5, 0.08);
  scene.add(root);

  // Parts that never change with the ratio.
  const flange = new THREE.Mesh(zCylinder(0.82, 0.08, 128), mats.flange);
  flange.position.z = -0.3;
  root.add(flange);

  const output = new THREE.Group();
  const outputPinGeo = zCylinder(OUTPUT_PIN, 0.56, 32);
  for (let k = 0; k < OUTPUT_HOLES; k++) {
    const a = (k / OUTPUT_HOLES) * Math.PI * 2;
    const pin = new THREE.Mesh(outputPinGeo, mats.steel);
    pin.position.set(OUTPUT_RADIUS * Math.cos(a), OUTPUT_RADIUS * Math.sin(a), -0.02);
    output.add(pin);
  }
  // A copper index mark on the flange makes the slow output rotation readable.
  const indexGeo = new THREE.BoxGeometry(0.05, 0.16, 0.02);
  const index = new THREE.Mesh(indexGeo, mats.copper);
  index.position.set(0, 0.72, -0.255);
  output.add(index);
  root.add(output);

  const shaft = new THREE.Group();
  const shaftGeo = zCylinder(0.095, 1.0, 32);
  shaft.add(new THREE.Mesh(shaftGeo, mats.steel));
  const nutGeo = zCylinder(0.15, 0.08, 6);
  const nut = new THREE.Mesh(nutGeo, mats.darkSteel);
  nut.position.z = 0.42;
  shaft.add(nut);
  root.add(shaft);

  const camGeo = zCylinder(CENTER_HOLE - 0.012, DISC_T * 0.96, 48);
  const cam1 = new THREE.Mesh(camGeo, mats.darkSteel);
  const cam2 = new THREE.Mesh(camGeo, mats.darkSteel);
  cam1.position.z = DISC_T / 2 + DISC_GAP / 2;
  cam2.position.z = -(DISC_T / 2 + DISC_GAP / 2);
  root.add(cam1, cam2);

  // Parts rebuilt when the ratio changes.
  let ratioParts: THREE.Object3D[] = [];
  let ratioGeos: THREE.BufferGeometry[] = [];
  let disc1: THREE.Mesh | null = null;
  let disc2: THREE.Mesh | null = null;
  let e = 0;
  let lobes = 11;

  let theta = 0; // input (eccentric) angle
  let offset = 0; // keeps output angle continuous across ratio changes
  let outputTurned = 0; // accumulated output angle, for the readout

  function setPins(pins: number) {
    const prevAlpha = -theta / lobes + offset;
    ratioParts.forEach((o) => root.remove(o));
    ratioGeos.forEach((g) => g.dispose());
    ratioParts = [];
    ratioGeos = [];

    const { geo, p } = discGeometry(pins);
    e = p.e;
    lobes = pins - 1;
    const pitch = (Math.PI * 2) / lobes;
    offset = Math.round((prevAlpha + theta / lobes) / pitch) * pitch;

    disc1 = new THREE.Mesh(geo, mats.copper);
    disc1.position.z = DISC_T / 2 + DISC_GAP / 2;
    disc2 = new THREE.Mesh(geo, mats.bronze);
    disc2.position.z = -(DISC_T / 2 + DISC_GAP / 2);

    const housingGeo = ringGeometry(1.3, p.R + p.pinRadius * 0.35, HOUSING_DEPTH);
    const housing = new THREE.Mesh(housingGeo, mats.housing);
    const pinGeo = zCylinder(p.pinRadius, HOUSING_DEPTH - 0.02, 32);
    const ring = new THREE.Group();
    for (let k = 0; k < pins; k++) {
      const a = (k / pins) * Math.PI * 2;
      const pin = new THREE.Mesh(pinGeo, mats.steel);
      pin.position.set(p.R * Math.cos(a), p.R * Math.sin(a), 0);
      ring.add(pin);
    }
    ratioParts = [disc1, disc2, housing, ring];
    ratioGeos = [geo, housingGeo, pinGeo];
    root.add(...ratioParts);
    pose();
  }

  function pose() {
    if (!disc1 || !disc2) return;
    const alpha = -theta / lobes + offset;
    const c1x = e * Math.cos(theta);
    const c1y = e * Math.sin(theta);
    disc1.position.x = c1x;
    disc1.position.y = c1y;
    disc1.rotation.z = alpha;
    // Second disc runs 180° out of phase to balance the drive.
    disc2.position.x = -c1x;
    disc2.position.y = -c1y;
    disc2.rotation.z = alpha + Math.PI;
    cam1.position.x = c1x;
    cam1.position.y = c1y;
    cam2.position.x = -c1x;
    cam2.position.y = -c1y;
    shaft.rotation.z = theta;
    output.rotation.z = alpha;
  }

  function resize() {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const half = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const dist = Math.max(6.0, 1.6 / (half * camera.aspect));
    camera.position.set(0, 0, dist);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const speed = (reduceMotion ? 0.08 : INPUT_REV_PER_SEC) * Math.PI * 2;
  const pointer = { x: 0, y: 0 };
  const tilt = { x: 0, y: 0 };

  function onPointer(ev: PointerEvent) {
    pointer.x = (ev.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (ev.clientY / window.innerHeight) * 2 - 1;
  }
  if (!reduceMotion) window.addEventListener("pointermove", onPointer, { passive: true });

  let raf = 0;
  let last = performance.now();
  let visible = true;

  function frame(now: number) {
    const dt = Math.max(0, Math.min((now - last) / 1000, 0.05));
    last = now;
    theta += dt * speed;
    outputTurned += (dt * speed) / lobes;
    tilt.x += (pointer.y * 0.18 - tilt.x) * 0.05;
    tilt.y += (pointer.x * 0.25 - tilt.y) * 0.05;
    root.rotation.x = -0.42 + tilt.x;
    root.rotation.y = 0.5 + tilt.y;
    pose();
    onFrameRef.current?.(theta / (Math.PI * 2), outputTurned / (Math.PI * 2));
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (raf || !visible || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  });
  io.observe(container);
  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVisibility);
  const ro = new ResizeObserver(() => {
    resize();
    renderer.render(scene, camera);
  });
  ro.observe(container);

  resize();
  start();

  return {
    setPins,
    dispose() {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      ratioGeos.forEach((g) => g.dispose());
      [outputPinGeo, indexGeo, shaftGeo, nutGeo, camGeo, flange.geometry].forEach((g) => g.dispose());
      Object.values(mats).forEach((m) => m.dispose());
      envRT.dispose();
      pmrem.dispose();
      room.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m: THREE.Material) => m.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

export default function CycloidScene({ pins, onFrame, onFail, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<Rig | null>(null);
  const onFrameRef = useRef(onFrame);
  const pinsRef = useRef(pins);
  onFrameRef.current = onFrame;
  pinsRef.current = pins;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    try {
      const rig = createRig(el, onFrameRef);
      rig.setPins(pinsRef.current);
      rigRef.current = rig;
    } catch {
      onFail?.();
      return;
    }
    return () => {
      rigRef.current?.dispose();
      rigRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    rigRef.current?.setPins(pins);
  }, [pins]);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}

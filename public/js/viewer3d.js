/* Interactive H-02 model: orbit, zoom, and an explode slider driven by the same offsets as the Blender renders.
   Markup: <div data-viewer data-glb="assets/h02_model.json" data-offsets="assets/h02_explode.json" [data-theme="light|dark"]>
             <div class="v-stage"><img class="v-poster" …></div>
             <input type="range" data-v="explode" min="0" max="100" value="0">
             <button data-v="reset">…</button>
             <p data-v-status></p></div>   (needs an importmap for "three" and "three/addons/")
   Round 3: normals are rebuilt in the browser with a crease angle (sharp at edges, smooth on curves), so the
   simplified meshes shade like the renders instead of showing streaks; lighting keeps black PLA black;
   a soft contact shadow sits under the motor shell. */
// three.js (about 240 KB over the wire) is fetched only when the viewer comes near the screen.
let THREE, GLTFLoader, OrbitControls, RoomEnvironment, toCreasedNormals;
async function loadThree() {
  if (THREE) return;
  const m = await Promise.all([
    import('three'),
    import('three/addons/loaders/GLTFLoader.js'),
    import('three/addons/controls/OrbitControls.js'),
    import('three/addons/environments/RoomEnvironment.js'),
    import('three/addons/utils/BufferGeometryUtils.js'),
  ]);
  THREE = m[0]; GLTFLoader = m[1].GLTFLoader; OrbitControls = m[2].OrbitControls;
  RoomEnvironment = m[3].RoomEnvironment; toCreasedNormals = m[4].toCreasedNormals;
}

// The model ships as a GLB wrapped in JSON (base64), because the host serves .json but not .glb.
async function loadModel(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('model ' + res.status);
  if (/\.json$/i.test(url)) {
    const j = await res.json(), s = atob(j.data), bin = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) bin[i] = s.charCodeAt(i);
    return new Promise((ok, bad) => new GLTFLoader().parse(bin.buffer, '', ok, bad));
  }
  return new GLTFLoader().parseAsync(await res.arrayBuffer(), '');
}

// Soft round shadow drawn once on a canvas: cheaper and softer than a real shadow map.
function contactShadow(radius, strength) {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d'), grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, `rgba(0,0,0,${strength})`); grd.addColorStop(0.45, `rgba(0,0,0,${strength * 0.55})`); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(radius * 2, radius * 2), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.renderOrder = -1;
  return m;
}

function mount(root) {
  const stage = root.querySelector('.v-stage'), slider = root.querySelector('[data-v="explode"]');
  const status = root.querySelector('[data-v-status]'), poster = root.querySelector('.v-poster');
  const dark = root.dataset.theme === 'dark';
  const say = t => { if (status) status.textContent = t; };
  let started = false;
  const io = new IntersectionObserver(es => {
    if (!started && es.some(e => e.isIntersecting)) { started = true; io.disconnect(); start().catch(err => { console.error(err); say('The 3D view could not load here, so this is a render instead.'); }); }
  }, { rootMargin: '300px' });
  io.observe(root);

  async function start() {
    say('Loading the model…');
    await loadThree();
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
    catch (e) { say('This browser has no WebGL, so this is a render instead.'); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = +(root.dataset.exposure || 1.0);
    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
    // A bright, even room turns black plastic grey (the same problem the round-1 renders had), so keep it low
    // and let two directional lights draw the edges.
    scene.environmentIntensity = +(root.dataset.env || (dark ? 0.55 : 0.45));
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(-0.5, 1.2, 0.7); scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 1.6); rim.position.set(0.9, 0.5, -0.9); scene.add(rim);
    const side = new THREE.DirectionalLight(0xffffff, 0.9); side.position.set(-1.0, 0.1, -0.2); scene.add(side);
    const cam = new THREE.PerspectiveCamera(26, 1, 0.005, 20);
    const controls = new OrbitControls(cam, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.08; controls.enablePan = false;
    controls.maxPolarAngle = Math.PI * 0.62;   // don't go far below the floor, where the shadow gives the trick away
    controls.autoRotate = !matchMedia('(prefers-reduced-motion: reduce)').matches; controls.autoRotateSpeed = 0.8;
    controls.addEventListener('start', () => { controls.autoRotate = false; });

    const [gltf, offs] = await Promise.all([loadModel(root.dataset.glb), fetch(root.dataset.offsets).then(r => r.json())]);
    const model = gltf.scene; scene.add(model);
    const movers = [], seen = new Set();
    model.traverse(o => {
      if (o.isMesh) {
        // sharp at edges over 34 degrees (Blender used 32), smooth on curved faces
        o.geometry = toCreasedNormals(o.geometry, THREE.MathUtils.degToRad(34));
        const m = o.material;
        if (m && m.isMeshStandardMaterial && !seen.has(m)) {   // materials are shared between parts: adjust each once
          seen.add(m);
          if (m.metalness < 0.5) { if (m.color.getHSL({}).l < 0.08) { m.roughness = 0.62; m.color.setRGB(0.022, 0.022, 0.024); } }  // black PLA: satin, stays dark
          else { m.roughness = Math.max(0.32, m.roughness); m.color.multiplyScalar(0.62); m.envMapIntensity = 0.7; }  // steel, motor bell
        }
      }
      if (offs[o.name] !== undefined) movers.push({ o, y0: o.position.y, d: offs[o.name] });
    });
    // The CAD sits with the shell bottom at y=0; centre it on the axis.
    const b0 = new THREE.Box3().setFromObject(model); const c0 = b0.getCenter(new THREE.Vector3()), s0 = b0.getSize(new THREE.Vector3());
    model.position.set(-c0.x, -b0.min.y, -c0.z);
    const shadow = contactShadow(Math.max(s0.x, s0.z) * 0.95, dark ? 0.8 : 0.42); shadow.position.y = 0.0004; scene.add(shadow);

    stage.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-label', 'Interactive 3D model of the H-02 actuator. Drag to turn, scroll or pinch to zoom.');
    renderer.domElement.tabIndex = 0;

    let t = 0, target = 0;
    const dir = new THREE.Vector3(-0.55, 0.42, 0.72).normalize();
    function frameFor(tt) {
      for (const m of movers) m.o.position.y = m.y0 + m.d * tt;
      const box = new THREE.Box3().setFromObject(model), sph = box.getBoundingSphere(new THREE.Sphere());
      return sph;
    }
    function place(sph, keepDir) {
      const d = keepDir ? cam.position.clone().sub(controls.target).normalize() : dir;
      const half = THREE.MathUtils.degToRad(cam.fov / 2);
      const fit = Math.min(half, Math.atan(Math.tan(half) * cam.aspect));   // fit the narrower of height and width
      const dist = sph.radius / Math.sin(fit) * 1.05;
      controls.target.copy(sph.center); cam.position.copy(sph.center).addScaledVector(d, dist);
      controls.minDistance = dist * 0.45; controls.maxDistance = dist * 2.2;
    }
    function resize() {
      const r = stage.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false); cam.aspect = r.width / Math.max(1, r.height); cam.updateProjectionMatrix();
    }
    resize(); place(frameFor(0), false);
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage); else addEventListener('resize', resize);

    let visible = true;
    new IntersectionObserver(es => { visible = es.some(e => e.isIntersecting); if (visible) requestAnimationFrame(loop); }).observe(root);
    function loop() {
      if (Math.abs(target - t) > 0.0005) { t += (target - t) * 0.12; place(frameFor(t), true); if (slider) slider.value = Math.round(t * 100); }
      controls.update(); renderer.render(scene, cam);
      if (visible) requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    if (poster) poster.classList.add('is-hidden');
    say('Drag to turn. Scroll or pinch to zoom.');

    if (slider) slider.addEventListener('input', () => { target = t = slider.value / 100; place(frameFor(t), true); });
    root.querySelectorAll('[data-v]').forEach(btn => {
      const v = btn.dataset.v;
      if (v === 'assembled') btn.addEventListener('click', () => { target = 0; });
      if (v === 'exploded') btn.addEventListener('click', () => { target = 1; });
      if (v === 'reset') btn.addEventListener('click', () => { target = t = 0; if (slider) slider.value = 0; place(frameFor(0), false); controls.autoRotate = false; });
    });
  }
}
document.querySelectorAll('[data-viewer]').forEach(mount);

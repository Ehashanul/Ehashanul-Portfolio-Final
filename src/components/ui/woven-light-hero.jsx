// Static particle geometry; animation stays on the GPU instead of rewriting
// and uploading tens of thousands of positions on the main thread each frame.
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const VERTEX = `
attribute vec3 color;
uniform vec3 pointer;
uniform float presence;
uniform float viewportHeight;
uniform float pointSize;
varying vec3 tint;
void main() {
  vec3 offset = position - pointer;
  float distanceToPointer = length(offset);
  float influence = 1.0 - smoothstep(0.0, 1.2, distanceToPointer);
  vec3 displaced = position + offset / max(distanceToPointer, 0.001) * influence * influence * presence * 0.32;
  vec4 viewPosition = modelViewMatrix * vec4(displaced, 1.0);
  gl_Position = projectionMatrix * viewPosition;
  gl_PointSize = clamp(pointSize * viewportHeight * 0.5 / max(-viewPosition.z, 0.1), 0.7, 3.0);
  tint = color;
}`;
const FRAGMENT = `
varying vec3 tint;
void main() {
  float radius = length(gl_PointCoord - 0.5);
  float alpha = (1.0 - smoothstep(0.22, 0.5, radius)) * 0.48;
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(tint, alpha);
}`;

function startWovenScene(mount) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compact = window.innerWidth < 768;
  const limited = compact || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || (navigator.deviceMemory && navigator.deviceMemory <= 4);
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' }); }
  catch { return () => {}; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, limited ? 1 : 1.25));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  mount.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 6.4;
  const count = limited ? 8000 : 18000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const knot = new THREE.TorusKnotGeometry(1.5, .44, 240, 40);
  const vertices = knot.attributes.position;
  const color = new THREE.Color();
  for (let index = 0; index < count; index++) {
    const source = Math.floor(index * vertices.count / count) % vertices.count;
    for (let axis = 0; axis < 3; axis++) positions[index * 3 + axis] = vertices.array[source * 3 + axis] + (Math.random() - .5) * .018;
    color.setHSL(.59 + Math.random() * .13, .16 + Math.random() * .15, .5 + Math.random() * .18);
    color.toArray(colors, index * 3);
  }
  knot.dispose();
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const uniforms = {
    pointer: { value: new THREE.Vector3(100,100,100) }, presence: { value: 0 },
    viewportHeight: { value: 1 }, pointSize: { value: limited ? .018 : .016 },
  };
  const material = new THREE.ShaderMaterial({ uniforms, vertexShader: VERTEX, fragmentShader: FRAGMENT, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  const points = new THREE.Points(geometry, material);
  points.rotation.z = -.18;
  points.frustumCulled = false;
  scene.add(points);
  const mouse = new THREE.Vector2();
  const ray = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0,0,1),0);
  const target = new THREE.Vector3(100,100,100);
  const drawingSize = new THREE.Vector2();
  let frame = 0, previous = 0, elapsed = 0;
  let visible = true, disposed = false, pointerInside = false, pointerDirty = false;
  let clientX = 0, clientY = 0;
  const stop = () => { cancelAnimationFrame(frame); frame = 0; previous = 0; pointerInside = false; uniforms.presence.value = 0; };
  const draw = now => {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    // Limit high-refresh screens to 60 rendered frames per second.
    if (previous && now - previous < 15) { frame = requestAnimationFrame(draw); return; }
    const dt = Math.min(previous ? (now-previous)/1000 : 1/60, .05);
    previous = now;
    if (!reduced.matches) {
      elapsed += dt;
      points.rotation.y = elapsed * .055;
      if (pointerDirty) {
        const bounds = mount.getBoundingClientRect();
        pointerInside = bounds.width > 0 && bounds.height > 0 && clientX >= bounds.left && clientX <= bounds.right && clientY >= bounds.top && clientY <= bounds.bottom;
        if (pointerInside) mouse.set((clientX-bounds.left)/bounds.width*2-1, -(clientY-bounds.top)/bounds.height*2+1);
        pointerDirty = false;
      }
      const ease = 1-Math.exp(-dt*9);
      if (pointerInside) {
        points.updateMatrixWorld();
        ray.setFromCamera(mouse,camera);
        if (ray.ray.intersectPlane(plane,target)) {
          points.worldToLocal(target);
          if (uniforms.presence.value < .001) uniforms.pointer.value.copy(target);
          else uniforms.pointer.value.lerp(target,ease);
        }
      }
      uniforms.presence.value += ((pointerInside ? 1 : 0)-uniforms.presence.value)*ease;
    } else uniforms.presence.value = 0;
    renderer.render(scene,camera);
    if (!reduced.matches) frame = requestAnimationFrame(draw);
  };
  const wake = () => { if (!frame && visible && !document.hidden && !disposed) { previous = 0; frame = requestAnimationFrame(draw); } };
  const resize = () => {
    const width = mount.clientWidth, height = mount.clientHeight;
    if (!width || !height) return;
    camera.aspect = width/height;
    camera.position.z = camera.aspect < .8 ? 9 : 6.4;
    camera.updateProjectionMatrix();
    renderer.setSize(width,height);
    renderer.getDrawingBufferSize(drawingSize);
    uniforms.viewportHeight.value = drawingSize.y;
    pointerDirty = true;
    wake();
  };
  const move = event => {
    if (!visible || document.hidden || event.pointerType === 'touch' || reduced.matches) return;
    clientX = event.clientX; clientY = event.clientY; pointerDirty = true;
  };
  const leave = () => { pointerInside = false; pointerDirty = false; };
  const scroll = () => { if (pointerInside) pointerDirty = true; };
  const visibility = () => { if (document.hidden) stop(); else wake(); };
  const preference = () => { stop(); wake(); };
  const observer = new ResizeObserver(resize);
  observer.observe(mount);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) wake(); else stop();
  });
  intersection.observe(mount);
  window.addEventListener('pointermove',move,{passive:true});
  window.addEventListener('scroll',scroll,{passive:true});
  document.documentElement.addEventListener('pointerleave',leave);
  document.addEventListener('visibilitychange',visibility);
  reduced.addEventListener('change',preference);
  resize();
  return () => {
    disposed = true; stop();
    observer.disconnect(); intersection.disconnect();
    window.removeEventListener('pointermove',move);
    window.removeEventListener('scroll',scroll);
    document.documentElement.removeEventListener('pointerleave',leave);
    document.removeEventListener('visibilitychange',visibility);
    reduced.removeEventListener('change',preference);
    geometry.dispose(); material.dispose(); renderer.dispose(); renderer.forceContextLoss();
    renderer.domElement.remove();
  };
}

export function WovenCanvas() {
  const mountRef = useRef(null);
  useEffect(() => {
    let cleanup;
    let cancelled = false;
    const start = () => { if (!cancelled && mountRef.current) cleanup = startWovenScene(mountRef.current); };
    // Let the hero text paint before setting up WebGL and compiling shaders.
    const idle = window.requestIdleCallback ? window.requestIdleCallback(start,{timeout:500}) : null;
    const timer = idle === null ? window.setTimeout(start,60) : null;
    return () => { cancelled = true; if (idle !== null) window.cancelIdleCallback(idle); if (timer !== null) window.clearTimeout(timer); cleanup?.(); };
  }, []);
  return <div ref={mountRef} aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,#161a2600,#000_80%)]" />;
}

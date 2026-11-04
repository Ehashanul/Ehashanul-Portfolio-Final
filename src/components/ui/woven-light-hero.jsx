// Woven particle background adapted from the component supplied by the owner.
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function WovenCanvas() {
  const mountRef = useRef(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' }); }
    catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    mount.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 6.4;
    const particleCount = window.innerWidth < 640 ? 18000 : 40000;
    const positions = new Float32Array(particleCount * 3);
    const homes = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const knot = new THREE.TorusKnotGeometry(1.5, 0.44, 280, 48);
    const vertices = knot.attributes.position;
    const color = new THREE.Color();
    for (let i = 0; i < particleCount; i++) {
      const source = i % vertices.count;
      const offset = i * 3;
      for (let axis = 0; axis < 3; axis++) {
        const value = vertices.array[source * 3 + axis] + (Math.random() - 0.5) * 0.018;
        positions[offset + axis] = homes[offset + axis] = value;
      }
      color.setHSL(0.59 + Math.random() * 0.13, 0.16 + Math.random() * 0.15, 0.5 + Math.random() * 0.18);
      color.toArray(colors, offset);
    }
    knot.dispose();
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({ size: 0.011, vertexColors: true, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.42 });
    const points = new THREE.Points(geometry, material);
    points.rotation.z = -0.18;
    scene.add(points);

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mouse = new THREE.Vector2();
    const ray = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const localPointer = new THREE.Vector3();
    let pointerInside = false;
    let visible = true;
    let frame = 0;
    let previous = 0;
    let elapsed = 0;
    let disposed = false;
    const draw = now => {
      frame = 0;
      if (disposed || !visible || document.hidden) return;
      const dt = Math.min(previous ? (now - previous) / 1000 : 1 / 60, 0.033);
      previous = now;
      if (!motion.matches) {
        elapsed += dt;
        points.rotation.y = elapsed * 0.055;
        points.updateMatrixWorld();
        const active = pointerInside;
        // Reuse vectors and typed arrays; no per-particle object allocation.
        if (active) { ray.setFromCamera(mouse, camera); ray.ray.intersectPlane(plane, localPointer); points.worldToLocal(localPointer); }
        const timeScale = dt * 60;
        const damping = Math.pow(0.95, timeScale);
        for (let i = 0; i < particleCount; i++) {
          const j = i * 3;
          let vx = velocities[j], vy = velocities[j + 1], vz = velocities[j + 2];
          if (active) {
            const dx = positions[j] - localPointer.x;
            const dy = positions[j + 1] - localPointer.y;
            const dz = positions[j + 2] - localPointer.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (distance > 0.001 && distance < 1.2) {
              const force = (1.2 - distance) * 0.009 * timeScale / distance;
              vx += dx * force; vy += dy * force; vz += dz * force;
            }
          }
          vx += (homes[j] - positions[j]) * 0.002 * timeScale;
          vy += (homes[j + 1] - positions[j + 1]) * 0.002 * timeScale;
          vz += (homes[j + 2] - positions[j + 2]) * 0.002 * timeScale;
          velocities[j] = vx * damping; velocities[j + 1] = vy * damping; velocities[j + 2] = vz * damping;
          positions[j] += velocities[j] * timeScale;
          positions[j + 1] += velocities[j + 1] * timeScale;
          positions[j + 2] += velocities[j + 2] * timeScale;
        }
        geometry.attributes.position.needsUpdate = true;
      }
      renderer.render(scene, camera);
      if (!motion.matches) frame = requestAnimationFrame(draw);
    };
    const wake = () => { previous = 0; if (!frame && visible && !document.hidden && !disposed) frame = requestAnimationFrame(draw); };
    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.position.z = camera.aspect < 0.8 ? 9 : 6.4;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      wake();
    };
    const move = event => {
      if (event.pointerType === 'touch' || motion.matches) return;
      const bounds = mount.getBoundingClientRect();
      pointerInside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
      mouse.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
    };
    const leave = () => { pointerInside = false; };
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; pointerInside = false; } else wake(); };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake(); else { cancelAnimationFrame(frame); frame = 0; pointerInside = false; }
    });
    intersection.observe(mount);
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', visibility);
    motion.addEventListener('change', wake);
    resize();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect(); intersection.disconnect();
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', visibility);
      motion.removeEventListener('change', wake);
      geometry.dispose(); material.dispose(); renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  return <div ref={mountRef} aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,#161a2600,#000_80%)]" />;
}

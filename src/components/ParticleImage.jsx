import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { imageRevealProgress } from '../utils/imageMotion';
import './ParticleImage.css';

const VERTEX = `
attribute vec2 position;
varying vec2 point;
void main() {
  point = position * .5 + .5;
  gl_Position = vec4(position, 0., 1.);
}`;

// Independent implementation of a granular image assembly and local ripple.
const FRAGMENT = `
precision highp float;
varying vec2 point;
uniform sampler2D picture;
uniform vec2 resolution;
uniform vec2 cursor;
uniform float progress;
uniform float presence;
uniform float clock;
uniform float density;
float random(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float field(vec2 p) {
  vec2 base = floor(p);
  vec2 f = fract(p);
  f = f*f*(3.-2.*f);
  return mix(mix(random(base),random(base+vec2(1.,0.)),f.x),
             mix(random(base+vec2(0.,1.)),random(base+vec2(1.)),f.x),f.y);
}
void main() {
  vec2 uv = vec2(point.x, 1.-point.y);
  float aspect = resolution.x / resolution.y;
  vec2 ratio = vec2(aspect, 1.);
  vec2 delta = (uv-cursor)*ratio;
  float distance = length(delta);
  vec2 direction = delta / max(distance, .001);
  float ripple = sin(distance*28.-clock*3.)*exp(-distance*8.)*presence;
  vec2 liquid = vec2(field(uv*4.+clock*.13), field(uv*4.-clock*.1+9.))-0.5;
  vec2 distortion = (direction*ripple*.004 + liquid*presence*.0015)/ratio;
  float zoom = 1.+presence*.012+(1.-progress)*.09;
  vec2 cell = floor(gl_FragCoord.xy / (2.5*density));
  float seed = random(cell);
  float arrival = seed*.58+field(uv*5.)*.42;
  float phase = clamp((progress*1.6-arrival)/.6, 0., 1.);
  float settle = 1.-pow(1.-phase,3.);
  vec2 scatter = (vec2(random(cell+12.),random(cell+31.))-0.5)*(1.-settle)*.32;
  vec2 sampleAt = (uv-.5)/zoom+.5+distortion+scatter;
  vec4 color = texture2D(picture, sampleAt);
  color.r = texture2D(picture, sampleAt+distortion*.06).r;
  color.b = texture2D(picture, sampleAt-distortion*.06).b;
  float visible = smoothstep(seed*.75, seed*.75+.2, settle)*smoothstep(0.,.15,settle);
  gl_FragColor = vec4(color.rgb, color.a*visible);
}`;

export default function ParticleImage({ src, alt = '', eager = false }) {
  const root = useRef(null);
  const canvas = useRef(null);
  const reduced = useReducedMotion();
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: '350px' });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setReady(false);
    if (reduced || !near || !src) return;
    const element = root.current;
    const surface = canvas.current;
    let gl;
    try { gl = surface.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false, powerPreference: 'low-power' }); } catch { return; }
    if (!gl) return;
    let disposed = false;
    let frame = 0;
    let previousTime = 0;
    let texture;
    let program;
    let buffer;
    const shaders = [];
    let loaded = false;
    let target = imageRevealProgress(element.getBoundingClientRect().top, window.innerHeight);
    let progress = target >= .999 ? 1 : 0;
    let hover = 0;
    let hoverTarget = 0;
    let mouse = { x: .5, y: .5, tx: .5, ty: .5 };
    let uniforms;
    const release = () => {
      if (texture) gl.deleteTexture(texture);
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      shaders.forEach(shader => gl.deleteShader(shader));
    };
    try {
      const compile = (type, source) => {
        const shader = gl.createShader(type);
        shaders.push(shader);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Image shader unavailable');
        return shader;
      };
      program = gl.createProgram();
      gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Image effect unavailable');
      gl.useProgram(program);
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      uniforms = Object.fromEntries(['picture', 'resolution', 'cursor', 'progress', 'presence', 'clock', 'density'].map(name => [name, gl.getUniformLocation(program, name)]));
      texture = gl.createTexture();
    } catch { release(); return; }

    const draw = time => {
      frame = 0;
      if (disposed || !loaded || document.hidden || gl.isContextLost()) return;
      const dt = previousTime ? Math.min(64, time-previousTime) : 16;
      previousTime = time;
      const ease = 1-Math.exp(-dt/180);
      progress += (target-progress)*ease;
      hover += (hoverTarget-hover)*ease;
      mouse.x += (mouse.tx-mouse.x)*ease;
      mouse.y += (mouse.ty-mouse.y)*ease;
      if (Math.abs(target-progress)<.0005) progress = target;
      if (Math.abs(hoverTarget-hover)<.0005) hover = hoverTarget;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(element.clientWidth*dpr));
      const height = Math.max(1, Math.round(element.clientHeight*dpr));
      if (surface.width !== width || surface.height !== height) { surface.width = width; surface.height = height; }
      gl.viewport(0,0,width,height);
      gl.useProgram(program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uniforms.picture, 0);
      gl.uniform2f(uniforms.resolution, width, height);
      gl.uniform2f(uniforms.cursor, mouse.x, mouse.y);
      gl.uniform1f(uniforms.progress, progress);
      gl.uniform1f(uniforms.presence, hover);
      gl.uniform1f(uniforms.clock, time/1000);
      gl.uniform1f(uniforms.density, dpr);
      gl.clearColor(0,0,0,0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
      if (progress !== target || hover !== hoverTarget || hover > 0) frame = requestAnimationFrame(draw);
    };
    const wake = () => { if (!frame && loaded && !disposed && !document.hidden) { previousTime = 0; frame = requestAnimationFrame(draw); } };
    const updateScroll = () => { target = imageRevealProgress(element.getBoundingClientRect().top, window.innerHeight); wake(); };
    const move = event => {
      if (event.pointerType === 'touch') return;
      const rect = element.getBoundingClientRect();
      mouse.tx = (event.clientX-rect.left)/Math.max(1,rect.width);
      mouse.ty = (event.clientY-rect.top)/Math.max(1,rect.height);
      hoverTarget = 1;
      wake();
    };
    const leave = () => { hoverTarget = 0; wake(); };
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; hoverTarget = 0; } else updateScroll(); };
    const lost = event => { event.preventDefault(); loaded = false; cancelAnimationFrame(frame); frame = 0; setReady(false); };
    const resize = new ResizeObserver(updateScroll);
    resize.observe(element);
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    element.addEventListener('pointermove', move);
    element.addEventListener('pointerleave', leave);
    element.addEventListener('pointercancel', leave);
    surface.addEventListener('webglcontextlost', lost);
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.decoding = 'async';
    image.onload = () => {
      if (disposed || gl.isContextLost()) return;
      try {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        loaded = true;
        updateScroll();
        // Draw before hiding the accessible image to avoid a blank frame.
        cancelAnimationFrame(frame); frame = 0; draw(performance.now());
        setReady(true);
      } catch { setReady(false); }
    };
    image.src = src;
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      image.onload = null;
      image.onerror = null;
      resize.disconnect();
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
      document.removeEventListener('visibilitychange', visibility);
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', leave);
      element.removeEventListener('pointercancel', leave);
      surface.removeEventListener('webglcontextlost', lost);
      release();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [src, reduced, near]);

  return <div ref={root} className={`particle-image${ready ? ' particle-image-ready' : ''}`}>
    <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
    <canvas key={`${src}-${near}-${Boolean(reduced)}`} ref={canvas} aria-hidden="true" />
  </div>;
}

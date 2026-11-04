import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, createPortal, useFrame } from '@react-three/fiber';
import { useFBO } from '@react-three/drei';
import { useInView, useReducedMotion } from 'framer-motion';
import * as THREE from 'three';
import { advanceCarousel, cardPose, createCarouselState, drumSlots, endDrag, selectCard, stepCard, transitionBlur, wrapIndex, CARD_WIDTH, CARD_HEIGHT, DRUM_RADIUS } from '../utils/carouselMotion.mjs';

const SKILLS = [
  { title: 'Interface design', sub: 'Clarity in every pixel.', tag: 'UI / VISUAL SYSTEMS', description: 'Distinctive interfaces with considered typography, intuitive layouts, and a consistent visual language.', color: '#a6b2cc', kind: 0 },
  { title: 'User experience', sub: 'Understand. Simplify. Improve.', tag: 'RESEARCH / STRATEGY', description: 'Turning research and user journeys into thoughtful experiences that solve the right problems.', color: '#b4a3cc', kind: 1 },
  { title: 'Motion & interaction', sub: 'Make every moment feel right.', tag: 'PROTOTYPING / MOTION', description: 'Purposeful movement, responsive feedback, and interactive prototypes that bring products to life.', color: '#b6c3cf', kind: 2 },
  { title: 'Design systems', sub: 'Consistency that scales.', tag: 'COMPONENTS / TOKENS', description: 'Reusable components, clear foundations, and flexible systems that keep teams and products aligned.', color: '#a9b9b4', kind: 3 },
  { title: 'Product design', sub: 'From first idea to final detail.', tag: 'CONCEPT / DELIVERY', description: 'Connecting business goals and user needs through a complete, carefully crafted product experience.', color: '#c6baa8', kind: 4 },
  { title: 'Creative development', sub: 'Beyond the static screen.', tag: 'WEB / INTERACTIVE', description: 'Bridging design and implementation with responsive websites and expressive digital interactions.', color: '#a9aecb', kind: 5 },
];

function artwork(skill, index) {
  const canvas = document.createElement('canvas'); canvas.width = 1280; canvas.height = 1600;
  const ctx = canvas.getContext('2d');
  ctx.scale(2,2);
  const background = ctx.createLinearGradient(0, 0, 640, 800);
  background.addColorStop(0, '#292b33'); background.addColorStop(0.5, '#101115'); background.addColorStop(1, '#22252c');
  ctx.fillStyle = background; ctx.fillRect(0, 0, 640, 800);
  const glow = ctx.createRadialGradient(540, 650, 0, 540, 650, 600);
  glow.addColorStop(0, `${skill.color}65`); glow.addColorStop(1, `${skill.color}00`);
  ctx.fillStyle = glow; ctx.fillRect(0, 0, 640, 800);
  ctx.strokeStyle = '#ffffff30'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(2, 2, 636, 796, 18); ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.font = '500 36px Outfit, sans-serif'; ctx.fillText(skill.title, 40, 70);
  ctx.fillStyle = '#ffffff90'; ctx.font = '400 22px Outfit, sans-serif'; ctx.fillText(skill.sub, 40, 112);
  ctx.save(); ctx.translate(320, 420);
  ctx.strokeStyle = skill.color; ctx.fillStyle = skill.color; ctx.lineWidth = 2;
  ctx.shadowColor = skill.color; ctx.shadowBlur = 20;
  if (skill.kind === 0) {
    for (let i = 2; i >= 0; i--) {
      const x = -145 + i * 22, y = -145 - i * 22;
      ctx.fillStyle = `rgba(24,27,34,${0.8 + i * 0.05})`; ctx.beginPath(); ctx.roundRect(x,y,250,300,18); ctx.fill(); ctx.stroke();
      ctx.fillStyle = skill.color; ctx.globalAlpha = 0.6; ctx.fillRect(x+24,y+28,70,7); ctx.globalAlpha = 1;
      ctx.fillStyle = '#ffffff12'; ctx.fillRect(x+24,y+65,200,100); ctx.fillRect(x+24,y+190,90,60); ctx.fillRect(x+134,y+190,90,60);
    }
  } else if (skill.kind === 1) {
    const points = [[0,0],[-140,-100],[125,-120],[-120,140],[140,115]];
    points.slice(1).forEach(([x,y]) => { ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(x,y); ctx.stroke(); });
    points.forEach(([x,y],i) => { ctx.beginPath(); ctx.arc(x,y,i ? 29 : 58,0,Math.PI*2); ctx.fillStyle = '#1c1925'; ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(x,y,i ? 6 : 14,0,Math.PI*2); ctx.fillStyle = skill.color; ctx.fill(); });
  } else if (skill.kind === 2) {
    for (let i=0;i<7;i++) { ctx.globalAlpha=0.2+i*0.1; ctx.beginPath(); ctx.ellipse((i-3)*22,0,38+i*11,150-i*6,-0.5,0,Math.PI*2); ctx.stroke(); }
  } else if (skill.kind === 3) {
    for (let y=0;y<5;y++) for (let x=0;x<5;x++) { ctx.globalAlpha=0.2+(x+y)/12; ctx.beginPath(); ctx.roundRect(x*58-140,y*58-140,42,42,(x+y)%3 ? 9 : 21); ctx.fill(); }
  } else if (skill.kind === 4) {
    for (let i=0;i<3;i++) { ctx.save(); ctx.rotate(Math.PI/3*i); ctx.beginPath(); ctx.ellipse(0,0,165,65,0,0,Math.PI*2); ctx.stroke(); ctx.restore(); }
    ctx.beginPath(); ctx.arc(0,0,24,0,Math.PI*2); ctx.fill();
  } else {
    ctx.font = '120px monospace'; ctx.textAlign='center'; ctx.fillText('</>',0,35);
    ctx.globalAlpha=0.25; for(let y=-155;y<=155;y+=31) {ctx.beginPath();ctx.moveTo(-180,y);ctx.lineTo(180,y);ctx.stroke();}
  }
  ctx.restore(); ctx.shadowBlur=0; ctx.globalAlpha=1;
  ctx.font='400 15px "Space Mono", monospace'; ctx.fillStyle='#ffffff85'; ctx.fillText(skill.tag,40,750);
  ctx.fillStyle='#ffffff'; ctx.font='400 20px "Space Mono", monospace'; ctx.fillText(`0${index+1}`,550,750);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  return texture;
}

// Curved card surfaces arranged tangentially around a horizontal drum.
const vertexShader = `
  uniform float uRadius;
  uniform float uYaw;
  varying vec2 vUv;
  varying float vLight;
  void main() {
    vUv = uv;
    float bend = position.x / uRadius;
    vec3 p = vec3(sin(bend) * uRadius, position.y, (cos(bend) - 1.0) * uRadius);
    vLight = 0.5 + 0.5 * max(0.0, cos(bend + uYaw));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const fragmentShader = `
  uniform sampler2D uMap;
  uniform float uOpacity;
  varying vec2 vUv;
  varying float vLight;
  void main() {
    vec2 corner = abs(vUv - 0.5) - vec2(0.465, 0.472);
    float shape = length(max(corner, 0.0)) + min(max(corner.x, corner.y), 0.0) - 0.028;
    float alpha = (1.0 - smoothstep(-0.0015, 0.0015, shape)) * uOpacity;
    if (alpha < 0.01) discard;
    vec3 color = texture2D(uMap, vUv).rgb * vLight;
    float rim = smoothstep(0.48, 0.5, abs(vUv.x - 0.5));
    color += vec3(0.12, 0.14, 0.18) * rim;
    gl_FragColor = vec4(color, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const motionVertex = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;
const motionFragment = `
  uniform sampler2D uScene;
  uniform float uBlur;
  varying vec2 vUv;
  void main() {
    vec3 color = texture2D(uScene, vUv).rgb;
    if (uBlur > 0.00001) {
      color = vec3(0.0);
      for (int sampleIndex = 0; sampleIndex < 9; sampleIndex++) {
        float shutter = float(sampleIndex) / 8.0 - 0.5;
        vec2 sampleUv = clamp(vUv + vec2(shutter * uBlur, 0.0), 0.0, 1.0);
        color += texture2D(uScene, sampleUv).rgb / 9.0;
      }
    }
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function CraftScene({ control, reduced, onActive }) {
  const meshes=useRef([]);
  const scene=useMemo(()=>{const value=new THREE.Scene();value.background=new THREE.Color(0x000000);return value;},[]);
  const target=useFBO({depthBuffer:true,type:THREE.HalfFloatType});
  const motionUniforms=useMemo(()=>({uScene:{value:target.texture},uBlur:{value:0}}),[target]);
  const textures=useMemo(()=>SKILLS.map(artwork),[]);
  const slots=useMemo(()=>drumSlots(0,SKILLS.length),[]);
  const cardUniforms=useMemo(()=>slots.map(slot=>({uMap:{value:textures[slot.textureIndex]},uOpacity:{value:1},uYaw:{value:0},uRadius:{value:DRUM_RADIUS}})),[slots,textures]);
  const lastActive=useRef(-1);
  useEffect(()=>()=>textures.forEach(texture=>texture.dispose()),[textures]);
  useFrame(({gl,camera,scene:outputScene},delta)=>{
    const state=control.current;
    const previous=state.position;
    advanceCarousel(state,delta,performance.now(),false,reduced);
    const blur=transitionBlur(state,previous,delta,reduced);
    const neighbors=drumSlots(state.position,SKILLS.length);
    meshes.current.forEach((card,index)=>{
      if(!card)return;
      const neighbor=neighbors[index];
      const pose=cardPose(neighbor.index,state.position,SKILLS.length*2);
      card.position.set(pose.x,0,pose.z);
      card.rotation.y=pose.rotation;
      card.material.uniforms.uYaw.value=pose.rotation;
      card.material.uniforms.uOpacity.value=pose.opacity;
      card.material.uniforms.uMap.value=textures[neighbor.textureIndex];
    });
    const active=wrapIndex(Math.round(state.position),SKILLS.length);
    if(active!==lastActive.current){lastActive.current=active;onActive(active);}
    motionUniforms.uBlur.value=blur;
    const previousTarget=gl.getRenderTarget();
    gl.setRenderTarget(target);
    gl.clear();
    gl.render(scene,camera);
    gl.setRenderTarget(previousTarget);
    gl.render(outputScene,camera);
  },1);
  return <>{createPortal(slots.map((slot,index)=><mesh key={index} ref={mesh=>{meshes.current[index]=mesh;}} frustumCulled={false}>
    <planeGeometry args={[CARD_WIDTH,CARD_HEIGHT,80,8]} />
    <shaderMaterial uniforms={cardUniforms[index]} vertexShader={vertexShader} fragmentShader={fragmentShader} transparent side={THREE.FrontSide} />
  </mesh>),scene)}<mesh frustumCulled={false}><planeGeometry args={[2,2]} /><shaderMaterial uniforms={motionUniforms} vertexShader={motionVertex} fragmentShader={motionFragment} depthTest={false} depthWrite={false} /></mesh></>;
}
export default function Expertise() {
  const section = useRef(null);
  const stage = useRef(null);
  const inView = useInView(section,{ margin: '100px' });
  const reduced = useReducedMotion();
  const [active,setActive]=useState(0);
  const [supported,setSupported]=useState(false);
  const [fontsReady,setFontsReady]=useState(false);
  const control=useRef(createCarouselState());
  useEffect(()=>{
    let active=true;
    Promise.all([document.fonts.load('500 36px Outfit'),document.fonts.load('400 22px Outfit'),document.fonts.load('400 15px "Space Mono"')]).catch(()=>{}).finally(()=>{if(active)setFontsReady(true);});
    return()=>{active=false;};
  },[]);
  useEffect(() => {
    const canvas=document.createElement('canvas');
    setSupported(Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl')));
  },[]);
  const step=direction=>stepCard(control.current,direction,performance.now());
  const select=index=>selectCard(control.current,index,SKILLS.length,performance.now());
  const animated=supported && fontsReady;
  const pointerDown=event=>{
    if(event.pointerType==='mouse' && event.button!==0)return;
    const state=control.current;
    Object.assign(state,{dragging:true,startX:event.clientX,lastX:event.clientX,startTarget:state.target,distance:0,velocity:0,lastTime:performance.now()});
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const pointerMove=event=>{
    const state=control.current;
    if(!state.dragging)return;
    const now=performance.now();
    const distance=event.clientX-state.startX;
    state.distance=Math.max(state.distance,Math.abs(distance));
    state.target=state.startTarget-distance/Math.max(160,event.currentTarget.clientWidth*0.3);
    state.velocity=state.velocity*0.65+(event.clientX-state.lastX)/Math.max(1,now-state.lastTime)*0.35;
    state.lastX=event.clientX;state.lastTime=now;
  };
  const pointerUp=event=>{
    const state=control.current;
    if(!state.dragging)return;
    const clicked=state.distance<6;
    endDrag(state,performance.now(),Math.max(160,event.currentTarget.clientWidth*0.3));
    if(clicked){const rect=event.currentTarget.getBoundingClientRect();const x=(event.clientX-rect.left)/rect.width;if(x<0.33)step(-1);else if(x>0.67)step(1);}
  };
  return <section id="expertise" ref={section} className="craft-section relative z-10 bg-black py-24 md:py-32">
    <div className="max-w-7xl mx-auto px-6 md:px-14">
      <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40 mb-5">The thinking. The making. The details.</p>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6"><h2 className="font-bebas text-6xl md:text-8xl lg:text-9xl tracking-wide leading-none">EXPERTISE & <span className="text-white/45">CRAFT</span></h2><p className="text-white/45 text-sm leading-relaxed max-w-xs md:pb-2">A considered blend of strategy, visual design, and interaction. Built around people.</p></div>
    </div>
    {animated ? <>
      <div ref={stage} className="craft-stage" role="group" tabIndex={0} aria-label="Drum expertise carousel. Click a side card, drag, or use Left and Right arrow keys. Scrolling moves the page." onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={event=>{if(control.current.dragging)endDrag(control.current,performance.now(),Math.max(160,event.currentTarget.clientWidth*0.3));}} onLostPointerCapture={()=>{if(control.current.dragging)endDrag(control.current,performance.now(),300);}} onKeyDown={event=>{if(event.key==='ArrowLeft'){event.preventDefault();step(-1);}else if(event.key==='ArrowRight'){event.preventDefault();step(1);}else if(event.key==='Home'){event.preventDefault();select(0);}else if(event.key==='End'){event.preventDefault();select(SKILLS.length-1);}}}>
        {inView && <Canvas frameloop="always" camera={{ position:[0,0,8.3],fov:35 }} dpr={[1,1.5]} gl={{ alpha:true,antialias:true }} aria-hidden="true"><Suspense fallback={null}><CraftScene control={control} reduced={reduced} onActive={setActive} /></Suspense></Canvas>}
        
      </div>
      <div className="craft-pagination" aria-label="Select expertise">{SKILLS.map((skill,index)=><button type="button" key={skill.title} aria-label={`Show ${skill.title}`} aria-pressed={active===index} onClick={()=>select(index)}><span /></button>)}</div><ul className="sr-only" aria-label="Expertise overview">{SKILLS.map(skill=><li key={skill.title}>{skill.title}: {skill.description}</li>)}</ul>
    </> : <div className="max-w-7xl mx-auto px-6 md:px-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">{SKILLS.map((skill,index)=><article className="craft-static-card" key={skill.title}><span className="text-white/30 font-mono text-xs">0{index+1}</span><h3 className="text-xl mt-16 mb-4">{skill.title}</h3><p className="text-sm leading-relaxed text-white/50">{skill.description}</p><p className="font-mono text-[9px] tracking-widest text-white/30 mt-10">{skill.tag}</p></article>)}</div>}
  </section>;
}

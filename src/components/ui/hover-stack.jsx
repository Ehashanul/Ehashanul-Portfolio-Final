// Adapted from the owner-supplied Hyperiux Hover Stack component.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import useCardDustReveal from './useCardDustReveal';

const ROTATIONS = [-8,5,-3,6,-4,7];

function CardContent({ card, index }) {
  return <>
    <div className="expertise-stack-top"><span>{card.category}</span><span className="expertise-stack-dot" aria-hidden="true" /></div>
    <div className="expertise-stack-copy"><h3>{card.title}</h3><p>{card.quote}</p></div>
    <div className="expertise-stack-footer"><span>{card.tag}</span><span>{String(index + 1).padStart(2,'0')}</span></div>
  </>;
}

export default function HoverStack({ cards, cardWidth = 260, cardHeight = 350, overlap = 104, hoverLift = 30, pushDistance = 180, spread = 24, duration = 0.5 }) {
  const root = useRef(null);
  const [width,setWidth] = useState(0);
  const [coarse,setCoarse] = useState(false);
  const [active,setActive] = useState(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const element=root.current;
    const resize=new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    resize.observe(element);
    const query=window.matchMedia('(pointer: coarse)');
    const update=()=>setCoarse(query.matches);
    update();query.addEventListener('change',update);
    return()=>{resize.disconnect();query.removeEventListener('change',update);};
  },[]);
  const prepared=useMemo(()=>cards.map((card,index)=>({...card,x:index*overlap,rotation:ROTATIONS[index%ROTATIONS.length]})),[cards,overlap]);
  const totalWidth=cardWidth+Math.max(0,cards.length-1)*overlap;
  const scale=Math.min(1,(width || 1200)/(totalWidth+pushDistance*2+30));
  const compact=coarse || (width>0 && width<720);
  const dust = useCardDustReveal(root, cards.length, reduced, width > 0, compact);
  const pose=(card,index)=>{
    const selected=index===active;
    let x=card.x,y=0,rotate=card.rotation;
    if(active!==null && !reduced){
      if(index<active){x-=pushDistance;y-=spread*0.4;}
      if(index>active){x+=pushDistance;y+=spread*0.4;}
      if(selected){y=-hoverLift;rotate=0;}
    }
    return {width:cardWidth,height:cardHeight,background:card.bg,color:card.ink || '#f1f2f5',transform:`translate3d(${x}px,${y}px,0) rotate(${rotate}deg) scale(${selected && !reduced?1.035:1})`,zIndex:selected?100:cards.length-index,transition:reduced?'none':`transform ${duration}s cubic-bezier(0.22,1,0.36,1), box-shadow ${duration}s ease`,boxShadow:selected?'0 22px 65px #0009, 0 0 0 1px #ffffff40':'0 12px 35px #0007'};
  };
  return <div ref={root} className={`expertise-stack${dust.pending ? ' expertise-dust-pending' : ''}`} onMouseLeave={()=>{if(!root.current.contains(document.activeElement))setActive(null);}} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))setActive(null);}}>
    {dust.filters}
    {compact ? <div className="expertise-stack-grid">{cards.map((card,index)=><article key={card.id} className="expertise-stack-card" style={{background:card.bg,color:card.ink || '#f1f2f5'}}><CardContent card={card} index={index}/></article>)}</div> : <div className="expertise-stack-space" style={{height:(cardHeight+hoverLift+80)*scale+24}}>
      <div className="expertise-stack-rail" style={{width:totalWidth,height:cardHeight,transform:`translateX(-50%) scale(${scale})`}}>
        {prepared.map((card,index)=><article key={card.id} tabIndex={0} className="expertise-stack-card expertise-stack-floating" style={pose(card,index)} onMouseEnter={()=>setActive(index)} onFocus={()=>setActive(index)} onKeyDown={event=>{if(event.key==='Escape')setActive(null);}}><CardContent card={card} index={index}/></article>)}
      </div>
    </div>}
  </div>;
}

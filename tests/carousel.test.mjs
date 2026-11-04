import test from 'node:test';
import assert from 'node:assert/strict';
import { createCarouselState, advanceCarousel, cardPose, drumSlots, endDrag, selectCard, stepCard, transitionBlur, CARD_WIDTH, CARD_HEIGHT, CARD_VERTICAL_FIT, DRUM_RADIUS, DRUM_SPACING } from '../src/utils/carouselMotion.mjs';

test('blur exists only during a card change and is exactly zero when settled', () => {
  const state=createCarouselState();
  assert.equal(transitionBlur(state,0,1/60),0);
  state.target=1;state.position=0.4;
  assert.ok(transitionBlur(state,0.3,1/60)>0);
  state.position=0.995;
  assert.ok(transitionBlur(state,0.98,1/60)>0);
  state.position=1;
  assert.equal(transitionBlur(state,1,1/60),0);
  state.position=0.5;
  assert.equal(transitionBlur(state,0.4,1/60,true),0);
  state.dragging=true;
  assert.ok(transitionBlur(state,0.4,1/60)>0);
});

test('autoplay advances a single card and holds its target until the next interval', () => {
  const state=createCarouselState();
  advanceCarousel(state,1/60,100,true);
  assert.equal(state.target,1);
  for(let frame=1;frame<180;frame++) advanceCarousel(state,1/60,100+frame*16,true);
  assert.equal(state.target,1);
  assert.ok(Math.abs(state.position-1)<0.001);
  advanceCarousel(state,1/60,4000,true);
  assert.equal(state.target,2);
});

test('pause and dragging prevent automatic advancement', () => {
  const state=createCarouselState();
  advanceCarousel(state,1/60,100,false);
  assert.equal(state.target,0);
  state.dragging=true;
  advanceCarousel(state,1/60,5000,true);
  assert.equal(state.target,0);
});

test('a manually selected card settles without reversing or advancing again', () => {
  const state=createCarouselState();
  stepCard(state,1,0);
  let previous=state.position;
  for(let frame=0;frame<1200;frame++) {
    advanceCarousel(state,1/60,frame*1000/60,false);
    assert.ok(state.position>=previous);
    assert.equal(state.target,1);
    previous=state.position;
  }
  assert.equal(state.position,1);
});

test('cards follow the drum circumference with tangent rotations', () => {
  assert.equal(cardPose(0,0,6).rotation,0);
  const side=cardPose(1,0,6);
  assert.equal(side.rotation,DRUM_SPACING);
  assert.ok(Math.abs(side.x**2+(side.z+DRUM_RADIUS)**2-DRUM_RADIUS**2)<0.0001);
  assert.equal(cardPose(0,6,6).offset,0);
});

test('drag release snaps to an integral card, including momentum', () => {
  const state=createCarouselState();
  Object.assign(state,{target:1.3,dragging:true,velocity:-1,lastTime:100});
  endDrag(state,110,300);
  assert.equal(state.target,2);
  assert.equal(state.dragging,false);
});

test('navigation selects the nearest loop and moves in the requested direction', () => {
  const state=createCarouselState();
  state.position=5.8;state.target=6;
  selectCard(state,0,6,100);
  assert.equal(state.target,6);
  stepCard(state,-1,200);
  assert.equal(state.target,5);
});

test('autoplay continues beyond the last card through multiple complete loops', () => {
  const state=createCarouselState();
  for(let index=0;index<30;index++) {
    advanceCarousel(state,1/60,index*4000+1,true);
    assert.equal(state.target,index+1);
  }
  assert.equal(cardPose(0,30,6).offset,0);
  assert.equal(cardPose(0,-30,6).offset,0);
});

test('the first card moves continuously across the last-to-first seam', () => {
  const before=cardPose(0,5.99,6);
  const after=cardPose(0,6.01,6);
  assert.ok(Math.abs(before.x-after.x)<0.1);
  assert.equal(before.opacity,1);
  assert.equal(after.opacity,1);
});

test('lens fitting preserves the visible center card at a 4:5 aspect ratio', () => {
  assert.ok(Math.abs(CARD_WIDTH / (CARD_HEIGHT / CARD_VERTICAL_FIT) - 4/5)<0.00001);
});

test('recycled drum neighbors always include the first card after the last, in both directions', () => {
  for (const position of [-600.1,-6,-0.1,0,5.99,6,6.01,600]) {
    const slots=drumSlots(position,6);
    assert.equal(slots.length,9);
    for(const slot of slots) assert.ok(slot.textureIndex>=0 && slot.textureIndex<6);
    const nearest=slots.find(slot=>slot.index===Math.round(position));
    assert.ok(nearest);
    assert.equal(nearest.textureIndex,((Math.round(position)%6)+6)%6);
    assert.equal(cardPose(nearest.index,position,12).opacity,1);
  }
  assert.equal(drumSlots(6,6).find(slot=>slot.index===6).textureIndex,0);
});

test('transitions retain readable card faces instead of two simultaneous edge-on cards', () => {
  for(let position=0;position<=1;position+=0.025) {
    const first=cardPose(0,position,12);
    const next=cardPose(1,position,12);
    const visibleWidth=Math.abs(Math.cos(first.rotation))+Math.abs(Math.cos(next.rotation));
    assert.ok(visibleWidth>0.5);
    assert.ok(cardPose(2,position,12).opacity>0.5);
  }
});

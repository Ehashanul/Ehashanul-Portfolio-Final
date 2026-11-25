// Device frames and compositions preserve each original PNG's exact aspect ratio.
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../public/projects/beauty-editor');
let serial=0;
const manifest=[];
function phone(name,x,y,height,angle=0,label='') {
 const png=fs.readFileSync(path.join(root,'screens',name+'.png'));
 const width=height*png.readUInt32BE(16)/png.readUInt32BE(20);
 const id='beauty-screen-'+serial++;
 return `<g transform="translate(${x} ${y}) rotate(${angle} ${width/2} ${height/2})">${label?`<text x="${width/2}" y="-42" text-anchor="middle" fill="#cfb6c0" font-family="Arial,sans-serif" font-size="18" letter-spacing="3">${label}</text>`:''}<rect x="-13" y="-13" width="${width+26}" height="${height+26}" rx="${width*.12}" fill="url(#metal)" stroke="#777078" stroke-width="1.5" filter="url(#shadow)"/><rect x="-7" y="-7" width="${width+14}" height="${height+14}" rx="${width*.108}" fill="#050506"/><rect x="${width+13}" y="${height*.23}" width="5" height="${height*.075}" rx="2" fill="#58505a"/><clipPath id="${id}"><rect width="${width}" height="${height}" rx="${width*.095}"/></clipPath><image data-screen="${name}" href="data:image/png;base64,${png.toString('base64')}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" clip-path="url(#${id})"/></g>`;
}
function scene(file,title,devices,options={}) {
 serial=0;
 const width=options.width||2400,height=options.height||1600;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><title>Beauty Editor / ${title||'Onboarding thumbnail'}</title><defs><radialGradient id="bg"><stop stop-color="#3c2533"/><stop offset=".65" stop-color="#21171e"/><stop offset="1" stop-color="#101014"/></radialGradient><radialGradient id="glow"><stop stop-color="#cf6a94" stop-opacity=".16"/><stop offset="1" stop-color="#cf6a94" stop-opacity="0"/></radialGradient><linearGradient id="metal"><stop stop-color="#797079"/><stop offset=".1" stop-color="#272127"/><stop offset=".7" stop-color="#131115"/><stop offset="1" stop-color="#514851"/></linearGradient><filter id="shadow" x="-50%" y="-30%" width="200%" height="180%"><feDropShadow dx="8" dy="28" stdDeviation="25" flood-opacity=".6"/></filter></defs><rect width="${width}" height="${height}" fill="url(#bg)"/><ellipse cx="${width*.55}" cy="${height*.65}" rx="${width*.6}" ry="${height*.5}" fill="url(#glow)"/>${title?`<text x="85" y="95" fill="#c8acb9" font-family="Arial,sans-serif" font-size="17" letter-spacing="3">BEAUTY EDITOR / IOS + ANDROID</text><text x="85" y="180" fill="#f3edf0" font-family="Arial,sans-serif" font-size="55" letter-spacing="-2">${title}</text>`:''}${devices.map(args=>phone(...args)).join('')}${title?`<path d="M85 ${height-95}H${width-85}" stroke="#ffffff18"/><text x="85" y="${height-48}" fill="#9a7d8a" font-family="Arial,sans-serif" font-size="14" letter-spacing="3">ASSISTANT DESIGN / ASSET MANAGEMENT / DESIGN REFINEMENTS</text>`:''}</svg>`;
 fs.writeFileSync(path.join(root,file+'.svg'),svg);
 manifest.push({asset:file+'.svg',screens:devices.map(item=>item[0]),preview:Boolean(options.preview)});
}
scene('hero','Design support across two platforms.',[['android-home',620,340,1000,-3,'ANDROID'],['ios-home',1380,340,1000,3,'IOS']]);
scene('thumbnail','',[['android-home',610,62,818,0]],{width:1584,height:992,preview:true});
scene('retouch','01 / Keep the portrait in focus.',[['android-retouch',620,340,1000,-3,'ANDROID'],['ios-retouch',1380,340,1000,3,'IOS']]);
scene('reshape','02 / Refining the shape of an interaction.',[['android-reshape',620,340,1000,-3,'ANDROID'],['ios-reshape',1380,340,1000,3,'IOS']]);
scene('makeup','03 / Small details in the finishing tools.',[['android-makeup',620,340,1000,-3,'ANDROID'],['ios-makeup',1380,340,1000,3,'IOS']]);
scene('premium','04 / Two premium presentations.',[['android-premium',620,340,1000,-3,'ANDROID'],['ios-premium',1380,340,1000,3,'IOS']]);
scene('save-share','05 / A clear finish to the editing journey.',[['android-save',620,340,1000,-3,'ANDROID'],['ios-save',1380,340,1000,3,'IOS']]);
fs.writeFileSync(path.join(root,'mockup-manifest.json'),JSON.stringify({project:'Beauty Editor',platforms:['iOS','Android'],compositions:manifest},null,2));
console.log('Built seven Beauty Editor presentations using the exact original screens.');

// Rebuild deterministic mockups with the original UI pixels preserved.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../public/projects/unblur');
const screens = Object.fromEntries(fs.readdirSync(root+'/screens').map(file => [file.replace('.webp',''), 'data:image/webp;base64,'+fs.readFileSync(root+'/screens/'+file).toString('base64')]));
let serial = 0;
function phone(name,x,y,w,rotate=0) {
  const h=w*2622/1206;
  const id='screen'+serial++;
  const islandW=w*.24, islandH=w*.064;
  return `<g transform="translate(${x} ${y}) rotate(${rotate} ${w/2} ${h/2})"><rect x="-15" y="-15" width="${w+30}" height="${h+30}" rx="${w*.145}" fill="url(#aluminum)" stroke="#72737a" stroke-width="1.5" filter="url(#shadow)"/><rect x="-9" y="-9" width="${w+18}" height="${h+18}" rx="${w*.13}" fill="#030305" stroke="#25262c" stroke-width="2"/><g fill="#4b4c53"><rect x="-20" y="${h*.16}" width="5" height="${h*.025}" rx="2"/><rect x="-20" y="${h*.23}" width="5" height="${h*.055}" rx="2"/><rect x="-20" y="${h*.305}" width="5" height="${h*.055}" rx="2"/><rect x="${w+15}" y="${h*.27}" width="5" height="${h*.085}" rx="2"/></g><clipPath id="${id}"><rect width="${w}" height="${h}" rx="${w*.115}"/></clipPath><image data-screen="${name}" href="${screens[name]}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" clip-path="url(#${id})"/><rect x="${(w-islandW)/2}" y="${w*.028}" width="${islandW}" height="${islandH}" rx="${islandH/2}" fill="#020204"/><circle cx="${w*.585}" cy="${w*.06}" r="${w*.012}" fill="#10111b" stroke="#1b1d28" stroke-width=".7"/></g>`;
}
function scene(file,w,h,eyebrow,headline,devices,brand=false) {
  serial=0;
  const art=brand ? `<g transform="translate(${w*.5} ${h*.53}) rotate(-12)"><rect x="-${w*.23}" y="-${h*.22}" width="${w*.4}" height="${h*.4}" rx="90" fill="#9d79e4" opacity=".12" stroke="#d4baff" stroke-opacity=".4"/><rect x="-${w*.1}" y="-${h*.13}" width="${w*.35}" height="${h*.37}" rx="80" fill="url(#brand)" stroke="#ddd0f5" stroke-opacity=".5"/><circle r="${w*.1}" fill="none" stroke="#e2d0ff" stroke-opacity=".8" stroke-width="2"/><path d="M-${w*.15} 0H${w*.2}" stroke="#eee2ff" stroke-opacity=".5"/></g>` : devices.map(args=>phone(...args)).join('');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><title>Unblur / ${brand?'Visual identity':'iPhone 18 Pro mockup'}</title><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#15151a"/><stop offset="1" stop-color="#0b0b10"/></linearGradient><linearGradient id="aluminum" x2="1" y2=".4"><stop stop-color="#777880"/><stop offset=".08" stop-color="#292a30"/><stop offset=".5" stop-color="#111216"/><stop offset=".9" stop-color="#505158"/><stop offset="1" stop-color="#202126"/></linearGradient><linearGradient id="brand" x2="1" y2="1"><stop stop-color="#a17de4" stop-opacity=".5"/><stop offset="1" stop-color="#32125e" stop-opacity=".3"/></linearGradient><radialGradient id="light"><stop stop-color="#8860cc" stop-opacity=".25"/><stop offset="1" stop-color="#8860cc" stop-opacity="0"/></radialGradient><filter id="shadow" x="-60%" y="-30%" width="220%" height="180%"><feDropShadow dx="10" dy="35" stdDeviation="30" flood-color="#000" flood-opacity=".65"/></filter></defs><rect width="${w}" height="${h}" fill="url(#bg)"/><ellipse cx="${w*.55}" cy="${h*.55}" rx="${w*.6}" ry="${h*.7}" fill="url(#light)"/><path d="M80 ${h-100}H${w-80}" stroke="#ffffff18"/><text x="90" y="100" fill="#b6aacb" font-family="Arial,sans-serif" font-size="17" letter-spacing="4">${eyebrow}</text><text x="90" y="${brand?230:190}" fill="#eeeaf4" font-family="Arial,sans-serif" font-size="${brand?110:58}" letter-spacing="-2">${headline}</text>${art}<text x="90" y="${h-55}" fill="#77717f" font-family="Arial,sans-serif" font-size="14" letter-spacing="3">UNBLUR / PRODUCT DESIGN</text></svg>`;
  fs.writeFileSync(root+'/'+file+'.svg',svg);
}
scene('cover-v2',1600,2160,'SELECTED WORK / IOS','Unblur',[],true);
scene('bento-v2',2400,1600,'SELECTED WORK / IOS','Unblur',[],true);
scene('creative-flow-v4',2400,1600,'01 / ACCESS. CREATE. SAVE.','A clear path through the experience.',[['feature-access',370,320,430,-5],['editor',985,320,430,0],['saved-result',1600,320,430,5]]);

scene('upgrade-v2',2400,1700,'02 / MAKING PRO TANGIBLE','A clear offer. A considered next step.',[['paywall',620,310,510,-4],['purchase-success',1390,310,510,4]]);
scene('settings-v2',1600,1850,'03 / A CONNECTED EXPERIENCE','The details beyond the edit.',[['settings',500,315,570,0]]);
fs.writeFileSync(root+'/mockup-manifest.json',JSON.stringify({ device:'iPhone 18 Pro', reference:'https://www.apple.com/iphone-18-pro/', compositions:[
  {asset:'hero-studio-v2.webp',screens:['onboarding']},
  {asset:'creative-flow-v4.svg',screens:['feature-access','editor','saved-result']},
  {asset:'upgrade-v2.svg',screens:['paywall','purchase-success']},
  {asset:'settings-v2.svg',screens:['settings']},
  {asset:'feedback-v4.webp',screens:['feedback']},
  {asset:'cover-v2.svg',screens:[]},
  {asset:'bento-v2.svg',screens:[]}
]},null,2));
console.log('Updated mockups: each of the eight app screens has one assigned composition.');

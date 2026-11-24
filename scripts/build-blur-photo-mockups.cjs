// Exact-screen portfolio compositions for the Blur Photo Editor relaunch.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../public/projects/blur-photo-editor');
let serial = 0;
const used = [];
function device(name, x, y, width, rotation = 0, label = '') {
  const uri = 'data:image/webp;base64,'+fs.readFileSync(root+'/screens/'+name+'.webp').toString('base64');
  const height = width * (name.startsWith('old-') ? 2868/1320 : 3200/1440);
  const id = 'photo-screen-'+serial++;
  return `<g transform="translate(${x} ${y}) rotate(${rotation} ${width/2} ${height/2})">${label ? `<text x="${width/2}" y="-45" text-anchor="middle" fill="#c1b5da" font-family="Arial,sans-serif" font-size="17" letter-spacing="3">${label}</text>` : ''}<rect x="-13" y="-13" width="${width+26}" height="${height+26}" rx="${width*.11}" fill="url(#edge)" stroke="#71717b" stroke-width="1" filter="url(#shadow)"/><rect x="-7" y="-7" width="${width+14}" height="${height+14}" rx="${width*.1}" fill="#050506"/><rect x="${width+13}" y="${height*.23}" width="5" height="${height*.08}" rx="2" fill="#52525d"/><clipPath id="${id}"><rect width="${width}" height="${height}" rx="${width*.085}"/></clipPath><image data-screen="${name}" href="${uri}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" clip-path="url(#${id})"/></g>`;
}
function composition(file, number, title, devices, options={}) {
  const width=options.width || 2400, height=options.height || 1600;
  serial=0;
  let artwork;
  if (options.brand) artwork=`<g transform="translate(${width*.53} ${height*.55}) rotate(-15)">${Array.from({length:7},(_,i)=>`<rect x="${-width*.14+i*10}" y="${-height*.15+i*8}" width="${width*.3}" height="${height*.28}" rx="35" fill="none" stroke="${['#eea95d','#e46f78','#c252bc','#aa56dd','#8448e9','#6637db','#9d6ce8'][i]}" stroke-width="${width*.014}" transform="rotate(${i*8-20})"/>`).join('')}</g>`;
  else artwork=devices.map(args=>device(...args)).join('');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><title>Blur Photo Editor / ${title}</title><defs><linearGradient id="base" x2="1" y2="1"><stop stop-color="#17151e"/><stop offset="1" stop-color="#0b0b10"/></linearGradient><radialGradient id="glow"><stop stop-color="#7351ad" stop-opacity=".24"/><stop offset="1" stop-color="#7351ad" stop-opacity="0"/></radialGradient><linearGradient id="edge" x2="1" y2=".2"><stop stop-color="#73717e"/><stop offset=".12" stop-color="#26252e"/><stop offset=".6" stop-color="#0c0c10"/><stop offset="1" stop-color="#4b4955"/></linearGradient><filter id="shadow" x="-50%" y="-30%" width="200%" height="180%"><feDropShadow dy="28" dx="10" stdDeviation="28" flood-opacity=".6"/></filter></defs><rect width="${width}" height="${height}" fill="url(#base)"/><ellipse cx="${width*.5}" cy="${height*.55}" rx="${width*.6}" ry="${height*.7}" fill="url(#glow)"/><text x="85" y="95" fill="#aea0c4" font-family="Arial,sans-serif" font-size="17" letter-spacing="3">${number} / BLUR PHOTO EDITOR</text><text x="85" y="180" fill="#f0edf5" font-family="Arial,sans-serif" font-size="${options.brand?80:55}" letter-spacing="-2">${title}</text>${artwork}<path d="M85 ${height-95}H${width-85}" stroke="#ffffff18"/><text x="85" y="${height-48}" fill="#7f768d" font-family="Arial,sans-serif" font-size="14" letter-spacing="3">LEAD DESIGN / RELAUNCH / ONGOING PRODUCT MANAGEMENT</text></svg>`;
  fs.writeFileSync(root+'/'+file+'.svg',svg);
  used.push({asset:file+'.svg',screens:devices.map(item=>item[0]),number});
}
composition('cover','SELECTED WORK','Blur Photo Editor',[],{brand:true,width:1600,height:2160});
composition('bento','SELECTED WORK','Blur Photo Editor',[],{brand:true});
composition('home-before-after','01','A clearer way into the product.',[['old-home',610,330,455,-3,'BEFORE'],['main-home',1380,330,455,3,'AFTER']] );
composition('onboarding','02','Begin with what people want to do.',[['ob1',360,330,430,-4],['ob2',985,330,430,0],['ob3',1610,330,430,4]] );
composition('discovery','03','From choosing a photo to trying a style.',[['picker-with-permission',610,330,455,-3],['preset-preview',1380,330,455,3]] );
composition('editing-before-after','04','Less searching. More editing.',[['old-effects',610,330,455,-3,'BEFORE'],['auto-blur',1380,330,455,3,'AFTER']] );
composition('editing-modes','05','Different jobs. A shared editing language.',[['auto-blur1',250,350,360,-3,'FACE BLUR'],['auto-blur-2',765,350,360,-1,'EFFECTS'],['auto-blur-3',1280,350,360,1,'SHAPE'],['unblur',1795,350,360,3,'UNBLUR']] );
composition('ai-before-after','06','Give creative exploration more structure.',[['old-editing-ai-filter-16',360,330,430,-4,'BEFORE'],['editing-ai-filter-174',985,330,430,0,'AFTER / STYLE'],['editing-ai-filter-181',1610,330,430,4,'AFTER / BROWSE']] );
composition('feature-entry','07','Introduce the tool in context.',[['home-1',610,330,455,-3,'BLUR'],['home-3',1380,330,455,3,'RESTORE']] );
composition('premium-before-after','08','A more deliberate premium presentation.',[['old-weekly-free-trial',610,330,455,-3,'BEFORE'],['varient-1',1380,330,455,3,'AFTER']] );
composition('offers','09','Keep follow-up offers connected.',[['varient-4',610,330,455,-3,'ANNUAL OFFER'],['varient-5',1380,330,455,3,'FEATURE OFFER']] );
used.push({asset:'hero-studio.webp',screens:['portrait-picture'],number:'HERO'});
fs.writeFileSync(root+'/mockup-manifest.json',JSON.stringify({project:'Blur Photo Editor',device:'Android app presentation',compositions:used},null,2));
console.log('Built comparison and journey visuals with each selected screen used once.');

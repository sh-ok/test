const {chromium}=require('playwright');
(async()=>{const dir=process.argv[2];const times=process.argv.slice(3).map(Number);
const b=await chromium.launch({args:['--allow-file-access-from-files']});const p=await b.newPage({viewport:{width:1920,height:1080}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file://'+dir+'/clip.html');await p.evaluate(()=>window.ready);
for(const t of times){const t0=Date.now();await p.evaluate(f=>render(f),Math.round(t*30));const d=await p.evaluate(()=>document.getElementById('c').toDataURL('image/jpeg',0.85));require('fs').writeFileSync(dir+'/prev/t'+t+'.jpg',Buffer.from(d.split(',')[1],'base64'));console.log(t,Date.now()-t0,'ms')}
console.log('errors',errs);await b.close()})();

const {chromium}=require('playwright');const {spawn}=require('child_process');
(async()=>{const [dir,a,b,out]=[process.argv[2],+process.argv[3],+process.argv[4],process.argv[5]];
const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-c:v','libx264','-preset','slow','-crf','19','-pix_fmt','yuv420p','-tune','grain',out],{stdio:['pipe','inherit','inherit']});
const br=await chromium.launch({args:['--allow-file-access-from-files']});const p=await br.newPage({viewport:{width:1920,height:1080}});
await p.goto('file://'+dir+'/clip.html');await p.evaluate(()=>window.ready);
for(let f=a;f<b;f++){const d=await p.evaluate(f=>{render(f);return document.getElementById('c').toDataURL('image/jpeg',0.95)},f);
 const buf=Buffer.from(d.split(',')[1],'base64');if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));}
ff.stdin.end();await new Promise(r=>ff.on('close',r));await br.close();console.log('done',a,b)})();

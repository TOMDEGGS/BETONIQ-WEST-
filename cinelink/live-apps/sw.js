/* BETONIQ WEST shared offline layer. Caches the page and any audio the user plays. */
const VERSION='bw-offline-v1';
self.addEventListener('install',e=>{self.skipWaiting();
  e.waitUntil(caches.open(VERSION).then(c=>c.addAll([self.registration.scope+'offline-base']).catch(()=>{})));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url);
  const isAudio=/\.mp3(\?|$)/.test(u.pathname);
  const isPage=r.mode==='navigate'||(u.pathname.endsWith('.html'));
  if(isPage){
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp));return res;})
      .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||new Response('<h2>You are offline</h2><p>Open this tool once with data, then it works with no signal.</p>',{headers:{'Content-Type':'text/html'}}))));
  } else if(isAudio){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok&&res.status===200){const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp));}return res;})));
  }
});

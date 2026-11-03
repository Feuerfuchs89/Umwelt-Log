// Umwelt-Log – Service Worker (Offline-Hülle). Cache-Version bei jeder Änderung der Dateien erhöhen.
const V='umwelt-log-v12',SHELL=V+'-shell',TILES=V+'-tiles',TILE_MAX=600;
const LOCAL=['./','index.html','fauna.js','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png'];
const LIBS=['https://unpkg.com/leaflet@1.9.4/dist/leaflet.css','https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
 'https://unpkg.com/@geoman-io/leaflet-geoman-free@2.17.0/dist/leaflet-geoman.css','https://unpkg.com/@geoman-io/leaflet-geoman-free@2.17.0/dist/leaflet-geoman.min.js',
 'https://unpkg.com/proj4@2.11.0/dist/proj4.js'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(SHELL);
 await Promise.all(LOCAL.map(u=>c.add(u).catch(()=>{})));            // lokale Dateien
 await Promise.all(LIBS.map(u=>c.add(new Request(u,{mode:'cors'})).catch(()=>{})));   // Bibliotheken (unpkg, CORS)
 self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(!k.startsWith(V))await caches.delete(k);await self.clients.claim()})())});
async function trim(c,n){const k=await c.keys();for(let i=0;i<k.length-n;i++)await c.delete(k[i])}
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET')return;   // Overpass (POST) nie cachen
 if(/tile\.openstreetmap\.org|tiles\.openseamap\.org/.test(u.host)){   // Kacheln: Cache zuerst, sonst Netz, begrenzt
  e.respondWith((async()=>{const c=await caches.open(TILES),h=await c.match(r);if(h)return h;
   try{const n=await fetch(r);if(n.ok||n.type==='opaque'){c.put(r,n.clone());trim(c,TILE_MAX)}return n}catch(_){return Response.error()}})());return}
 if(u.origin===location.origin||u.host==='unpkg.com'||/fonts\.(googleapis|gstatic)\.com/.test(u.host)){   // Hülle: Cache, im Hintergrund erneuern
  e.respondWith((async()=>{const c=await caches.open(SHELL),h=await c.match(r,{ignoreSearch:true});
   const net=fetch(r).then(n=>{if(n.ok)c.put(r,n.clone());return n}).catch(()=>null);
   return h||(await net)||(r.mode==='navigate'?await c.match('index.html'):Response.error())})())}});

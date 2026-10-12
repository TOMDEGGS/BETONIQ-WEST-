/* BETONIQ WEST shared offline layer: service worker, install button, offline badge. */
(function(){
  var badge=document.createElement('div');
  badge.style.cssText='position:fixed;left:10px;bottom:10px;z-index:9999;font:600 12px -apple-system,Segoe UI,Roboto,Arial,sans-serif;padding:7px 11px;border-radius:999px;background:#0b2a4a;color:#fff;border:1px solid #22d3ee;box-shadow:0 2px 8px rgba(0,0,0,.35)';
  function setBadge(){
    var ready=!!localStorage.getItem('bw_offline_ready');
    if(!navigator.onLine){badge.textContent='Offline mode';badge.style.background='#7a4b00';}
    else if(ready){badge.textContent='Works offline';badge.style.background='#0b4a2a';}
    else{badge.textContent='Saving for offline...';}
  }
  document.addEventListener('DOMContentLoaded',function(){document.body.appendChild(badge);setBadge();});
  window.addEventListener('online',setBadge);window.addEventListener('offline',setBadge);
  if('serviceWorker' in navigator){
    window.addEventListener('load',function(){
      navigator.serviceWorker.register('sw.js').then(function(){
        return navigator.serviceWorker.ready;
      }).then(function(){localStorage.setItem('bw_offline_ready','1');setBadge();}).catch(function(){badge.textContent='Offline not supported here';});
    });
  } else { document.addEventListener('DOMContentLoaded',function(){badge.textContent='Offline not supported here';}); }
  var dp=null,btn=document.createElement('button');
  btn.textContent='Install on your phone';
  btn.style.cssText='position:fixed;right:10px;bottom:10px;z-index:9999;display:none;font:700 13px -apple-system,Segoe UI,Roboto,Arial,sans-serif;padding:9px 14px;border-radius:999px;border:0;background:#22d3ee;color:#06202a;box-shadow:0 2px 8px rgba(0,0,0,.35)';
  document.addEventListener('DOMContentLoaded',function(){document.body.appendChild(btn);});
  window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();dp=e;btn.style.display='block';});
  btn.addEventListener('click',function(){if(dp){dp.prompt();dp.userChoice.then(function(){btn.style.display='none';dp=null;});}});
  window.addEventListener('appinstalled',function(){btn.style.display='none';});
})();

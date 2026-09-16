(()=>{
const xhr=new XMLHttpRequest();
xhr.open('GET','/engines/public/baremux/index.js',false);
xhr.send();
if(xhr.status<200||xhr.status>=300)throw new Error('Failed to load BareMux');
eval(xhr.responseText);
const scramjetWisp='wss://wisp.mercurywork.shop/';
const bareMuxConnection=BareMux.BareMuxConnection;
const originalSetTransport=bareMuxConnection.prototype.setTransport;
bareMuxConnection.prototype.setTransport=function(path,options){
if(path==='/libcurl/index.mjs'&&Array.isArray(options))options=options.map(option=>({...option,websocket:scramjetWisp}));
return originalSetTransport.call(this,path,options);
};
const loadScript=src=>new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=()=>reject(new Error(`Failed to load ${src}`));document.head.appendChild(script)});
const init=async()=>{
if(window.__vanilliaScramjetController)return window.__vanilliaScramjetController;
await loadScript('/scram/scramjet.all.js');
const {ScramjetController}=$scramjetLoadController();
const controller=new ScramjetController({prefix:'/scram/service/',files:{wasm:'/scram/scramjet.wasm.wasm',all:'/scram/scramjet.all.js',sync:'/scram/scramjet.sync.js'}});
controller.init();
window.__vanilliaScramjetController=controller;
return controller;
};
const register=navigator.serviceWorker.register.bind(navigator.serviceWorker);
navigator.serviceWorker.register=async(scriptURL,options)=>{
const path=new URL(scriptURL,location.href).pathname;
if(path==='/sw.js')await init();
return register(scriptURL,options);
};
})();

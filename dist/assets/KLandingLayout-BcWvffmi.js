import{a as _,c as f,b as l,u as b,d as h,o as S,e as r,f as y,g as n,w as c,h as i,i as s,F as d,r as k,j as C,k as m,p as L,l as U,m as p}from"./index-IYjx4zwS.js";import{s as R,_ as w}from"./_plugin-vue_export-helper-CW8dRx5a.js";function x(e){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";return crypto.getRandomValues(new Uint8Array(e)).reduce((a,u)=>a+t[u%t.length],"")}function I(e){const o=new TextEncoder().encode(e);return window.crypto.subtle.digest("SHA-256",o)}function B(e){return btoa(String.fromCharCode(...new Uint8Array(e))).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}const g="b28f8580eecf4b3aa9bd0c1a59fde6c8",v=K();function K(){const e=new URL(window.location.href);return e.search="",e.hash="",e.toString()}async function T(){f.value=x(64);const e=await I(f.value),t=B(e),o=["user-read-private","user-read-email","playlist-read-private","playlist-modify-private","playlist-modify-public","user-read-currently-playing","user-read-playback-state"].join(" "),a=new URL("https://accounts.spotify.com/authorize"),u={client_id:g,code_challenge:t,code_challenge_method:"S256",redirect_uri:v,response_type:"code",scope:o};a.search=new URLSearchParams(u).toString(),window.location.href=a.toString()}async function A(){const e=new URL("https://accounts.spotify.com/api/token"),t={body:new URLSearchParams({client_id:g,code:_.value,code_verifier:f.value,grant_type:"authorization_code",redirect_uri:v}),headers:{"Content-Type":"application/x-www-form-urlencoded"},method:"POST"},a=await(await fetch(e,t)).json();l.value=a.access_token,b.value=(await R("/me")).id}const P={class:"wrapper"},V=h({__name:"KSpotifyConnect",setup(e){function t(){_.value="",l.value="",T()}return S(async()=>{if(l.value)return;const o=new URLSearchParams(window.location.search).get("code");o&&(_.value=o,await A(),alert("Connected to Spotify!"))}),(o,a)=>(r(),y("div",P,[n(s(d),{icon:"power",onClick:t},{default:c(()=>[i(" Connect to Spotify ")]),_:1})]))}}),z={class:"wrapper"},j=h({__name:"KLandingMenu",setup(e){return(t,o)=>{const a=k("RouterLink");return r(),y("div",z,[n(a,{to:"/builder"},{default:c(()=>[n(s(d),{icon:"construction"},{default:c(()=>[i(" Builder ")]),_:1})]),_:1}),n(a,{to:"/player"},{default:c(()=>[n(s(d),{icon:"library_music"},{default:c(()=>[i(" Player ")]),_:1})]),_:1}),n(s(d),{icon:"power",onClick:s(C)},{default:c(()=>[i(" Disconnect ")]),_:1},8,["onClick"])])}}}),M=w(j,[["__scopeId","data-v-f73ad591"]]),N=e=>(L("data-v-5cdb3f03"),e=e(),U(),e),$={class:"layout"},E=N(()=>p("div",{class:"header"},[p("div",{class:"title"}," Kaleidoscope "),p("div",{class:"subtitle"}," Cool Spotify playlist manager and player ")],-1)),F=h({__name:"KLandingLayout",setup(e){return(t,o)=>(r(),y("div",$,[E,s(l)?(r(),m(M,{key:0})):(r(),m(V,{key:1}))]))}}),H=w(F,[["__scopeId","data-v-5cdb3f03"]]);export{H as default};

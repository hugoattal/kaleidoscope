import{d as $,q as f,N as W,s as y,o as N,t as j,c as v,e as g,k as t,u as I,O as X,I as Y,P as L,Q as J,A as M,g as x,p as q,j as R,i as A,w as z,z as Z,x as ee,f as h,G as F,y as V,T as ae,F as te}from"./index-Bx8xlAef.js";import{_ as b,s as H}from"./_plugin-vue_export-helper-E8bPO7Fb.js";import{a as se,K as P}from"./KPercentageDisplay-J220gZC_.js";function ne(e,n={}){let o=!0;n.fps??(n.fps=60);function i(){o=!1}let r=0,d=0;async function a(s){r||(r=s);const c=s-r;r=s,o&&(d+=c,d>1e3/n.fps&&(await e(d),d=0),requestAnimationFrame(a))}return requestAnimationFrame(a),i}const oe=["height","width"],re=1/2e4,ce=1e3,le=5,ie=$({__name:"KBackground",props:{speed:{default:1}},setup(e){const n=e,o=f(),i=f(),r=W(i);let d;const a=y(()=>Math.min(ce,Math.floor(r.width.value*r.height.value*re)));N(()=>{d=ne(s)}),j(()=>{d()});function s(u){G(),Q(u),U()}const c=[];function S(){return-Math.log(1-Math.random()*.99)*20+20}function D(){return-Math.log(1-Math.random()*.99)*.1+.1}function G(){for(;c.length<a.value;)c.push({opacity:D(),radius:S(),x:Math.random(),y:Math.random()*2-.5});for(;c.length>a.value;)c.pop()}function Q(u){const m=le*n.speed*u*.06/r.height.value;for(const p of c)p.y-=m/p.radius,p.y<-.5&&(p.y=1.5,p.x=Math.random(),p.radius=S(),p.opacity=D())}function U(){var E;const u=(E=o.value)==null?void 0:E.getContext("2d");if(!u)return;const m=o.value.width,p=o.value.height;u.clearRect(0,0,m,p);for(const _ of c){const k=u.createRadialGradient(_.x*m,_.y*p,0,_.x*m,_.y*p,_.radius);k.addColorStop(0,`rgba(242, 146, 0, ${_.opacity*.6})`),k.addColorStop(.8,`rgba(242, 146, 0, ${_.opacity*.8})`),k.addColorStop(.9,`rgba(242, 146, 0, ${_.opacity})`),k.addColorStop(1,"rgba(242, 146, 0, 0)"),u.fillStyle="#f2920044",u.fillStyle=k,u.beginPath(),u.arc(_.x*m,_.y*p,_.radius,0,Math.PI*2),u.fill()}}return(u,m)=>(v(),g("div",{ref_key:"wrapper",ref:i,class:"canvas-wrapper"},[t("canvas",{ref_key:"canvas",ref:o,height:I(r).height.value,width:I(r).width.value},null,8,oe)],512))}}),ue=b(ie,[["__scopeId","data-v-35cebc7a"]]),de=""+new URL("rockit-D1Fp-gcz.svg",import.meta.url).href,B=f([]),l=f(),w=f([]),K=f(0),O=f(0);async function T(){var n,o,i;const e=await H("/me/player/queue");e.currently_playing&&((!l.value||l.value.id!==e.currently_playing.id)&&(l.value?B.value.push(l.value):B.value.length||(B.value=[e.currently_playing]),e.currently_playing.id===((n=w.value[0])==null?void 0:n.id)&&((o=e.queue[0])==null?void 0:o.id)===((i=w.value[1])==null?void 0:i.id)?l.value=w.value.shift():(l.value=e.currently_playing,w.value=e.queue),await se([l.value,...w.value])),await pe(),O.value++)}async function pe(){const e=await H("/me/player");K.value=e.progress_ms}const _e=e=>(q("data-v-8f0814e7"),e=e(),R(),e),ve={class:"playbar"},fe=_e(()=>t("div",{class:"cursor"},null,-1)),he={class:"remaining"},me=$({__name:"KPlaybar",setup(e){X(s=>({"198d6aef":d.value}));const n=f(0),o=f(0);Y(()=>[K.value,l.value,O.value],()=>{n.value=K.value,o.value=Date.now()},{immediate:!0});const i=y(()=>{const s=L({interval:1e3});return l.value.duration_ms-(n.value+(s.value-o.value))}),r=y(()=>{const s=Math.max(i.value,0),c=Math.floor(s/6e4),S=Math.floor(s%6e4/1e3);return`${c}:${S.toString().padStart(2,"0")}`}),d=y(()=>{const s=L({interval:1e3});return`${(n.value+(s.value-o.value))/l.value.duration_ms*100}%`});J(()=>i.value<=0,async()=>{const s=l.value.id;for(let c=0;c<5;c++)if(await a(1e3),await T(),l.value.id!==s)return});async function a(s=1e3){return new Promise(c=>setTimeout(c,s))}return(s,c)=>(v(),g("div",ve,[fe,t("div",he,[t("span",null,M(r.value),1),x(" restant ")])]))}}),ye=b(me,[["__scopeId","data-v-8f0814e7"]]),C=e=>(q("data-v-497032ed"),e=e(),R(),e),ge={class:"cover"},we=["src"],xe={class:"content"},ke={class:"title"},Me={class:"name"},$e={class:"artist"},be={key:0,class:"features"},Se={class:"feature-wrapper"},Pe={class:"feature-wrapper"},Be=C(()=>t("span",null,"Popularité",-1)),Ie={class:"feature-wrapper"},Ke=C(()=>t("span",null,"Danceabilité",-1)),Te={class:"feature-wrapper"},Ce=C(()=>t("span",null,"Énergie",-1)),De={class:"description"},Ee=$({__name:"KTracklist",setup(e){const n=y(()=>B.value.at(-1)),o=y(()=>w.value.slice(0,3)),i=y(()=>{const r=[];n.value&&r.push({type:"last",data:n.value,description:"Dernière"}),l.value&&r.push({type:"current",data:l.value,description:"En cours"});for(const[d,a]of o.value.entries())r.push({type:"next",data:a,description:`Prochaine ${d+1}`});return r});return(r,d)=>(v(),A(ae,{class:"tracklist",name:"list",tag:"div"},{default:z(()=>[(v(!0),g(V,null,Z(i.value,a=>{var s;return v(),g("div",{key:a.data.id,class:ee(["track",a.type])},[t("div",ge,[t("img",{alt:"Album cover",src:(s=a.data.album.images[0])==null?void 0:s.url},null,8,we)]),t("div",xe,[t("div",ke,[t("span",Me,M(a.data.name),1),x(" ("),t("span",$e,M(a.data.artists[0].name),1),x(") ")]),a.data.features?(v(),g("div",be,[t("div",Se,[t("span",null,[x("Tempo ("),t("strong",null,M(Math.round(a.data.features.tempo)),1),x(" BPM)")]),h(P,{class:"feature","color-max":"#fcfa01","color-min":"#550004",max:160,min:80,value:a.data.features.tempo},null,8,["value"])]),t("div",Pe,[Be,h(P,{class:"feature","color-max":"#fcfa01","color-min":"#550004",value:a.data.popularity/100},null,8,["value"])]),t("div",Ie,[Ke,h(P,{class:"feature","color-max":"#fcfa01","color-min":"#550004",value:a.data.features.danceability},null,8,["value"])]),t("div",Te,[Ce,h(P,{class:"feature","color-max":"#fcfa01","color-min":"#550004",value:a.data.features.energy},null,8,["value"])])])):F("",!0),a.type==="current"?(v(),A(ye,{key:1})):F("",!0)]),t("div",De,M(a.description),1)],2)}),128))]),_:1}))}}),Le=b(Ee,[["__scopeId","data-v-497032ed"]]),Ae={class:"menu"},Fe=$({__name:"KPlayerMenu",setup(e){async function n(){await T()}return(o,i)=>(v(),g("div",Ae,[h(I(te),{icon:"refresh",onClick:n},{default:z(()=>[x(" Manual trigger ")]),_:1})]))}}),Ne=b(Fe,[["__scopeId","data-v-9014968d"]]),qe={class:"content"},Re=["src"],ze=$({__name:"KPlayerLayout",setup(e){return N(async()=>{await T()}),(n,o)=>(v(),g(V,null,[h(ue,{class:"bokeh"}),h(Ne),t("div",qe,[t("img",{alt:"RockIt Logo",class:"logo",src:I(de)},null,8,Re),h(Le)])],64))}}),Ge=b(ze,[["__scopeId","data-v-2dd750ed"]]);export{Ge as default};

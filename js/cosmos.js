// Real-time background universe: procedural stars, nebula, lit planet with atmosphere and two moons.
// One full-screen fragment shader (raw WebGL, no dependencies). Falls back to a CSS gradient.
import { reduced } from "./reveal.js";

const SECTIONS = ["top", "about", "universe", "projects", "skills", "education", "contact"];
// Camera keyframes per section: [x, y, radius, nebula hue, planet visibility, brightness, hero scrim]
const keys = (wide) => [
  wide ? [0.2, -0.3, 0.62, 0.3, 1, 1, 1] : [0, -0.62, 0.42, 0.3, 1, 1, 1],
  [0.3, 0.12, 0.26, 0.2, 0.55, 0.7, 0],
  [-0.42, 0.28, 0.14, 0.45, 0.35, 0.6, 0],
  [0.42, 0.22, 0.18, 0.6, 0.45, 0.62, 0],
  [-0.4, -0.12, 0.22, 0.15, 0.5, 0.62, 0],
  [0.38, -0.2, 0.24, 0.4, 0.5, 0.62, 0],
  [0, -0.78, 0.72, 0.7, 0.7, 0.7, 0]
];

const mobile = matchMedia("(max-width: 820px)").matches || matchMedia("(pointer: coarse)").matches;
const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes,uM; uniform vec3 uCam,uDim; uniform float uT,uS,uIn,uHue;
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float n2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x),mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x),f.y);}
float h31(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float n3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
 return mix(mix(mix(h31(i),h31(i+vec3(1.,0.,0.)),f.x),mix(h31(i+vec3(0.,1.,0.)),h31(i+vec3(1.,1.,0.)),f.x),f.y),
            mix(mix(h31(i+vec3(0.,0.,1.)),h31(i+vec3(1.,0.,1.)),f.x),mix(h31(i+vec3(0.,1.,1.)),h31(i+vec3(1.,1.,1.)),f.x),f.y),f.z);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<OCT;i++){s+=a*n2(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return s;}
float fbm3(vec3 p){float a=.5,s=0.;for(int i=0;i<OCT;i++){s+=a*n3(p);p=p*2.02+vec3(3.1,1.7,5.3);a*=.5;}return s;}
float star(vec2 p,float dens,float sz){
 vec2 g=floor(p),f=fract(p)-.5; if(h21(g)<dens) return 0.;
 vec2 o=(vec2(h21(g+7.1),h21(g+3.7))-.5)*.7; float b=h21(g+11.3);
 return smoothstep(sz,0.,length(f-o))*(.35+.65*b)*(.75+.25*sin(uT*(1.+b*3.)+b*40.));}
void main(){
 float asp=uRes.x/uRes.y; vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y; vec2 m=uM; float s=uS;
 float I=clamp(uIn,0.,1.); float ease=1.-pow(1.-I,3.);
 vec3 col=vec3(.0196,.0235,.0392);
 vec2 np=uv*1.3+vec2(s*1.5,-s*.6)+m*.04+vec2(uT*.003,0.);
 float neb=smoothstep(.38,.9,fbm(np+fbm(np*1.4)*1.6));
 col+=mix(vec3(.36,.24,.85),vec3(.22,.8,1.),clamp(uHue+uv.x*.25,0.,1.))*neb*.15*smoothstep(.15,.9,I);
 float neb2=smoothstep(.45,.95,fbm(uv*2.1-m*.09+vec2(7.,uT*.002)));
 col+=vec3(.12,.2,.45)*neb2*.07*smoothstep(.15,.9,I);
 float st=star(uv*38.+m*.5+vec2(0.,s*6.),.90,.06)+star(uv*70.+m*1.1+vec2(3.1,s*11.),.93,.05)*.85+star(uv*16.+m*3.2+vec2(5.,s*30.),.975,.2)*.45;
 #if OCT>3
 st+=star(uv*125.+m*2.+vec2(7.7,s*20.),.95,.045)*.7;
 #endif
 col+=vec3(.85,.9,1.)*st*smoothstep(0.,.6,I);
 // pointer-reactive dust: a soft lens pushes motes away from the cursor
 vec2 dd=uv-vec2(m.x*asp*.5,m.y*.5); float fall=exp(-dot(dd,dd)*16.); vec2 q=uv+dd*fall*.2; float du=0.;
 for(int j=0;j<2;j++){float fj=float(j);vec2 pp=q*(10.+fj*8.)+vec2(uT*.015*(1.+fj),-uT*.01)+fj*13.;vec2 g=floor(pp),f=fract(pp)-.5;
  if(h21(g+fj*5.)>.8){vec2 o=(vec2(h21(g+1.3),h21(g+9.1))-.5)*.5;du+=smoothstep(.2,0.,length(f-o))*(.5+.5*h21(g+4.4));}}
 col+=vec3(.45,.8,1.)*du*(.05+fall*.1)*smoothstep(.3,1.,I);
 float R=uCam.z; vec2 c=vec2(uCam.x*asp,uCam.y);
 c.y-=(1.-ease)*.7; c+=m*vec2(.015,.01);
 float pv=smoothstep(.2,.9,I)*uDim.x;
 vec3 L=normalize(vec3(-.55+(uHue-.3)*.7,.45,.7));
 vec2 p=uv-c; float d=length(p)/R;
 // orbit lines
 for(int j=0;j<2;j++){float fj=float(j);float e=length(p/(R*vec2(1.45+fj*.5,.45+fj*.12)))-1.;col+=vec3(.5,.8,1.)*smoothstep(.012,0.,abs(e))*.07*pv;}
 // moons (drawn before the planet so the planet can cover them)
 for(int j=0;j<2;j++){float fj=float(j);float a=uT*(.08+fj*.05)+fj*2.4;
  vec2 mp=c+vec2(cos(a)*(1.45+fj*.5),sin(a)*(.45+fj*.12))*R; float mr=R*(.07+fj*.03); float md=length(uv-mp)/mr;
  if(md<1. && !(sin(a)<0. && d<1.)){vec3 n=vec3((uv-mp)/mr,sqrt(1.-md*md));
   vec3 mc=mix(vec3(.55,.58,.66),vec3(.6,.5,.75),fj)*(.05+max(dot(n,L),0.)*1.05);
   col=mix(col,mc,pv*(1.-smoothstep(.96,1.,md)));}}
 // planet
 float ed=1.-smoothstep(.994,1.,d);
 if(d<1.){
  vec3 n=vec3(p/R,sqrt(max(1.-d*d,0.))); float a=uT*.02+s*1.2;
  vec3 rn=vec3(n.x*cos(a)+n.z*sin(a),n.y,-n.x*sin(a)+n.z*cos(a));
  float t=fbm3(rn*2.4), det=fbm3(rn*9.); float land=smoothstep(.48,.56,t);
  vec3 alb=mix(vec3(.02,.05,.11),mix(vec3(.10,.12,.15),vec3(.24,.27,.33),det),land);
  alb=mix(alb,vec3(.7,.78,.9),smoothstep(.78,.93,abs(rn.y))*.8);
  float ndl=dot(n,L), term=smoothstep(-.05,.5,ndl);
  vec3 sc=alb*(.03+term*1.1);
  float cl=smoothstep(.55,.8,fbm3(rn*3.5+vec3(uT*.01,0.,0.)));
  sc=mix(sc,vec3(.75,.85,1.)*term*.9,cl*.35);
  sc+=vec3(.6,.85,1.)*pow(max(dot(reflect(-L,n),vec3(0.,0.,1.)),0.),40.)*(1.-land)*.5*term;
  sc+=vec3(.25,.7,1.)*pow(1.-n.z,3.)*(.15+.9*term);
  col=mix(col,sc,pv*ed);}
 float lit=smoothstep(-.3,.6,dot(normalize(p+1e-5),L.xy));
 col+=vec3(.2,.55,.95)*exp(-(max(d,1.)-1.)*9.)*step(.994,d)*lit*.55*pv;
 col*=mix(.6,1.,smoothstep(1.4,.3,length(uv*vec2(.8,1.))));
 col*=mix(1.,mix(.5,1.,smoothstep(-.15*asp,.45*asp,uv.x)),uDim.z);
 col*=uDim.y;
 col+=(h21(gl_FragCoord.xy+fract(uT))-.5)*.012;
 gl_FragColor=vec4(col,1.);
}`;

export function initCosmos() {
  const root = document.documentElement, cv = document.getElementById("cosmos");
  const fail = (m) => { console.warn("Cosmos fallback:", m); root.classList.add("no-gl"); };
  const gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
  if (!gl) return fail("WebGL unavailable");
  const sh = (type, src) => {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (gl.getShaderParameter(s, gl.COMPILE_STATUS)) return s;
    console.error(gl.getShaderInfoLog(s)); return null;
  };
  const vs = sh(gl.VERTEX_SHADER, "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}");
  const fs = sh(gl.FRAGMENT_SHADER, `#define OCT ${mobile ? 3 : 5}\n${FRAG}`);
  if (!vs || !fs) return fail("shader compile failed");
  const pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return fail(gl.getProgramInfoLog(pr));
  gl.useProgram(pr);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, "a"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n) => gl.getUniformLocation(pr, n);
  const uRes = U("uRes"), uT = U("uT"), uS = U("uS"), uIn = U("uIn"), uM = U("uM"), uCam = U("uCam"), uDim = U("uDim"), uHue = U("uHue");

  const ac = new AbortController(), opt = { signal: ac.signal };
  let scale = mobile ? 0.55 : Math.min(devicePixelRatio || 1, 1.25);
  let tx = 0, ty = 0, mx = 0, my = 0, sp = 0, slow = 0, last = 0, raf = 0, tops = [];
  let cur = keys(innerWidth > innerHeight)[0].slice();
  const t0 = performance.now();
  const size = () => { cv.width = Math.round(innerWidth * scale); cv.height = Math.round(innerHeight * scale); gl.viewport(0, 0, cv.width, cv.height); };
  const measure = () => { tops = SECTIONS.map((id) => { const e = document.getElementById(id); return e ? e.getBoundingClientRect().top + scrollY : 0; }); tops[0] = 0; };
  const progress = () => { const h = root.scrollHeight - innerHeight; return h > 0 ? Math.min(1, scrollY / h) : 0; };
  // Camera target for the current scroll position: hold on a section, blend into the next in its second half.
  const target = () => {
    const K = keys(innerWidth > innerHeight), mid = scrollY + innerHeight * 0.45; let i = 0;
    while (i < tops.length - 2 && mid >= tops[i + 1]) i++;
    const span = (tops[i + 1] - tops[i]) || 1;
    let t = Math.min(1, Math.max(0, (mid - tops[i] - span * 0.5) / (span * 0.5))); t = t * t * (3 - 2 * t);
    return K[i].map((v, j) => v + (K[i + 1][j] - v) * t);
  };
  const draw = (now) => {
    gl.uniform2f(uRes, cv.width, cv.height); gl.uniform1f(uT, reduced ? 12 : now / 1000);
    gl.uniform1f(uS, reduced ? 0 : sp); gl.uniform1f(uIn, reduced ? 1 : Math.min(1, (now - t0) / 1800)); gl.uniform2f(uM, mx, my);
    gl.uniform3f(uCam, cur[0], cur[1], cur[2]); gl.uniform1f(uHue, cur[3]); gl.uniform3f(uDim, cur[4], cur[5], cur[6]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const loop = (now) => {
    raf = requestAnimationFrame(loop);
    const dt = now - last; if (mobile && dt < 33) return; last = now;
    mx += (tx - mx) * 0.05; my += (ty - my) * 0.05; sp += (progress() - sp) * 0.06;
    const tg = target(); cur = cur.map((v, j) => v + (tg[j] - v) * 0.05);
    draw(now);
    if (now - t0 > 3000) { slow = dt > 34 ? slow + 1 : Math.max(0, slow - 1); if (slow > 45 && scale > 0.5) { scale = Math.max(0.5, scale - 0.15); slow = 0; size(); } }
  };
  const dispose = () => {
    cancelAnimationFrame(raf); ac.abort(); ro.disconnect();
    gl.deleteBuffer(buf); gl.deleteProgram(pr); gl.deleteShader(vs); gl.deleteShader(fs); gl.getExtension("WEBGL_lose_context")?.loseContext();
  };
  const ro = new ResizeObserver(measure); ro.observe(document.body);
  size(); measure(); draw(performance.now()); root.classList.add("gl-ready");
  addEventListener("resize", () => { size(); if (reduced) { cur = keys(innerWidth > innerHeight)[0].slice(); draw(performance.now()); } }, opt);
  cv.addEventListener("webglcontextlost", (e) => { e.preventDefault(); dispose(); fail("context lost"); }, opt);
  addEventListener("pagehide", dispose, { once: true });
  addEventListener("pageshow", (e) => { if (e.persisted) location.reload(); }, opt);
  if (reduced) return;
  if (matchMedia("(pointer: fine)").matches) addEventListener("pointermove", (e) => { tx = (e.clientX / innerWidth) * 2 - 1; ty = -((e.clientY / innerHeight) * 2 - 1); }, { passive: true, signal: ac.signal });
  document.addEventListener("visibilitychange", () => { cancelAnimationFrame(raf); if (!document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); } }, opt);
  raf = requestAnimationFrame(loop);
}

/* All-title hover reveal + decoding; frame-rate-independent sand typography. */
(() => {
  'use strict';
  const enabled = () => window.portfolioMotion !== false;
  const glyphs = '01<>/[]_+-';
  const active = new Map();
  const played = new WeakMap();
  function finish(el) {
    const state = active.get(el); if (!state) return;
    cancelAnimationFrame(state.raf);
    state.runs.forEach(run => { run.visual.textContent = run.text; });
    el.classList.remove('decoding'); active.delete(el);
  }
  function prepare(el) {
    if (el.dataset.decodeReady) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: node => node.parentElement.closest('.cursor,.decode-run,.sr-only') || !node.textContent.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    const texts = []; while (walker.nextNode()) texts.push(walker.currentNode);
    texts.forEach(node => {
      const wrapper = document.createElement('span'); wrapper.className = 'decode-run'; wrapper.dataset.text = node.textContent;
      const base = document.createElement('span'); base.className = 'decode-base'; base.textContent = node.textContent;
      const visual = document.createElement('span'); visual.className = 'decode-visual'; visual.setAttribute('aria-hidden','true'); visual.textContent = node.textContent;
      wrapper.append(base, visual); node.replaceWith(wrapper);
    });
    el.classList.add('decode-title'); el.dataset.decodeReady = 'true';
  }
  function decode(el) {
    if (!enabled() || active.has(el)) return;
    prepare(el);
    const runs = [...el.querySelectorAll('.decode-run')].map(run=>({text:run.dataset.text,visual:run.querySelector('.decode-visual')}));
    if (!runs.length) return;
    const signature = runs.map(run => run.text).join('');
    let seen = played.get(el);
    if (seen?.has(signature)) return;
    if (!seen) { seen = new Set(); played.set(el, seen); }
    seen.add(signature);
    const state = { runs, raf:0, start:performance.now(), last:0 }; active.set(el,state);el.classList.add('decoding');
    function tick(now) {
      if (!enabled() || now-state.start>=650) { finish(el);return; }
      if(now-state.last>40){
        const progress=(now-state.start)/650;
        runs.forEach(run=>{run.visual.textContent=[...run.text].map((char,i)=>/\s/.test(char)||i<progress*run.text.length?char:glyphs[Math.floor(Math.random()*glyphs.length)]).join('');});state.last=now;
      }
      state.raf=requestAnimationFrame(tick);
    }
    state.raf=requestAnimationFrame(tick);
  }
  const selector='h1,h2,h3,.eyebrow,.stage b,.lab-label,.nav nav a';
  const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){decode(entry.target);observer.unobserve(entry.target);}}),{threshold:.5});
  function attach(el){prepare(el);observer.observe(el);el.addEventListener('pointerenter',()=>decode(el));el.addEventListener('focusin',()=>decode(el));}
  document.querySelectorAll(selector).forEach(attach);
  document.querySelectorAll('.project-card,.featured-project,.creator-card,.skill-card,.timeline article').forEach(card=>{
    const run=()=>card.querySelectorAll('h2,h3,.eyebrow').forEach(decode);
    card.addEventListener('pointerenter',run);card.addEventListener('focusin',run);
  });
  // Dialog headings are replaced by main.js; prepare their fresh text after opening.
  const dialog=document.getElementById('project-dialog');
  new MutationObserver(()=>{if(dialog.open)dialog.querySelectorAll('h2,h3,.eyebrow').forEach(el=>{finish(el);delete el.dataset.decodeReady;prepare(el);decode(el);});}).observe(dialog,{attributes:true,attributeFilter:['open']});
  window.addEventListener('motionchange',e=>{if(!e.detail)[...active.keys()].forEach(finish);});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)[...active.keys()].forEach(finish);});

  const stage=document.getElementById('sand-stage'),canvas=document.getElementById('sand-canvas');
  const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
  stage.classList.add('sand-ready');
  const words=['DEVOPS','CLOUD','AUTOMATE','CHIRAG'];
  const stateLabel=document.getElementById('sand-state');
  const counter=document.querySelector('.sand-counter');
  const pointerEl=document.querySelector('.sand-pointer');
  let word='DEVOPS',width=0,height=0,points=[],targets=[],dust=[],visible=true,raf=0,last=0,time=0,hold=0,transition=null;
  let pointer={active:false,x:0,y:0};
  const smooth=n=>n*n*(3-2*n);
  function sample(){
    const buffer=document.createElement('canvas');buffer.width=Math.round(width);buffer.height=Math.round(height);
    const pen=buffer.getContext('2d');let size=Math.min(height*.42,width*.20);
    pen.font=`500 ${size}px sans-serif`;size*=Math.min(1,width*.87/pen.measureText(word).width);
    pen.font=`500 ${size}px sans-serif`;pen.textAlign='center';pen.textBaseline='middle';pen.fillStyle='#e9ecee';pen.fillText(word,width/2,height*.49);
    const pixels=pen.getImageData(0,0,buffer.width,buffer.height).data;targets=[];
    for(let y=0;y<buffer.height;y+=2)for(let x=0;x<buffer.width;x+=2)if(pixels[(y*buffer.width+x)*4+3]>100)targets.push({x,y});
    if(!targets.length)targets=[{x:width/2,y:height/2}];
  }
  function setWord(next){
    word=next;sample();canvas.setAttribute('aria-label',`Particles forming ${word}. Move your pointer to scatter the grains.`);
    counter.textContent=`0${words.indexOf(word)+1} / 04`;
    document.querySelectorAll('[data-sand-word]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.sandWord===word)));
  }
  function change(next){
    hold=0;
    if(!enabled()){transition=null;setWord(next);stateLabel.textContent=word+' / STILL';paint(0,true);return;}
    // Rapid taps retarget the current dissolve without spawning timers or loops.
    if(transition&&!transition.changed){transition.next=next;return;}
    transition={elapsed:0,next,changed:false};stateLabel.textContent='DISSOLVING / REFORMING';
  }
  function paint(dt,still=false){
    if(!width||!height||!targets.length)return;
    ctx.clearRect(0,0,width,height);
    let release=0;
    if(transition&&!still){
      transition.elapsed+=dt;
      if(transition.elapsed<.8)release=smooth(transition.elapsed/.8);
      else{
        if(!transition.changed){setWord(transition.next);transition.changed=true;}
        release=1-smooth(Math.min(1,(transition.elapsed-.8)/1.25));
        if(transition.elapsed>=2.05){transition=null;stateLabel.textContent=word+' / FORMED';}
      }
    }
    const signal=window.portfolioScroll||{energy:0,velocity:0};
    const scrollRelease=still?0:signal.energy*.62;
    release=Math.max(release,scrollRelease);
    const scrollDrift=still?0:signal.velocity;
    const response=1-Math.exp(-dt*10);
    ctx.fillStyle='#e9ecee';
    for(let i=0;i<dust.length;i++){
      const d=dust[i];ctx.globalAlpha=.08+(i%4)*.035;
      const x=(d.x+time*(2+d.speed))%width,y=(d.y+Math.sin(time*.3+d.seed)*8+height)%height;
      ctx.fillRect(x,y,i%9===0?1.8:1,i%9===0?1.8:1);
    }
    for(let i=0;i<points.length;i++){
      const p=points[i],home=targets[Math.floor(((i*.61803398875)%1)*targets.length)];
      const grainX=p.sx*width+Math.sin(time*.7+p.seed)*18,grainY=p.sy*height+Math.sin(time*.9+p.seed)*12;
      let tx=home.x*(1-release)+grainX*release+scrollDrift*Math.sin(p.seed)*20,ty=home.y*(1-release)+grainY*release-scrollDrift*28;
      if(!still){tx+=Math.sin(time*1.5+p.seed)*.5;ty+=Math.cos(time*1.2+p.seed)*.5;}
      if(pointer.active&&!still){const dx=tx-pointer.x,dy=ty-pointer.y,d=Math.hypot(dx,dy);if(d<72&&d>.1){const force=Math.pow(1-d/72,2)*90;tx+=dx/d*force;ty+=dy/d*force;}}
      if(still){p.x=tx;p.y=ty;}else{p.x+=(tx-p.x)*response;p.y+=(ty-p.y)*response;}
      ctx.globalAlpha=(.4+(i%6)*.1)*(1-release*.3);
      const size=i%6===0?1.65:1.1;ctx.fillRect(p.x,p.y,size,size);
    }
    ctx.globalAlpha=1;
  }
  function frame(now){
    raf=0;if(!visible||document.hidden||!enabled())return;
    const dt=last?Math.min((now-last)/1000,.04):1/60;last=now;time+=dt;
    if(!transition&&!pointer.active&&(window.portfolioScroll?.energy||0)<.05){hold+=dt;if(hold>5.8)change(words[(words.indexOf(word)+1)%words.length]);}
    paint(dt);raf=requestAnimationFrame(frame);
  }
  function refresh(){
    cancelAnimationFrame(raf);raf=0;last=0;
    if(!enabled()){if(transition)setWord(transition.next);transition=null;pointer.active=false;stage.classList.remove('pointer-active');stateLabel.textContent=word+' / STILL';paint(0,true);}
    if(enabled()&&visible&&!document.hidden){stateLabel.textContent=word+' / FORMED';raf=requestAnimationFrame(frame);}
  }
  function resize(){
    const box=stage.getBoundingClientRect();width=box.width;height=box.height;
    const ratio=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);sample();
    points=Array.from({length:width<400?1700:3300},(_,i)=>({x:Math.random()*width,y:Math.random()*height,sx:Math.random(),sy:Math.random(),seed:i*.79}));
    dust=Array.from({length:180},(_,i)=>({x:Math.random()*width,y:Math.random()*height,speed:i%7,seed:i}));paint(0,true);
  }
  document.querySelectorAll('[data-sand-word]').forEach(b=>b.addEventListener('click',()=>change(b.dataset.sandWord)));
  document.getElementById('sand-dissolve').addEventListener('click',()=>change(word));
  stage.addEventListener('pointermove',e=>{if(!enabled())return;const r=stage.getBoundingClientRect();pointer={active:true,x:e.clientX-r.left,y:e.clientY-r.top};pointerEl.style.transform=`translate(${pointer.x}px,${pointer.y}px)`;stage.classList.add('pointer-active');});
  const leave=()=>{pointer.active=false;stage.classList.remove('pointer-active');};stage.addEventListener('pointerleave',leave);stage.addEventListener('pointercancel',leave);stage.addEventListener('pointerup',e=>{if(e.pointerType==='touch')leave();});
  const sizeObserver=new ResizeObserver(resize);sizeObserver.observe(stage);
  const visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;refresh();});visibility.observe(stage);
  window.addEventListener('motionchange',refresh);document.addEventListener('visibilitychange',refresh);
  window.addEventListener('pagehide',e=>{cancelAnimationFrame(raf);[...active.keys()].forEach(finish);if(!e.persisted){observer.disconnect();sizeObserver.disconnect();visibility.disconnect();}});
  window.addEventListener('pageshow',e=>{if(e.persisted)refresh();});resize();refresh();
})();

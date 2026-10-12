/* Cloud delivery landscape: original Three.js line art and deployment signals. */
(() => {
  'use strict';
  const host=document.getElementById('cloud-background');
  if(!host||!window.THREE)return;
  const T=window.THREE;let renderer;
  try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch(_){return;}
  host.appendChild(renderer.domElement);
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(45,innerWidth/innerHeight,.1,200);
  camera.position.set(0,0,65);
  const world=new T.Group();scene.add(world);
  const resources=[],routes=[],signals=[];
  function line(points,color,opacity){
    const geometry=new T.BufferGeometry().setFromPoints(points.map(p=>new T.Vector3(...p)));
    const material=new T.LineBasicMaterial({color,transparent:true,opacity,depthWrite:false});
    resources.push(geometry,material);const object=new T.Line(geometry,material);world.add(object);return object;
  }
  // Three overlapping cloud silhouettes anchor the cloud infrastructure scene.
  function cloud(cx,cy,scale){
    const shape=new T.Shape();shape.moveTo(-7,-2);shape.bezierCurveTo(-12,-2,-12,4,-7,4);shape.bezierCurveTo(-7,10,3,11,5,5);shape.bezierCurveTo(12,7,15,-2,8,-2);shape.lineTo(-7,-2);
    line(shape.getPoints(90).map(p=>[cx+p.x*scale,cy+p.y*scale,-3]),0x31cfff,.25);
  }
  cloud(13,7,1);cloud(-25,15,.48);cloud(28,-17,.55);
  const nodes=[[-26,-10,0],[-12,-10,0],[3,-10,0],[19,-10,0],[32,-1,0]];
  nodes.forEach(([x,y,z],i)=>{
    line([[x-2,y-2,z],[x+2,y-2,z],[x+2,y+2,z],[x-2,y+2,z],[x-2,y-2,z]],0x168cff,.22);
    for(let row=0;row<3;row++)line([[x-1.1,y-.8+row*.8,z],[x+1.1,y-.8+row*.8,z]],0x5adeff,.18);
    if(i<nodes.length-1){const next=nodes[i+1];const points=[[x+2,y,z],[next[0]-4,y,z],[next[0]-4,next[1],z],[next[0]-2,next[1],z]];line(points,0x168cff,.22);routes.push(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),false,'centripetal'));}
  });
  const uplink=[[3,-8,0],[3,1,-1],[13,1,-3],[13,5,-3]];line(uplink,0x31cfff,.24);routes.push(new T.CatmullRomCurve3(uplink.map(p=>new T.Vector3(...p))));
  // An abstract Azure-inspired triangular infrastructure marker, not a logo asset.
  line([[9,7,-2],[13,15,-2],[17,7,-2],[12,7,-2],[15,9,-2]],0x52d9ff,.4);
  for(let i=0;i<15;i++){
    const geometry=new T.SphereGeometry(.09,6,6),material=new T.MeshBasicMaterial({color:i%2?0x31cfff:0x167bff,transparent:true,opacity:.65});resources.push(geometry,material);
    const dot=new T.Mesh(geometry,material);world.add(dot);signals.push({dot,route:routes[i%routes.length],phase:(i*.37)%1});
  }
  // Curved blue light bands echo the supplied reference without obscuring content.
  for(let k=0;k<7;k++){
    const points=[];for(let i=0;i<=100;i++){const x=-60+i*1.2;points.push([x,-20+Math.pow((x+10)/25,2)+k*.16,-10-k*.3]);}
    line(points,k%2?0x124bff:0x00bfff,.07+k*.008);
  }
  let raf=0,last=0,time=0,lost=false;
  function draw(){
    const s=window.portfolioScroll||{offset:0,energy:0,velocity:0};
    const energy=window.portfolioMotion===false?0:s.energy;
    world.rotation.y=Math.sin(s.offset*.32)*.22;
    world.rotation.z=Math.sin(s.offset*.2)*.025;
    world.position.y=Math.sin(s.offset*.55)*2;
    world.position.x=Math.sin(s.offset*.3)*1.5;
    signals.forEach(({dot,route,phase})=>dot.position.copy(route.getPointAt((time*.09+phase)%1)));
    world.scale.setScalar((innerWidth<760?1.1:1)*(1+energy*.025));
    renderer.render(scene,camera);
  }
  function frame(now){raf=0;if(document.hidden||window.portfolioMotion===false||lost)return;const dt=last?Math.min((now-last)/1000,.05):1/60;last=now;time+=dt*(1+(window.portfolioScroll?.energy||0)*3);draw();raf=requestAnimationFrame(frame);}
  function refresh(){cancelAnimationFrame(raf);raf=0;last=0;if(lost)return;draw();if(window.portfolioMotion!==false&&!document.hidden)raf=requestAnimationFrame(frame);}
  function resize(){renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.position.z=innerWidth<760?85:65;camera.updateProjectionMatrix();if(!lost)draw();}
  addEventListener('resize',resize);addEventListener('motionchange',refresh);document.addEventListener('visibilitychange',refresh);
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;cancelAnimationFrame(raf);});
  renderer.domElement.addEventListener('webglcontextrestored',()=>{lost=false;resize();refresh();});
  addEventListener('pagehide',e=>{cancelAnimationFrame(raf);if(!e.persisted){resources.forEach(r=>r.dispose());renderer.dispose();}});addEventListener('pageshow',e=>{if(e.persisted)refresh();});resize();refresh();
})();

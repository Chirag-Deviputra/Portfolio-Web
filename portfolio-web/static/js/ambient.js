/* A restrained, site-wide Three.js Lorenz attractor; decorative and non-interactive. */
(() => {
  'use strict';
  const host=document.getElementById('lorenz-background');
  if(!host||!window.THREE)return;
  const T=window.THREE;let renderer;
  try{renderer=new T.WebGLRenderer({alpha:true,antialias:false,powerPreference:'low-power'});}catch(_){return;}
  host.appendChild(renderer.domElement);host.classList.add('ambient-ready');
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(45,innerWidth/innerHeight,.1,200);
  camera.position.set(0,0,75);camera.lookAt(0,0,0);
  const group=new T.Group();scene.add(group);
  const orbit=[];let x=.1,y=0,z=0;
  for(let i=0;i<13000;i++){const dt=.005;const dx=10*(y-x),dy=x*(28-z)-y,dz=x*y-8/3*z;x+=dx*dt;y+=dy*dt;z+=dz*dt;if(i>1000)orbit.push(new T.Vector3(x,(z-25)*.9,y*.48));}
  const lineGeometry=new T.BufferGeometry().setFromPoints(orbit);
  const lineMaterial=new T.LineBasicMaterial({color:0xe9ecee,transparent:true,opacity:.035,depthWrite:false});
  group.add(new T.Line(lineGeometry,lineMaterial));
  const count=innerWidth<760?650:1500,positions=new Float32Array(count*3);
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(positions,3));
  const material=new T.PointsMaterial({color:0xe9ecee,size:.095,transparent:true,opacity:.42,depthWrite:false,sizeAttenuation:true});group.add(new T.Points(geometry,material));
  let raf=0,last=0,time=0,travel=0,lost=false;
  function draw(){
    const signal=window.portfolioScroll||{energy:0,velocity:0,progress:0,offset:0};
    const energy=window.portfolioMotion===false?0:signal.energy;
    const velocity=window.portfolioMotion===false?0:signal.velocity;
    const offset=signal.offset||0;
    for(let i=0;i<count;i++){const p=orbit[(i*13+Math.floor(travel))%orbit.length];positions[i*3]=p.x;positions[i*3+1]=p.y;positions[i*3+2]=p.z;}
    geometry.attributes.position.needsUpdate=true;
    group.rotation.set(.12+Math.sin(time*.04)*.12+velocity*.07,.18+Math.sin(time*.05)*.2+offset*.24,-.2+offset*.12);
    group.position.x=Math.sin(offset*.45)*3;
    const baseScale=innerWidth<760?1.1:1.45;
    group.scale.setScalar(baseScale*(1+energy*.10));
    lineMaterial.opacity=.035+energy*.025;
    material.opacity=.42+energy*.23;
    renderer.render(scene,camera);
  }
  function frame(now){raf=0;if(document.hidden||window.portfolioMotion===false||lost)return;const dt=last?Math.min((now-last)/1000,.06):.033;time+=dt;travel+=dt*(28+(window.portfolioScroll?.energy||0)*210);last=now;draw();raf=requestAnimationFrame(frame);}
  function refresh(){cancelAnimationFrame(raf);raf=0;last=0;if(lost)return;draw();if(window.portfolioMotion!==false&&!document.hidden)raf=requestAnimationFrame(frame);}
  function resize(){renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.position.z=innerWidth<760?90:64;camera.updateProjectionMatrix();group.scale.setScalar(innerWidth<760?1.1:1.45);if(!lost)draw();}
  addEventListener('resize',resize);addEventListener('motionchange',refresh);document.addEventListener('visibilitychange',refresh);
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;cancelAnimationFrame(raf);host.classList.remove('ambient-ready');});
  renderer.domElement.addEventListener('webglcontextrestored',()=>{lost=false;host.classList.add('ambient-ready');resize();refresh();});
  addEventListener('pagehide',e=>{cancelAnimationFrame(raf);if(!e.persisted){lineGeometry.dispose();geometry.dispose();lineMaterial.dispose();material.dispose();renderer.dispose();}});addEventListener('pageshow',e=>{if(e.persisted)refresh();});resize();refresh();
})();

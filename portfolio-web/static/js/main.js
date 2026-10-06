(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let savedMotion;
  try { savedMotion = localStorage.getItem('portfolio-motion'); } catch (_) {}
  let motion = savedMotion ? savedMotion === 'on' && !reduced.matches : !reduced.matches;
  const motionButton = $('#motion-toggle');
  function setMotion(value) {
    motion = value;
    document.documentElement.classList.toggle('motion-off', !value);
    document.documentElement.classList.toggle('motion-enabled', value);
    motionButton.setAttribute('aria-pressed', String(!value));
    motionButton.querySelector('span').textContent = value ? 'on' : 'off';
    motionButton.setAttribute('aria-label', value ? 'Pause animations' : 'Resume animations');
    window.portfolioMotion = value;
    window.dispatchEvent(new CustomEvent('motionchange', { detail: value }));
  }
  setMotion(motion);
  motionButton.addEventListener('click', () => {
    setMotion(!motion);
    try { localStorage.setItem('portfolio-motion', motion ? 'on' : 'off'); } catch (_) {}
  });
  reduced.addEventListener('change', e => setMotion(!e.matches));
  const menu = $('.menu-toggle'), nav = $('#nav-links');
  function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); }
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => { if (!e.target.closest('.nav')) closeMenu(); });
  let scrollPending = false;
  const progress = $('.scroll-progress');
  addEventListener('scroll', () => {
    if (scrollPending) return;
    scrollPending = true;
    requestAnimationFrame(() => { progress.style.width = `${scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) * 100}%`; scrollPending = false; });
  }, { passive: true });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.remove('pending'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => { if (motion) el.classList.add('pending'); observer.observe(el); });
  }
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
    document.querySelectorAll('[data-group]').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.group !== button.dataset.filter; });
  }));
  const run = $('#run-pipeline'), output = $('#pipeline-output');
  const stages = [...document.querySelectorAll('.stage')];
  const logs = ['git push origin main — commit received', 'docker build — image packaged', 'checks complete — ready to ship', 'deployment complete — demo successful'];
  run.addEventListener('click', async () => {
    run.disabled = true;
    stages.forEach(s => { s.classList.remove('running', 'complete'); s.querySelector('.stage-state').textContent = 'Waiting'; });
    try {
      for (let i = 0; i < stages.length; i++) {
        stages[i].classList.add('running'); stages[i].querySelector('.stage-state').textContent = 'Running…';
        output.textContent = `$ ${['receiving commit', 'building container', 'running checks', 'deploying application'][i]}…`;
        await new Promise(resolve => setTimeout(resolve, motion ? 850 : 120));
        stages[i].classList.replace('running', 'complete'); stages[i].querySelector('.stage-state').textContent = '✓ Passed';
        output.textContent = `$ ${logs[i]}`;
      }
    } finally { run.disabled = false; run.innerHTML = 'Run again <span>↻</span>'; }
  });
  const projects = {
    gitops: { kicker: '01 / GITOPS & OBSERVABILITY', title: 'Azure GitOps Deployment Dashboard', body: 'A read-only Next.js/TypeScript dashboard backed by FastAPI, Kubernetes and Argo CD APIs. The current environment runs on a local kind cluster, with Prometheus and Grafana for application and cluster monitoring.', subtitle: 'How it works', bullets: ['GitHub Actions tests, builds and publishes frontend/backend Docker images to GHCR with dev and commit-SHA tags.', 'Helm packages the workloads. Argo CD compares Git with the cluster; synchronization is currently operator-triggered.', 'The dashboard displays application health, pod readiness, image versions, restart counts and deployment history through restricted read-only RBAC.', 'Prometheus provides request rates, p95 latency, server errors, CPU and memory measurements. Grafana displays resource trends.', 'Automated sync, pruning, self-healing and Terraform-based AKS provisioning remain roadmap items in the current repository.'], repo: 'https://github.com/Chirag-Deviputra/Azure-Gitops-Deployment-Dashboard' },
    docker: { kicker: '02 / CLOUD & AUTOMATION', title: 'Dockerized Web App with Azure DevOps CI/CD', body: 'A Node.js/Express application containerized with a multi-stage Docker build, non-root execution and automated health checks.', subtitle: 'Delivery workflow', bullets: ['A multistage Azure DevOps YAML pipeline runs tests and builds container images.', 'Versioned images are published to Docker Hub using registry service connections.', 'Azure Pipelines triggers Render deployments through a secret deployment-hook variable.'] },
    bicep: { kicker: '02 / PLANNED PROJECT', title: 'Azure Infrastructure with Bicep', body: 'A planned infrastructure-as-code project. The goal is to describe an Azure application environment in repeatable templates instead of creating each resource manually.', subtitle: 'Planned scope', bullets: ['Define a Resource Group, App Service Plan, and Web App.', 'Keep infrastructure templates in version control.', 'Deploy the templates through an Azure DevOps pipeline.'] },
    creator: { kicker: '03 / DIGITAL OPERATIONS', title: 'Corrupt God Gaming', body: 'An active YouTube gaming channel where I manage content strategy, technical setup, and the day-to-day work of running a digital platform.', subtitle: 'What I work on', bullets: ['Configure and troubleshoot live audio/video streaming.', 'Plan content and engage with the community.', 'Handle real-time platform issues and technical operations.'] }
  };
  Object.assign(projects, window.portfolioProjects || {});
  const dialog = $('#project-dialog');
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    $('#dialog-kicker').textContent = project.kicker; $('#dialog-title').textContent = project.title;
    $('#dialog-repo').hidden = !project.repo;
    if (project.repo) $('#dialog-repo').href = project.repo;
    $('#dialog-body').textContent = project.body; $('#dialog-subtitle').textContent = project.subtitle;
    $('#dialog-list').replaceChildren(...project.bullets.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
    dialog.showModal();
  }));
  $('.dialog-close').addEventListener('click', () => dialog.close());
  $('#dialog-contact').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
  $('#copy-email').addEventListener('click', async e => {
    try { await navigator.clipboard.writeText('chiragdeviputra65@gmail.com'); e.target.textContent = 'Copied ✓'; }
    catch (_) { e.target.textContent = 'Use email link above ↗'; }
    setTimeout(() => { e.target.textContent = 'Copy email ⧉'; }, 2500);
  });
  $('#contactForm').addEventListener('submit', async e => {
    e.preventDefault();
    const button = $('#submitBtn'), message = $('#formMsg');
    if (button.disabled) return;
    button.disabled = true; button.textContent = 'Sending…'; message.textContent = ''; message.className = '';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch('/send-message', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(e.target))), signal: controller.signal });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Message could not be sent. Please use the email link.');
      message.className = 'success'; message.textContent = data.message; e.target.reset();
    } catch (error) {
      message.className = 'error'; message.textContent = error.name === 'AbortError' ? 'The request timed out. Please email me directly.' : error.message === 'Failed to fetch' ? 'Connection unavailable. Please email me directly.' : error.message;
    } finally { clearTimeout(timeout); button.disabled = false; button.innerHTML = 'Send message <span>↗</span>'; }
  });
})();

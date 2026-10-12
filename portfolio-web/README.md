# Chirag.dev — DevOps Portfolio

Flask portfolio with a charcoal (#13151f) and porcelain (#e9ecee) palette, a site-wide Three.js Lorenz background, and sand-like particle typography in the hero.

## Windows quick start

Install Python 3.10+ with its Python launcher. Extract the ZIP, open `portfolio-web`, double-click `start.bat`, and visit **http://127.0.0.1:5000**. Keep the terminal open while using the site. Ctrl+C stops it. First setup needs internet for the Python dependencies.

When updating an existing copy, stop Flask, replace the project files, start it again, and press **Ctrl+F5**. Changed CSS and JavaScript also have a version query to avoid cached files.

PowerShell alternative:

```powershell
cd portfolio-web
py -3 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe app.py
```

macOS / Linux:

```sh
cd portfolio-web
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python app.py
```

## Visual design and interaction

- Primary colors: **#13151f** (background) and **#e9ecee** (foreground), with transparent variations for borders, surfaces and secondary text.
- **Every h1, h2 and h3**, section eyebrow, navigation title and pipeline-stage title has hover/reveal decoding. Stable base text preserves layout and screen-reader content while decorative glyphs animate above it.
- **Site-wide Lorenz attractor:** a fixed, pointer-transparent Three.js field behind the page. Orbiting points trace a Lorenz trajectory with subtle camera movement and scroll response.
- **Hero sand typography:** replaces the former infrastructure playground. DEVOPS, CLOUD, AUTOMATE and CHIRAG cycle through readable words, dispersion and reassembly. Pointer movement scatters nearby grains. Word buttons and Dissolve work on touch screens as well.
- The former standalone Systems Lab and cube playground were removed so the requested effects belong to the background and hero.
- Existing scrolling tool rows, tool filters, project dialogs, GitOps feature, delivery demo, profile and contact form remain.
- Résumé download buttons and the public PDF remain removed.

The particle behavior is independently implemented, informed by the supplied recordings and Austensor's wordmark, Ganges Sands and Lorenz experiments. No reference-site branding, assets or implementation code is included.

## Motion and performance

Motion is enabled unless the operating system requests reduced motion or the visitor previously paused it. The top-bar Motion control saves the preference locally and can explicitly resume animation. In paused mode, titles remain fully readable and hero word controls select static particle text.

The hero uses frame-rate-independent damping and interpolation. It stops rendering offscreen and in hidden tabs. The ambient background pauses in hidden tabs and caps its update rate. Pixel density and particle counts are limited for mobile. The title and typography effects work without WebGL; the background falls back to a static gradient.

## Content

The supplied résumé provides CNSWARE internship details, AZ-900 (905/1000), AZ-104 (958/1000), seventh semester, 7.87 CGPA and contact information. The GitOps project links to:

https://github.com/Chirag-Deviputra/Azure-Gitops-Deployment-Dashboard

Its description follows the current repository: local kind cluster, manual Argo CD synchronization, read-only operations dashboard, Prometheus and Grafana monitoring. Automated sync, pruning, self-healing and Terraform/AKS provisioning remain roadmap items.

## Email configuration

Copy `.env.example` to `.env`. Set `SENDER_PASSWORD` to a Gmail app password belonging to `SENDER_EMAIL`; set `RECEIVER_EMAIL` as required. Existing `.env` values override defaults. Never commit secrets.

Default email: `chiragdeviputra65@gmail.com`. Without credentials, the form explains that email delivery is not configured and supplies a direct email link. Actual delivery requires testing with your credentials.

## Files to edit

- `templates/index.html`: content, links, sections and controls.
- `static/css/style.css`: palette, layout and CSS motion.
- `static/js/main.js`: project data, filtering, navigation and contact handling.
- `static/js/effects.js`: all-title decoding and hero sand typography.
- `static/js/ambient.js`: site-wide Three.js Lorenz background.
- `app.py`: Flask routes and contact endpoint.

Three.js r128 is bundled locally with its MIT license. Google Fonts is optional and falls back to system fonts.

## Deployment and verification

No public deployment has been performed. The original Vercel configuration is retained; set email credentials in the hosting environment separately. Use a production WSGI server for other hosting, and add host-level rate limiting before exposing email delivery at scale. `/health` reports application availability, not email configuration.

See `VERIFICATION.md` for test results. The archive's `previews` directory contains current desktop and mobile screenshots.

## Agency-inspired update (version 5)

The portfolio now presents five repository-backed projects: the existing Azure GitOps dashboard plus Dockerised Web App, Corrupter, Lenovo LOQ Experience and Docker E-Commerce. The Dockerised Web App entry has been expanded rather than duplicated. Planned Bicep work has been replaced in the selected-work section by implemented projects; creator experience is retained.

- `projects.json`: the four added/updated case studies, technology tags and repository links. Flask reads this file when serving the homepage.
- `templates/project-showcases.html`: project layouts and original illustrative visuals (not screenshots of the applications).
- `static/css/agency.css`: large editorial typography, alternating showcases, light About section, animated exhibits and mobile menu.
- `static/js/agency.js`: bounded scroll-linked exhibit movement; respects Motion off and mobile layouts.

Emotion Agency informed the broad editorial direction; its live preview was stuck on its loader during inspection, so this is an independent interpretation, not a recreation of verified frame-by-frame interactions.

### Repository evidence reviewed on 5 October 2026

- Dockerised-Web-App-Azure-Pipeline: `README.md`, `Dockerfile`, `azure-pipelines.yml`. The pipeline source supersedes the older README: tests → Docker Hub → Render, rather than ACR/App Service.
- Personal-Agent-Corrupter: `README.md`. Working Phase 1–3 prototype; Twilio, offline speech and retrieval-based long-term memory remain future work.
- Lenovo-LOQ-Frontend-Web-Project: `README.md`, `package.json`, `app/page.tsx`, `components/LenovoExperience.tsx`. Independent product concept with a 240-frame canvas sequence and Framer Motion overlays.
- docker-ecommerce-project: `README.md`, `package.json`, `Dockerfile`. Course attribution retained; containerization is described specifically as backend containerization. No claim of a deployed or production-tested checkout.

All project source links are present on their cards and in their detail dialogs. The source repositories were read, not modified. The portfolio remains a runnable Flask project; this ZIP does not publish it to a hosting service.

## Scroll-reactive effects (version 6)

Scroll with Motion on to activate both visual systems together. Scroll speed disperses the hero sand grains and increases the background particle speed, scale and brightness. Scroll direction tilts the Lorenz field and pushes the grains; page progress turns the background composition. Both effects ease back to their idle behavior when scrolling stops. The hero continues to pause offscreen.

`static/js/scroll-motion.js` supplies a shared, smoothed scroll signal. Native wheel, touch, keyboard and anchor scrolling remain intact. Motion off and the initial reduced-motion preference disable the response. No scroll hijacking or additional external dependency is used.

## Scroll and title fixes (version 7)

Title decoding now runs once per title/content per page load, on first reveal or interaction. Later hovering, keyboard focus, card hovering and reopening the same project do not replay it. Different project dialog content can animate once each.

Background rotation now follows smoothed scroll distance measured in viewport heights, making short scrolls visible on this long page. Velocity is sampled per animation frame rather than per browser scroll event. The field keeps its position after scrolling and freezes in place when Motion is off. Scroll-based tilt and dispersion settle smoothly. Browser rendering is no longer artificially limited to 30 fps (actual performance depends on the device).

## Electric-blue cloud direction (version 8)

Replaces the earlier two-color/Lorenz direction with the supplied blue-light reference: near-black #030712, electric blue #0874ee, cyan #55d5ff and readable off-white #edf5ff. The original Three.js cloud scene includes cloud outlines, infrastructure nodes, delivery connections, moving signals and blue horizon bands. Scrolling changes the scene pose and signal speed. Static blue gradients remain available without WebGL. Title decoding still runs once per title/content per page load.

The background uses original abstract geometry, not official Azure logo assets. The reference image is used for color direction rather than copied into the page. `static/css/cloud-theme.css` controls this palette; `static/js/ambient.js` owns the cloud scene.

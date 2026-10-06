# Verification — 5 October 2026, monochrome particle update

## Browser tests

Passed Playwright checks in headless Chromium:

- Computed body background is rgb(19,21,31), matching #13151f. Foreground is rgb(233,236,238), matching #e9ecee.
- All h1/h2/h3 titles are registered for decoding. Navigation and section titles are included.
- Hero heading hover starts decoding, restores the original wording, and preserves its width and height during the effect.
- The fixed Three.js Lorenz background creates a WebGL canvas.
- The old infrastructure playground, standalone Systems Lab and résumé downloads are absent.
- Dissolve changes the hero canvas. Rapid word selections finish on the latest requested word.
- Motion off stops hero canvas changes. Word controls still select static results.
- Pipeline demo, skill filtering and dynamically populated project dialog headings work.
- Page widths 360, 390, 768, 1024 and 1920 have no horizontal overflow.
- Mobile touch controls and navigation work; reduced-motion preference defaults to paused.
- Hero typography remains available when Three.js is blocked.
- No JavaScript page errors occurred in the tested flows.

Desktop hero, project and mobile screenshots were visually reviewed. The background line brightness was then reduced to preserve readability. Motion timing is independent of frame rate; real-device frame rates vary and have not been benchmarked.

## Backend

The earlier validated Flask contact implementation is retained. The prior test-client checks covered invalid request bodies and field types, invalid email, header line breaks, field limits, request-size limits, honeypot, missing email configuration, mocked SMTP success/failure and plain-text email content. No actual email was sent; credentials were not supplied.

## Sources and scope

Visual references: the supplied recordings/screenshots and https://www.austensor.com/ (including /page1 and /page11), reviewed for this update. Effects are independent implementations adapted to the portfolio and requested palette.

Profile: supplied résumé. GitOps project details: its repository README, retrieved 5 October 2026.

This is an update to the Flask project ZIP. No public website deployment or GitHub repository mutation was performed. The pipeline animation is an illustrative demo; it executes no infrastructure commands.

## Version 5 — agency layout and four repositories

Passed browser verification for all four new/expanded project cards, working detail dialogs, nonhidden repository links, WebGL canvas, Motion off, manual particle word selection, pipeline completion, development skill filtering, and mobile navigation. Layouts checked at 360, 390, 768, 1024, 1440 and 1920 pixels without horizontal overflow. No JavaScript page errors in these flows. Desktop hero, alternating project showcase and mobile screenshots visually reviewed.

Repository descriptions were checked against the files listed in README.md. Public project deployments and real email delivery were not tested. Source repositories were not changed.

## Version 6 — shared scroll response

Browser checks passed for scroll activation, reversed scroll direction, automatic settling after scroll input ends, Motion-off static sand canvas, and reduced-motion behavior. No JavaScript errors occurred. Existing title decode, particle controls, WebGL fallback, layout and navigation regression checks were rerun.

## Version 7 — scroll and repeat-hover fixes (6 October 2026)

Passed Chromium checks: repeated heading hover does not replay decoding; reopening the same project dialog does not replay its title; short scrolling updates the smoothed viewport-relative position and rendered background; reversing scroll changes direction; the response settles; Motion off preserves the background scroll pose; reduced motion disables the response. No overflow at 390 and 1440 pixels and no JavaScript page errors in these flows. Earlier tests expecting repeated hover decoding are superseded by the one-shot behavior.

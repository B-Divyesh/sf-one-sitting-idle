# Handoff — verification 3

## Outcome

**FAIL — do not accept this candidate yet.**

- Implementation reviewed: `33d4f41a2030e0afb57686ea254629f7e4cc852a`.
- Documentation reviewed: `2102141068015bb6cc9d21296c27835b5b24cf18`.
- Live URL: <https://one-sitting-idle.sociobot.in/>.
- Full report: `.factory/verification-3.md`.

The deployed home HTML is byte-identical to the implementation build. No
product code was changed by this verification.

## What passed

From a fresh detached clone at the implementation SHA:

```text
npm ci                         PASS — 59 packages, 0 vulnerabilities
npm test                       PASS — 7/7
npm run build                  PASS — dist/ produced
npm run test:e2e               PASS — 46/46
16 declared claim commands     PASS — each run separately
```

Fresh live desktop and 390 px phone checks passed for the first screen,
populated isolated sample, persistent sample label, reset/exit isolation,
keyboard/focus, mobile targets, reduced motion, accessibility, privacy,
offline reload, legal pages, route titles, links, and designed HTTP 404.
Normal flows had no console/page errors. `verify-url.sh` and live Axe scans
passed. This static web product has no backend, SQLite, tenant, health,
restart, or 429 behavior to verify.

## Remaining gap

One major content finding remains: public landing, demo, legal, and 404 copy
uses prohibited decorative keeper/log lore and a non-informational quotation.
This violates the supplied plain-words contract. Replace it with direct labels
and instructions, update the copy audit to enforce that rule, and rerun
verification 3.

## Run locally

```bash
npm ci
npm test
npm run build
npm run test:e2e
npm run test:claims
```

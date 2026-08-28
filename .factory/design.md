# Visual thesis — The Last Light

## Direction

**Handwritten keeper's lab notebook.** The page is the artifact: a salt-stained
maintenance ledger kept through one impossible night at a failing lighthouse.
Progress is written into it as terse observations, pencilled calculations, and
rust-red marginalia. The navigation, resource counters, and controls feel like
tools laid on the same desk, not a dashboard layered over the story. This fits a
bounded incremental game because every action becomes a tangible entry in a
finite log, and the visible page edge implies an ending.

This is deliberately a **single light treatment**. An ivory paper surface is the
game's diegetic object; switching it to a conventional dark UI would dissolve
that metaphor. The surrounding desk/sea is deep navy, with the lamp's yellow
used sparingly to show the one thing that matters next.

## Palette

| Token | Value | Use and origin |
| --- | --- | --- |
| `--desk` | `#101b22` | Blue-black sea and keeper's desk |
| `--desk-soft` | `#20313a` | Raised chrome and horizon lines |
| `--paper` | `#f3ecd9` | Warm, weathered log paper |
| `--paper-deep` | `#e7dcc1` | Torn edges, wells, pressed states |
| `--ink` | `#17262d` | Main graphite/navy copy (12.9:1 on paper) |
| `--ink-muted` | `#526168` | Secondary notes (5.7:1 on paper) |
| `--rust` | `#9d351f` | Keeper annotations and urgent actions |
| `--rust-dark` | `#702516` | Rust hover/accessible small text |
| `--lamp` | `#e8b832` | Lamp glow, earned progress, focus cue |
| `--lamp-ink` | `#1d1a10` | Text on lamp yellow |
| `--safe` | `#326a55` | Repairs and successful outcomes |
| `--danger` | `#8f2925` | Storm damage/error, always paired with text/icon |

No gradients. Texture comes from layered line work and authored/generated
material, not stock noise. Color never carries status alone: words, symbols,
and progress values accompany it.

## Type

- **Narrative/display:** Georgia, `Times New Roman`, serif. Familiar print
  letterforms make log entries feel authored and remain self-host-free.
- **Controls/data:** ui-monospace, SFMono-Regular, Menlo, Consolas, monospace.
  Tabular numbers make rates stable, while compact uppercase labels resemble
  equipment annotations.
- Scale: 14px metadata, 16px utility/body minimum, 20px card title, 26px act
  heading, clamp(32px, 7vw, 64px) title. Story measure stays under 68ch.

## Spacing and shape

- 4px base rhythm; primary steps are 8, 12, 16, 24, 32, 48, 64px.
- The notebook is a centered asymmetric sheet, max-width 1180px, with a broad
  story column and narrower instrument rail. At ≤760px these stack, the field
  log follows the action, and ornamental edge notes disappear.
- Corners stay tight (2–6px), like clipped paper and metal equipment—not soft
  SaaS cards. Borders use 1–2px ink strokes with occasional offset shadows.
- Interactive targets are at least 44px. Dashed rules divide related notes;
  boxed sections only represent separate physical instruments or decisions.

## Interaction grammar

- The largest available rust button is the immediate manual verb: **Trim the
  wick**, **Send a signal**, then **Brace the light**.
- Repairs are purchased as checklist entries. Available rows have an empty
  square; bought rows become a struck, checked note. Locked rows explain the
  exact prerequisite instead of hiding.
- Resource totals sit on an instrument strip and update immediately. Rate
  deltas briefly take lamp yellow. Keyboard shortcuts mirror the log's numbered
  annotations: `1` main action, `2–4` buy visible repairs, `S` save/share,
  `?` instructions.
- Act changes resemble turning a page: old rules stay summarized in the log,
  the active heading advances, and one new mechanic is introduced plainly.
- A persistent session clock and explicit three-mark act track keep the promised
  endpoint visible throughout. No endless reset, streak, reward calendar, or offline
  earnings.

## Motion

- Controls press 2px into their offset shadow (120ms). New log lines fade and
  slide upward by 6px over 240ms. The beam sweeps slowly only while lit, as
  meaningful ambient feedback; it can be paused via **Turn motion off** and stops
  when the tab is hidden.
- Act transitions use one 450ms page-shift. Resource bumps use opacity/scale,
  never layout-affecting properties.
- Under `prefers-reduced-motion: reduce`, all transforms, sweeps, and smooth
  scrolling are removed; state changes are instant and remain legible.

## Original asset plan and provenance

### Hero illustration

One wide illustration is used on the opening log cover and later as a quiet
chapter backdrop: an isolated lighthouse, cutaway machinery, sea, keeper's
notations, and distant harbor rendered as ink-and-gouache notebook art. It
clarifies the whole mechanical arc—light → ships → town → storm—without UI text.

Prompt sheet:

> Wide horizontal editorial illustration for an original browser game, an
> isolated 1890s lighthouse on a black-blue rocky sea at night, warm lamp beam
> crossing toward a tiny distant harbor, subtle cutaway showing brass gears and
> oil reservoir, hand-rendered field notebook style, graphite construction
> lines, navy fountain pen hatching, sparse rust-red keeper annotations without
> legible writing, ochre gouache lamp glow, ivory weathered paper ground,
> imperfect scientific study, quiet melancholy and determination, orthographic
> side elevation blended with cinematic seascape, restrained flat palette,
> natural paper grain, no people, no text, no watermark, no logo, no UI, no
> photorealism, no gradients, no neon, no fantasy castle, no copyrighted style.

- Generator: Azure OpenAI image generation via factory `gen-image.sh`, deployment
  `factory-image`.
- Generated: 2026-08-27. Original for this product; no external copyrighted
  source image or artist name was used.
- Source candidate and JSON prompt sidecar live in `assets/src/`; shipped WebP
  lives in `public/assets/` and is capped below 300 KB.
- The 1200×630 social card and 180×180 touch icon are crops of that same
  generated source, made locally with ImageMagick on 2026-08-28. They introduce
  no new imagery or license source.
- Remaining marks (lamp, compass, waves, check boxes) are original CSS/SVG line
  work authored for this repository.

## Accessibility and content policy

- Strong rectangular focus treatment: 3px lamp outline plus 2px desk offset.
- At 200% zoom, columns become a single reading order and no action bar fixes
  over content. Narrative updates use a polite live region; rapidly changing
  resource numbers do not spam announcements.
- Illustration alt text communicates the journey represented in the drawing.
- Story avoids death loops and punitive randomness. Failures during the storm
  reduce a buffer but cannot erase progress; the ending is always attainable.

---
name: KonnectHub
description: Integrations that show their work. A hosted runtime for commerce flows, shown running in plain sight.
colors:
  signal-honey: "oklch(84.5% 0.17 82)"
  signal-honey-deep: "oklch(74% 0.18 58)"
  shop-paper: "oklch(97.2% 0.012 85)"
  shop-paper-shade: "oklch(93.2% 0.022 82)"
  engine-ink: "oklch(19% 0.018 60)"
  engine-housing: "oklch(23.5% 0.02 60)"
  engine-seam: "oklch(32% 0.022 62)"
  soft-engine-ink: "oklch(31% 0.03 62)"
  worn-ink: "oklch(43% 0.025 65)"
  exhaust-haze: "oklch(78% 0.02 78)"
  shop-rule: "oklch(85% 0.02 80)"
  status-ok: "oklch(72% 0.17 150)"
  status-run: "oklch(84.5% 0.17 82)"
  status-held: "oklch(74% 0.11 235)"
  status-fail: "oklch(66% 0.2 30)"
  status-wait: "oklch(80% 0.1 300)"
typography:
  display:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.85rem, 0.6rem + 10.2vw, 11rem)"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "-0.012em"
    fontVariation: "'wdth' 62"
  headline:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 1rem + 5vw, 6.25rem)"
    fontWeight: 850
    lineHeight: 0.9
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 68"
  title:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.15rem + 1.1vw, 2.1rem)"
    fontWeight: 800
    lineHeight: 1.02
    fontVariation: "'wdth' 80"
  lead:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1rem + 0.45vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Martian Mono Variable, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    letterSpacing: "0.04em"
  code:
    fontFamily: "Martian Mono Variable, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.7
    fontVariation: "'wdth' 87.5"
rounded:
  tag: "3px"
  chip: "6px"
  plate: "14px"
  shell: "18px"
  pill: "999px"
spacing:
  gutter: "clamp(1.25rem, 4vw, 3rem)"
  section: "clamp(5.5rem, 3rem + 8vw, 11rem)"
  header: "4rem"
  wrap-max: "88rem"
components:
  button-ink:
    backgroundColor: "{colors.engine-ink}"
    textColor: "{colors.signal-honey}"
    rounded: "{rounded.pill}"
    padding: "0.95em 1.4em 0.9em"
  button-honey:
    backgroundColor: "{colors.signal-honey}"
    textColor: "{colors.engine-ink}"
    rounded: "{rounded.pill}"
    padding: "0.95em 1.4em 0.9em"
  button-line:
    textColor: "{colors.engine-ink}"
    rounded: "{rounded.pill}"
    padding: "0.95em 1.4em 0.9em"
  button-line-hover:
    backgroundColor: "{colors.engine-ink}"
    textColor: "{colors.signal-honey}"
  button-sm:
    padding: "0.7em 1.1em 0.66em"
  status-tag:
    textColor: "{colors.engine-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.tag}"
    padding: "0.28em 0.55em 0.24em"
  topic-chip:
    backgroundColor: "{colors.shop-paper}"
    textColor: "{colors.engine-ink}"
    typography: "{typography.code}"
    rounded: "{rounded.pill}"
    padding: "0.3rem 0.65rem"
  plate:
    backgroundColor: "{colors.shop-paper-shade}"
    textColor: "{colors.engine-ink}"
    rounded: "{rounded.plate}"
    padding: "clamp(1.5rem, 3vw, 2.5rem)"
  machine-board:
    backgroundColor: "{colors.engine-housing}"
    textColor: "{colors.shop-paper}"
    rounded: "{rounded.shell}"
  terminal:
    backgroundColor: "{colors.engine-housing}"
    textColor: "{colors.shop-paper}"
    typography: "{typography.code}"
    rounded: "{rounded.plate}"
  receipt:
    backgroundColor: "{colors.shop-paper}"
    textColor: "{colors.engine-ink}"
    typography: "{typography.code}"
    padding: "1.75rem 1.5rem"
  site-header:
    backgroundColor: "{colors.signal-honey}"
    textColor: "{colors.engine-ink}"
    height: "4rem"
---

# Design System: KonnectHub

## 1. Overview

**Creative North Star: "The Machine in Plain Sight"**

The site is a machine running in front of the reader. Ink panels hold the live product: run boards tick, receipts print, terminals type, event dots fire. Those panels sit on two loud grounds, Shop Paper and a drenched Signal Honey, so the machine always reads as an object placed on a surface, never as a backdrop. The energy comes from ultra-condensed black type and hard, stamped edges. The substance comes from mono labels and literal copy that match how the platform behaves.

Density is low per fold and high per object. Each section carries one dominant idea and one working piece of the product. Honey and ink sections punctuate a paper page, so the light changes every few scrolls. No two adjacent sections share a ground. Motion is mechanical: steps, prints, ticks and exponential ease-outs. Nothing bounces. Every live scene pauses off screen and has a static reduced-motion state that still tells the story.

This system rejects three things by name, from PRODUCT.md: **Zapier / Make clones** (pastel app-icon grids, "connect 6,000 apps" tropes, cartoon blobs), the **generic SaaS template** (centered hero with gradient blob, three icon cards, logo strip, hero-metric stats), and **corporate enterprise** (navy palettes, stock handshake photos, safe gray copy, "solutions" language).

**Key Characteristics:**
- Drenched honey and warm paper grounds; ink reserved for the machine.
- Ultra-condensed Archivo at weight 850 to 900 for every headline.
- Martian Mono for every label, status, path, topic and number that comes from the product.
- Hard offset shadows with zero blur; soft shadows only on artifacts that float over an edge.
- 2px ink rules as structure: section borders, list dividers, header base.
- Status always shown as color plus a text label.

## 2. Colors: The Signal Palette

A drenched strategy: Signal Honey carries whole sections, Engine Ink carries the machine, and every neutral is tinted toward the honey hue (hue 58 to 85).

### Primary
- **Signal Honey** (signal-honey): The brand ground. Drenches the hero, the sticky header, Held Deliveries and Done For You, with a faint print grain and a warmer radial bloom in the top right. On ink it becomes the accent: CTA text, prompts, live dots, section indices, the terminal's offset shadow. Also the `RUNNING` status and the selection highlight.
- **Deep Signal Amber** (signal-honey-deep): The honey's shadow. Focus rings on paper and ink, the offset under ink CTAs, topic dots, ticker arrows, and underline hovers on honey. Never a fill for large areas.

### Status (semantic only)
- **Run Green** (status-ok): `SUCCEEDED`, `CONNECTED`, success lines in terminal output.
- **Held Blue** (status-held): `HELD`. Deliveries kept while a deployment is off.
- **Fail Red** (status-fail): `FAILED`.
- **Wait Lilac** (status-wait): `WAITING`, `WAITING_RERUN`, `PAUSED`.
- `RUNNING` uses Signal Honey with a blinking dot.

### Neutral
- **Shop Paper** (shop-paper): Page background and the receipt's paper.
- **Shop Paper Shade** (shop-paper-shade): Plates and the Data Stores section. One step down from paper, never a third tone.
- **Engine Ink** (engine-ink): Body text on paper and honey, ink sections, the footer, ink CTAs, every 2px rule.
- **Engine Housing** (engine-housing): The body of every machine panel (run board, terminal, flow shell, held demo), on any ground.
- **Engine Seam** (engine-seam): 1px borders and row dividers inside machine panels; the footer wordmark fill.
- **Soft Engine Ink** (soft-engine-ink): Secondary text and section indices on honey.
- **Worn Ink** (worn-ink): Secondary text, labels and receipt keys on paper.
- **Exhaust Haze** (exhaust-haze): Secondary text on ink; default status fill.
- **Shop Rule** (shop-rule): Dashed dividers inside plates on paper.

### Named Rules
**The Machine Lives In Ink Rule.** Engine Ink and Engine Housing are for things that run: boards, terminals, flow shells, ink sections. Marketing copy never sits in an ink panel of its own.

**The No Pure Values Rule.** No `#000`, no `#fff`. Every light and dark is tinted toward hue 60 to 85 at chroma 0.012 or more.

**The Label Plus Color Rule.** A status is never a colored dot alone. It is a mono uppercase word on its status fill, with a dot.

## 3. Typography

**Display Font:** Archivo Variable, width axis (with ui-sans-serif, system-ui)
**Body Font:** Archivo Variable at normal width
**Label/Mono Font:** Martian Mono Variable, width axis (with ui-monospace, SFMono-Regular)

**Character:** One grotesque pushed to extremes: ultra-condensed black for the loud voice, normal width for reading. Martian Mono is the machine's voice: everything the product would print, the page prints in mono.

### Hierarchy
- **Display** (900, width 62%, clamp 2.85rem to 11rem, line-height 0.86): The hero line and the Done For You close. Two per page at most.
- **Headline** (850, width 68%, clamp 2.6rem to 6.25rem, line-height 0.9): One per section. Short, literal sentences, max 14 to 21ch.
- **Title** (800, width 80%, clamp 1.5rem to 2.1rem, line-height 1.02): Panel titles, connection names, footer statement.
- **Lead** (400, clamp 1.125rem to 1.375rem, line-height 1.45): The one paragraph under a headline. Max 46ch.
- **Body** (400, 1.0625rem, line-height 1.55): Facts and descriptions. Max 38 to 44ch in side columns.
- **Label** (Martian Mono 500, 0.6875rem, letter-spacing 0.04em, uppercase): Section indices (`03 / Services & connections`), field names, nav meta, footer headings.
- **Code** (Martian Mono 400, width 87.5%, 0.8125rem, line-height 1.7): Topics, flow parts, terminal lines, receipt rows.

### Named Rules
**The Condensed Means Loud Rule.** Width under 70% is only for display and headline sizes. Never condense body, lead or labels.

**The Product Speaks Mono Rule.** If the string could appear in the KonnectHub app, CLI or logs (a topic, a status, an ID, a path, a duration), it is set in Martian Mono. Marketing claims never are.

**The Indexed Section Rule.** Every section opens with a mono label in the form `NN / Name`, followed by a 3rem, 2px rule. It is the reader's position in the machine.

## 4. Elevation

A hybrid system with two shadow types and strict roles. Most depth comes from surface swaps (paper, shade, honey, ink) and 2px ink borders, not from shadows. Hard offset shadows mean "an object on the bench": a plate or a terminal you could pick up. Soft deep shadows mean "an artifact hanging over an edge": the run board that overhangs the hero, the receipt that floats over ink. Nothing else casts a shadow.

### Shadow Vocabulary
- **Bench offset, ink** (`box-shadow: 10px 10px 0 0 var(--color-ink)`; 12px on the larger held demo): Plates and demos on paper or honey.
- **Bench offset, honey** (`box-shadow: 12px 12px 0 0 var(--color-honey)`): The terminal on an ink section.
- **Button lift** (`transform: translate(-3px, -3px); box-shadow: 3px 3px 0 0 var(--cta-shadow)`): Ink and honey CTAs on hover. Collapses to zero on active.
- **Float, board** (`box-shadow: 0 1px 0 0 oklch(100% 0 0 / 0.06) inset, 0 40px 80px -30px oklch(19% 0.05 60 / 0.55), 0 18px 30px -18px oklch(19% 0.05 60 / 0.5)`): The hero run board only.
- **Float, receipt** (`filter: drop-shadow(0 30px 40px oklch(10% 0.02 60 / 0.55))`): The printed receipt only; a drop-shadow so it follows the zigzag edge.

### Named Rules
**The Zero Blur Rule.** Bench offsets have no blur and no spread. If an offset shadow is soft, it is wrong.

**The Float Is Earned Rule.** A soft shadow is allowed only when the object breaks a surface edge or is tilted. A flat panel inside a section never floats.

## 5. Components

Heavy, stamped, exact. Thick pills, 2px rules, hard lifts. No soft hover glows, no gradients on controls.

### Buttons
- **Shape:** Full pill (999px), weight 750, 1rem, line-height 1.
- **Ink (primary):** Engine Ink fill, Signal Honey text, padding 0.95em 1.4em 0.9em. The main action on every honey and paper surface: "Book a build call".
- **Honey:** Signal Honey fill, Engine Ink text. The main action on ink surfaces. Its lift shadow is Shop Paper.
- **Line (secondary):** Transparent with a 2px inset ring in currentColor. On hover it fills with Engine Ink and turns its text honey.
- **Hover / Active:** Ink and honey buttons lift 3px up-left onto a hard offset (Deep Signal Amber under ink). Active snaps back to flat. The trailing arrow slides 4px right on hover with ease-out-expo.
- **Small:** padding 0.7em 1.1em 0.66em, 0.9375rem. Header only.
- **Focus:** 3px Deep Signal Amber outline, 3px offset; Engine Ink outline on honey surfaces.

### Status Tags
- **Style:** Mono 0.625rem, weight 600, letter-spacing 0.05em, uppercase, 3px radius, Engine Ink text on the status fill, with a currentColor dot at 0.5em.
- **State:** `RUNNING` blinks its dot in two steps (0.9s). Other states are static.

### Topic Chips
- **Style:** Mono, Shop Paper fill, 1.5px Engine Ink border, full pill, padding 0.3rem 0.65rem. A Deep Signal Amber dot pulses on a staggered loop to show events firing.

### Plates
- **Corner Style:** 14px.
- **Background:** Shop Paper Shade, 2px Engine Ink border.
- **Shadow Strategy:** Bench offset, ink (10px).
- **Detail:** Four screw heads (10px circles with a slot) in the corners. Fields stack as mono label over value; a dashed Shop Rule divider before any code caption.
- **Internal Padding:** clamp(1.5rem, 3vw, 2.5rem).

### Machine Panels (run board, terminal, flow shell)
- **Corner Style:** 18px for boards and shells, 14px for the terminal.
- **Background:** Engine Housing with a 1px Engine Seam border; rows divided by Engine Seam at 60% opacity. The newest row gets a 6% honey wash.
- **Header strip:** Mono label left (live dot in honey), tabular counts right in Exhaust Haze with Shop Paper values.
- **Behavior:** Animates only while visible (`data-live`). The hero board tilts -0.6deg and overhangs the honey into the paper below.

### Navigation
- **Header:** Sticky, 4rem, drenched honey with a 2px Engine Ink base rule. Logo with the ink tile left; links center; "Sign in" and the small ink CTA right.
- **Links:** Weight 600, 0.9375rem. Hover and focus draw a 2px underline from left with ease-out-expo. No color change.
- **Mobile:** "Menu" label plus a two-bar burger that rotates into an X. The menu drops as a honey panel with 1.75rem condensed (width 70%, weight 850) links on hairline ink dividers. Escape closes and returns focus.
- **Footer:** Engine Ink ground, honey title statement, mono group headings in Exhaust Haze, honey underline hovers. A full-width condensed "KonnectHub" wordmark in Engine Seam bleeds off the bottom.

### Printed Receipt (signature)
A paper execution record on ink: centered mono header, a definition list of run metadata, a step table with ink duration bars scaled to the slowest step, logs with `WARN` in a burnt amber, and an ink total bar with `SUCCEEDED` in Run Green. Zigzag bottom edge via mask, tilted 1.6deg. Rows print in with 0.16s staggers when scrolled into view.

### Numbered Lists (signature)
Facts and jobs are ordered lists with a display-weight numeral (2.5rem to 3.75rem, tabular) in a fixed left column, not icon cards. Job rows sit between 2px ink rules and slide 6px right on hover.

## 6. Do's and Don'ts

### Do:
- **Do** punctuate the paper page with honey and ink sections. Adjacent sections never share a ground (Shop Paper Shade counts as its own ground).
- **Do** put one working piece of the product in every section. If a section has no live or printed artifact, it has no claim.
- **Do** set every product string (topic, status, ID, path, duration, command) in Martian Mono.
- **Do** use 2px Engine Ink rules for structure on paper and honey, and 1px Engine Seam rules inside machine panels.
- **Do** give every animation a reduced-motion state that still shows the final story, and pause every `data-live` scene off screen.
- **Do** ease out with `cubic-bezier(0.16, 1, 0.3, 1)` (expo) or `cubic-bezier(0.25, 1, 0.5, 1)` (quart). Use `steps()` for blinks, typing and ticks.
- **Do** keep copy literal. A headline is a true sentence about how the platform behaves.

### Don't:
- **Don't** build **Zapier / Make clones**: no pastel app-icon grids, no "connect 6,000 apps" tropes, no cartoon blobs.
- **Don't** ship the **generic SaaS template**: no centered hero with a gradient blob, no three icon cards, no logo strip, no hero-metric stats.
- **Don't** drift to **corporate enterprise**: no navy palettes, no stock handshake photos, no safe gray copy, no "solutions" language.
- **Don't** soften a bench offset with blur. If it looks like a 2014 card shadow, delete it.
- **Don't** show status by color alone. No bare dots, no colored rows without a label.
- **Don't** use `border-left` or `border-right` over 1px as a colored accent stripe.
- **Don't** use gradient text, glassmorphism or backdrop blur.
- **Don't** condense body text, leads or labels below normal width.
- **Don't** use `#000` or `#fff`, or any neutral without the honey tint.
- **Don't** bounce or overshoot. No elastic easing.
- **Don't** use em dashes in copy.

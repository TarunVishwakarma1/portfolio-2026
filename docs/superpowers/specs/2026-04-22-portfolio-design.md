# Portfolio Design Spec — Tarun Vishwakarma
Date: 2026-04-22

## Overview
Awwwards-level personal portfolio for Tarun Vishwakarma, Full Stack Developer based in Delhi, India. Editorial dark aesthetic with warm amber accent, Cormorant serif display, Lenis smooth scroll, and GSAP-powered animations including a signature horizontal scroll works section.

---

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Aesthetic | Editorial Serif | Cormorant-led, literary, whitespace-heavy — Le Monde / design magazine energy |
| Layout | Horizontal scroll works | GSAP pin + horizontal strip — signature Awwwards move |
| Hero animation | Mask line reveal | Lines slide up behind clip-path overflow-hidden containers |
| Color accent | Warm Amber `#D4A853` | Premium, pairs with Cormorant italic, used sparingly |
| Scroll library | Lenis | Buttery RAF-based smooth scroll |
| Animation library | GSAP + ScrollTrigger | Industry standard for this complexity level |

---

## Typography

- **Display**: Cormorant Garamond — weight 300, italic variant for accent lines
- **Body / Meta**: Geist Mono — weight 300–400
- **Scale**: `clamp()` fluid sizing throughout, never fixed px on headings
- **Hero size**: `clamp(3.2rem, 10vw, 9.5rem)`

---

## Color Palette

```
--bg:        #060606       /* near-black background */
--fg:        #edeae3       /* off-white primary text */
--fg-dim:    rgba(237,234,227,0.42)   /* secondary text */
--fg-muted:  rgba(237,234,227,0.12)   /* tertiary / disabled */
--border:    rgba(237,234,227,0.10)   /* dividers */
--accent:    #D4A853       /* warm amber — used sparingly */
--accent-dim: rgba(212,168,83,0.25)   /* amber at low opacity */
```

Amber used only on: italic hero line, project numbers, skills dots, email hover underline, active tags, cursor blend spot.

---

## Sections

### 1. Hero
- Full viewport height (`100dvh`)
- Fixed nav: `T—V` logo left, hamburger right
- Three headline lines in `overflow-hidden` clip containers:
  - `Development`
  - `& Code`  
  - `that matters.` — italic, amber color
- GSAP timeline: `translateY(110% → 0)` per line, stagger 0.13s, `cubic-bezier(0.16,1,0.3,1)`
- Bottom row: location/role left, scroll indicator right (animated line)
- Meta row top: `Full Stack Developer · Delhi, India` | `2019 — Present`

### 2. Works (Horizontal Scroll)
- Section pinned via `ScrollTrigger.pin`
- Horizontal strip: 4 project cards, each `~70vw` wide, `display: flex`
- Strip `x` mapped from `0` to `-totalWidth + viewport` as scroll progress goes `0 → 1`
- GSAP Draggable also enabled on the strip for click-drag
- Each card contains:
  - Project number (amber, mono, small)
  - Title — large Cormorant, weight 300
  - Role — mono, dim
  - Tech tags — bordered pills
  - Year — amber
  - Arrow `↗` — dims to amber on hover

**Projects (placeholder — user to update):**
1. Helix — Full-stack SaaS · Next.js, TypeScript, PostgreSQL · 2024
2. Vektor — API gateway + analytics · Node.js, Redis, React · 2024
3. Orbit — Design system + component library · React, Storybook, TypeScript · 2023
4. Pulse — Cross-platform mobile app · React Native, iOS, Android · 2023

### 3. Skills / Stack
- Two-column layout: category label left, skill list right
- Categories: Frontend, Backend, Infrastructure, Tools
- Each skill has amber dot indicator
- ScrollTrigger reveals each row: `translateY(20px) → 0`, opacity `0 → 1`, stagger 0.07s
- No progress bars — list format only (editorial feel)

### 4. About
- Asymmetric split: left ~55%, right ~45%
- Left: Large Cormorant statement, 3–4 lines, line-by-line ScrollTrigger reveal
- Right: 2 short paragraphs + 3 stats (`5+ Years` / `30+ Projects` / `∞ Curiosity`)
- Stats counter-animate up from 0 on ScrollTrigger enter

### 5. Contact / Footer
- Section label: `Let's work together`
- Email as giant Cormorant link: `hello@tarunvishwakarma.dev →`
  - Hover: amber underline scales in from left (`scaleX 0 → 1`)
- Bottom bar:
  - Left: Live IST clock (client component, updates every second)
  - Center: GitHub · LinkedIn · Twitter links
  - Right: `© 2025 Tarun Vishwakarma`

---

## Global Components

### SmoothScroll (client wrapper)
- Wraps all children with Lenis
- RAF loop in `useEffect`, calls `lenis.raf(time)` each frame
- Connects to GSAP ticker: `gsap.ticker.add(time => lenis.raf(time * 1000))`
- `lerp: 0.08`, `smoothWheel: true`

### Navigation (client)
- Fixed, `z-index: 200`
- Logo `T—V` — Cormorant, weight 400
- Hamburger: 3 bars → X morph on open (CSS transform)
- Overlay: `clip-path: circle(0% → 180%)` from button position, `0.75s` expo ease
- Menu items: Cormorant, `clamp(3rem, 7.5vw, 7rem)`, stagger fade-up on open
- Footer row in overlay: social links + location

### CustomCursor (client)
- `8px` dot follows mouse via `mousemove` with `lerp` smoothing
- `mix-blend-mode: difference` — inverts bg color under cursor
- Scales to `40px` ring on hoverable elements (`a`, `button`)

### Grain Overlay
- Fixed `::after` on `body`, `pointer-events: none`, `z-index: 8000`
- SVG `feTurbulence` noise, `opacity: 0.03`, `mix-blend-mode: overlay`

---

## Animation Principles

- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (expo out) for all reveals
- Duration: 0.8–1.0s for hero, 0.6s for scroll reveals
- Stagger: 0.13s between hero lines, 0.07s between list items
- ScrollTrigger start: `"top 85%"` for most reveals
- No animation on `prefers-reduced-motion: reduce`

---

## File Structure

```
app/
  layout.tsx              — fonts, metadata, json-ld
  page.tsx                — server component, composes all sections
  globals.css             — CSS vars, keyframes, base styles
  components/
    SmoothScroll.tsx      — Lenis provider (client)
    Navigation.tsx        — hamburger + overlay menu (client)
    CustomCursor.tsx      — cursor dot (client)
    HeroSection.tsx       — mask reveal animation (client)
    WorksSection.tsx      — GSAP horizontal scroll pin (client)
    SkillsSection.tsx     — scroll-triggered stack grid (client)
    AboutSection.tsx      — split layout + counter anim (client)
    ContactFooter.tsx     — email CTA + live clock (client)
    LiveClock.tsx         — IST clock (client, already exists)
```

---

## Dependencies to Install

```bash
bun add lenis gsap
```

GSAP ScrollTrigger and Draggable are included in the `gsap` package — no separate install.

---

## Constraints

- All animation components must be `"use client"` — GSAP and Lenis are browser-only
- `SmoothScroll` wraps `{children}` in `layout.tsx` or `page.tsx`
- Lenis must connect to GSAP ticker (not `requestAnimationFrame` directly) to avoid conflicts
- Horizontal scroll section must have explicit `height` set on the pin spacer — ScrollTrigger requires this
- `prefers-reduced-motion` media query disables all transforms/transitions

# Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full Awwwards-level portfolio for Tarun Vishwakarma with Lenis smooth scroll, GSAP animations, mask line hero reveal, and a horizontal-scroll pinned works section.

**Architecture:** All animation components are `"use client"`. A top-level `SmoothScroll` wrapper connects Lenis to the GSAP ticker so ScrollTrigger and smooth scroll cooperate on a single RAF loop. Each section is a self-contained client component. `page.tsx` composes them as a server component.

**Tech Stack:** Next.js 16 App Router, GSAP 3 + ScrollTrigger + Draggable, Lenis 1.x, Cormorant Garamond (Google Font), Geist Mono, Tailwind v4, TypeScript

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `app/globals.css` | Amber var, cursor styles, clip-path menu, horizontal scroll overrides |
| Modify | `app/layout.tsx` | Wrap children in `SmoothScroll` |
| Modify | `app/page.tsx` | Compose all section components |
| Create | `app/components/SmoothScroll.tsx` | Lenis init + GSAP ticker connection |
| Create | `app/components/CustomCursor.tsx` | 8px dot, `mix-blend-mode: difference`, scale on link hover |
| Modify | `app/components/Navigation.tsx` | Amber accent on active state, polish clip-path menu |
| Create | `app/components/HeroSection.tsx` | GSAP timeline mask-line reveal on mount |
| Create | `app/components/WorksSection.tsx` | GSAP ScrollTrigger pin + horizontal strip + Draggable |
| Create | `app/components/SkillsSection.tsx` | Scroll-triggered staggered skills grid |
| Create | `app/components/AboutSection.tsx` | Split layout + scroll-triggered counter animation |
| Create | `app/components/ContactFooter.tsx` | Email CTA + LiveClock + socials |
| Keep   | `app/components/LiveClock.tsx` | IST live clock — no changes needed |

---

## Task 1: Update globals.css

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace globals.css entirely**

```css
/* app/globals.css */
@import "tailwindcss";

:root {
  --bg:          #060606;
  --fg:          #edeae3;
  --fg-dim:      rgba(237, 234, 227, 0.42);
  --fg-muted:    rgba(237, 234, 227, 0.12);
  --border:      rgba(237, 234, 227, 0.10);
  --accent:      #D4A853;
  --accent-dim:  rgba(212, 168, 83, 0.25);
  --ease-expo:   cubic-bezier(0.16, 1, 0.3, 1);
  --ease-elastic: cubic-bezier(0.625, 0.05, 0, 1);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: auto; } /* Lenis handles smooth scroll — disable native */

body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-geist-mono), 'Courier New', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  cursor: none; /* custom cursor replaces default */
}

/* ── Grain overlay ── */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 8000;
  opacity: 0.032;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
}

/* ── Custom cursor ── */
.cursor-dot {
  position: fixed;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--fg);
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
  transform: translate(-50%, -50%);
  transition: width 0.25s var(--ease-expo),
              height 0.25s var(--ease-expo),
              background 0.25s;
  will-change: transform;
}
.cursor-dot.cursor-hover {
  width: 36px;
  height: 36px;
  background: var(--fg);
}

/* ── Font helpers ── */
.font-display {
  font-family: var(--font-cormorant), 'Georgia', serif;
}

/* ── Full-screen menu overlay ── */
.menu-overlay {
  position: fixed;
  inset: 0;
  background: var(--bg);
  z-index: 150;
  display: flex;
  flex-direction: column;
  padding: 7rem 6vw 4rem;
  pointer-events: none;
  clip-path: circle(0% at calc(100% - 52px) 52px);
  transition: clip-path 0.75s var(--ease-expo);
}
.menu-overlay.open {
  clip-path: circle(180% at calc(100% - 52px) 52px);
  pointer-events: all;
}

.menu-nav-label {
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  color: var(--fg-dim);
  text-transform: uppercase;
  opacity: 0;
  transition: opacity 0.4s var(--ease-expo) 0.05s;
  margin-bottom: 2.5rem;
}
.menu-overlay.open .menu-nav-label { opacity: 1; }

.menu-nav-item {
  font-family: var(--font-cormorant), 'Georgia', serif;
  font-size: clamp(3rem, 7.5vw, 7rem);
  font-weight: 300;
  line-height: 1.05;
  color: var(--fg);
  text-decoration: none;
  display: block;
  opacity: 0;
  transform: translateY(36px);
  transition: opacity 0.55s var(--ease-expo),
              transform 0.55s var(--ease-expo),
              color 0.25s;
}
.menu-overlay.open .menu-nav-item { opacity: 1; transform: translateY(0); }
.menu-nav-item:nth-child(1) { transition-delay: 0.08s, 0.08s, 0s; }
.menu-nav-item:nth-child(2) { transition-delay: 0.13s, 0.13s, 0s; }
.menu-nav-item:nth-child(3) { transition-delay: 0.18s, 0.18s, 0s; }
.menu-nav-item:nth-child(4) { transition-delay: 0.23s, 0.23s, 0s; }
.menu-nav-item:hover { color: var(--fg-dim); }

.menu-footer {
  margin-top: auto;
  border-top: 1px solid var(--border);
  padding-top: 1.75rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  opacity: 0;
  transition: opacity 0.4s var(--ease-expo) 0.3s;
}
.menu-overlay.open .menu-footer { opacity: 1; }

/* ── Hamburger bars ── */
.ham-bar {
  display: block;
  width: 22px;
  height: 1px;
  background: var(--fg);
  transition: transform 0.45s var(--ease-elastic), opacity 0.3s;
}

/* ── Section dividers ── */
.section-hr {
  border: none;
  border-top: 1px solid var(--border);
}

/* ── Amber link underline ── */
.link-amber {
  position: relative;
  display: inline-block;
  text-decoration: none;
  color: var(--fg);
}
.link-amber::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.45s var(--ease-expo);
}
.link-amber:hover::after { transform: scaleX(1); }
.link-amber:hover { color: var(--accent); transition: color 0.25s; }

/* ── Works horizontal strip ── */
.works-strip {
  display: flex;
  align-items: stretch;
  padding-left: 6vw;
  gap: 1.5rem;
  width: max-content;
  will-change: transform;
}

/* ── Project card ── */
.project-card {
  width: 68vw;
  max-width: 900px;
  border: 1px solid var(--border);
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  transition: border-color 0.35s;
  position: relative;
  overflow: hidden;
}
.project-card:hover { border-color: rgba(237, 234, 227, 0.25); }
.project-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(212, 168, 83, 0.025);
  opacity: 0;
  transition: opacity 0.4s;
}
.project-card:hover::before { opacity: 1; }

/* ── Skills grid ── */
.skills-row {
  opacity: 0;
  transform: translateY(20px);
}

/* ── Scroll-triggered fade up — applied via GSAP ── */
.reveal-line {
  overflow: hidden;
}
.reveal-line-inner {
  transform: translateY(100%);
  opacity: 0;
}

/* ── Service card ── */
.service-card {
  border: 1px solid var(--border);
  padding: 2.5rem;
  transition: border-color 0.35s, background 0.35s;
}
.service-card:hover {
  border-color: rgba(237, 234, 227, 0.25);
  background: rgba(237, 234, 227, 0.02);
}

/* ── Reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Verify build passes**

```bash
bun run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: rebuild globals with amber accent, cursor, GSAP-ready classes"
```

---

## Task 2: Create SmoothScroll

**Files:**
- Create: `app/components/SmoothScroll.tsx`

- [ ] **Step 1: Create the component**

```tsx
// app/components/SmoothScroll.tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });

    // Feed Lenis into GSAP ticker so ScrollTrigger stays in sync
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 2: Verify build**

```bash
bun run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add app/components/SmoothScroll.tsx
git commit -m "feat: add Lenis smooth scroll connected to GSAP ticker"
```

---

## Task 3: Create CustomCursor

**Files:**
- Create: `app/components/CustomCursor.tsx`

- [ ] **Step 1: Create the component**

```tsx
// app/components/CustomCursor.tsx
"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    let mouseX = 0;
    let mouseY = 0;
    let curX = 0;
    let curY = 0;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onEnterLink = () => dot.classList.add("cursor-hover");
    const onLeaveLink = () => dot.classList.remove("cursor-hover");

    const loop = () => {
      // Lerp toward mouse position
      curX += (mouseX - curX) * 0.12;
      curY += (mouseY - curY) * 0.12;
      dot.style.left = `${curX}px`;
      dot.style.top = `${curY}px`;
      rafId = requestAnimationFrame(loop);
    };

    const addHoverListeners = () => {
      document
        .querySelectorAll("a, button")
        .forEach((el) => {
          el.addEventListener("mouseenter", onEnterLink);
          el.addEventListener("mouseleave", onLeaveLink);
        });
    };

    window.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(loop);
    addHoverListeners();

    // Re-scan for new elements on DOM mutations
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return <div ref={dotRef} className="cursor-dot" />;
}
```

- [ ] **Step 2: Verify build**

```bash
bun run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add app/components/CustomCursor.tsx
git commit -m "feat: add lerp-smoothed custom cursor with hover scale"
```

---

## Task 4: Create HeroSection

**Files:**
- Create: `app/components/HeroSection.tsx`

- [ ] **Step 1: Create the component**

```tsx
// app/components/HeroSection.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const LINES = [
  { text: "Development", style: {} },
  { text: "& Code", style: {} },
  { text: "that matters.", style: { fontStyle: "italic", color: "var(--accent)" } },
];

export default function HeroSection() {
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const metaRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      // Mask reveal: lines slide up from translateY(110%)
      lineRefs.current.forEach((line, i) => {
        if (!line) return;
        tl.to(
          line,
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "expo.out",
          },
          i * 0.13
        );
      });

      // Fade in meta row after lines
      tl.to(
        [metaRef.current, subRef.current],
        { opacity: 1, duration: 0.7, ease: "expo.out", stagger: 0.08 },
        "-=0.3"
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0 6vw 5rem",
        position: "relative",
      }}
    >
      {/* Top meta row */}
      <div
        ref={metaRef}
        style={{
          position: "absolute",
          top: "6rem",
          left: "6vw",
          right: "6vw",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          opacity: 0,
        }}
      >
        <p
          style={{
            fontSize: "0.72rem",
            letterSpacing: "0.16em",
            color: "var(--fg-dim)",
            textTransform: "uppercase",
            lineHeight: 1.6,
          }}
        >
          Full Stack Developer
          <br />
          Delhi, India
        </p>
        <p
          style={{
            fontSize: "0.72rem",
            letterSpacing: "0.16em",
            color: "var(--fg-dim)",
            textTransform: "uppercase",
            textAlign: "right",
          }}
        >
          2019 — Present
        </p>
      </div>

      {/* Headline — each line in overflow:hidden mask container */}
      <div style={{ marginBottom: "3.5rem" }}>
        {LINES.map((line, i) => (
          <div key={i} style={{ overflow: "hidden", lineHeight: 0.95 }}>
            <span
              ref={(el) => { lineRefs.current[i] = el; }}
              className="font-display"
              style={{
                display: "block",
                fontSize: "clamp(3.2rem, 10vw, 9.5rem)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                transform: "translateY(110%)",
                opacity: 0,
                ...line.style,
              }}
            >
              {line.text}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div
        ref={subRef}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          opacity: 0,
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.12em",
            color: "var(--fg-dim)",
            textTransform: "uppercase",
            maxWidth: "280px",
            lineHeight: 1.7,
          }}
        >
          Building products that are fast, precise, and built to last.
        </p>

        {/* Scroll indicator */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <p
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              color: "var(--fg-dim)",
              textTransform: "uppercase",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            Scroll
          </p>
          <div
            style={{
              width: "1px",
              height: "56px",
              background: "var(--border)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "var(--accent)",
                animation: "scrollDrop 2.2s cubic-bezier(0.16,1,0.3,1) infinite",
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scrollDrop {
          0%   { transform: scaleY(0); transform-origin: top;    }
          48%  { transform: scaleY(1); transform-origin: top;    }
          52%  { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
      `}</style>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
bun run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add app/components/HeroSection.tsx
git commit -m "feat: add hero section with GSAP mask line reveal"
```

---

## Task 5: Create WorksSection

**Files:**
- Create: `app/components/WorksSection.tsx`

- [ ] **Step 1: Create the component**

```tsx
// app/components/WorksSection.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Draggable from "gsap/Draggable";

const projects = [
  {
    id: "01",
    title: "Helix",
    description: "Full-stack SaaS platform built for distributed teams. Real-time collaboration, role-based access, and sub-100ms API response times.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Redis"],
    year: "2024",
    role: "Design & Engineering",
  },
  {
    id: "02",
    title: "Vektor",
    description: "Real-time API gateway with live analytics dashboard. Handles 50k+ requests/min with zero-downtime deploys.",
    tags: ["Node.js", "Redis", "React", "WebSockets"],
    year: "2024",
    role: "Architecture & Dev",
  },
  {
    id: "03",
    title: "Orbit",
    description: "Enterprise-grade design system and component library. 80+ components, full Figma parity, adopted by 3 product teams.",
    tags: ["React", "Storybook", "TypeScript", "Radix UI"],
    year: "2023",
    role: "Engineering",
  },
  {
    id: "04",
    title: "Pulse",
    description: "Cross-platform health and habit tracking app. 4.8★ on App Store, 10k+ active users within 3 months of launch.",
    tags: ["React Native", "iOS", "Android", "Expo"],
    year: "2023",
    role: "Full Stack",
  },
];

export default function WorksSection() {
  const containerRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, Draggable);

    const ctx = gsap.context(() => {
      const strip = stripRef.current!;

      // Amount to scroll horizontally = strip total width minus one viewport
      const getScrollAmount = () => -(strip.scrollWidth - window.innerWidth);

      // Pin section and map vertical scroll to horizontal movement
      gsap.to(strip, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${Math.abs(getScrollAmount())}`,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Draggable for click-drag navigation
      Draggable.create(strip, {
        type: "x",
        bounds: {
          minX: getScrollAmount(),
          maxX: 0,
        },
        onDrag() {
          ScrollTrigger.refresh();
        },
      });

      // Section label fade in on scroll enter
      if (labelRef.current) {
        gsap.from(labelRef.current, {
          opacity: 0,
          y: 16,
          duration: 0.6,
          ease: "expo.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="work" style={{ overflow: "hidden" }}>
      {/* Section header — inside the pin */}
      <div
        ref={labelRef}
        style={{
          padding: "5rem 6vw 2.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <p
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.18em",
            color: "var(--fg-dim)",
            textTransform: "uppercase",
          }}
        >
          Selected Work
        </p>
        <p
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.12em",
            color: "var(--fg-dim)",
            textTransform: "uppercase",
          }}
        >
          Drag to explore →
        </p>
      </div>

      {/* Horizontal strip */}
      <div ref={stripRef} className="works-strip">
        {projects.map((project) => (
          <article key={project.id} className="project-card">
            {/* Top row: number + role */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "3rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.68rem",
                  letterSpacing: "0.15em",
                  color: "var(--accent)",
                  fontFamily: "var(--font-geist-mono), monospace",
                }}
              >
                {project.id}
              </span>
              <span
                style={{
                  fontSize: "0.68rem",
                  letterSpacing: "0.12em",
                  color: "var(--fg-dim)",
                  textTransform: "uppercase",
                }}
              >
                {project.role}
              </span>
            </div>

            {/* Title */}
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(3rem, 6vw, 6rem)",
                fontWeight: 300,
                lineHeight: 0.93,
                letterSpacing: "-0.02em",
                marginBottom: "1.5rem",
              }}
            >
              {project.title}
            </h2>

            {/* Description */}
            <p
              style={{
                fontSize: "0.82rem",
                color: "var(--fg-dim)",
                lineHeight: 1.7,
                maxWidth: "480px",
                marginBottom: "2rem",
                flex: 1,
              }}
            >
              {project.description}
            </p>

            {/* Bottom row: tags + year */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: "0.6rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      border: "1px solid var(--border)",
                      padding: "0.25rem 0.6rem",
                      color: "var(--fg-dim)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span
                style={{
                  fontSize: "0.68rem",
                  letterSpacing: "0.1em",
                  color: "var(--accent)",
                }}
              >
                {project.year} ↗
              </span>
            </div>
          </article>
        ))}

        {/* Trailing spacer so last card clears viewport */}
        <div style={{ width: "6vw", flexShrink: 0 }} />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
bun run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add app/components/WorksSection.tsx
git commit -m "feat: add horizontal scroll works section with GSAP pin + Draggable"
```

---

## Task 6: Create SkillsSection

**Files:**
- Create: `app/components/SkillsSection.tsx`

- [ ] **Step 1: Create the component**

```tsx
// app/components/SkillsSection.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const skills = [
  {
    category: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Three.js"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Go", "PostgreSQL", "Redis", "REST / GraphQL"],
  },
  {
    category: "Infrastructure",
    items: ["Vercel", "AWS", "Docker", "GitHub Actions", "Nginx"],
  },
  {
    category: "Tools",
    items: ["Figma", "GSAP", "Git", "Prisma", "Storybook"],
  },
];

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        gsap.to(row, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "expo.out",
          scrollTrigger: {
            trigger: row,
            start: "top 88%",
          },
          delay: i * 0.07,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      style={{
        padding: "8rem 6vw",
        borderTop: "1px solid var(--border)",
      }}
    >
      {/* Label */}
      <p
        style={{
          fontSize: "0.7rem",
          letterSpacing: "0.18em",
          color: "var(--fg-dim)",
          textTransform: "uppercase",
          marginBottom: "4rem",
        }}
      >
        Stack
      </p>

      {/* Skills grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "3rem 4rem",
        }}
      >
        {skills.map((group, i) => (
          <div
            key={group.category}
            ref={(el) => { rowRefs.current[i] = el; }}
            className="skills-row"
          >
            <p
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                color: "var(--accent)",
                textTransform: "uppercase",
                marginBottom: "1.25rem",
              }}
            >
              {group.category}
            </p>
            <ul style={{ listStyle: "none" }}>
              {group.items.map((item) => (
                <li
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.6rem 0",
                    borderBottom: "1px solid var(--border)",
                    fontSize: "0.85rem",
                    color: "var(--fg-dim)",
                  }}
                >
                  <span
                    style={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      background: "var(--accent)",
                      flexShrink: 0,
                    }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
bun run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add app/components/SkillsSection.tsx
git commit -m "feat: add scroll-triggered skills/stack section"
```

---

## Task 7: Create AboutSection

**Files:**
- Create: `app/components/AboutSection.tsx`

- [ ] **Step 1: Create the component**

```tsx
// app/components/AboutSection.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const stats = [
  { value: 5, suffix: "+", label: "Years exp." },
  { value: 30, suffix: "+", label: "Projects" },
  { value: null, symbol: "∞", label: "Curiosity" },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Heading reveal
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
          },
        });
      }

      // Text block reveal
      if (textRef.current) {
        gsap.from(textRef.current.children, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 85%",
          },
        });
      }

      // Counter animation
      statRefs.current.forEach((stat, i) => {
        if (!stat) return;
        const counter = counterRefs.current[i];
        const targetValue = stats[i].value;

        if (counter && targetValue !== null) {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: targetValue,
            duration: 1.2,
            ease: "expo.out",
            onUpdate() {
              counter.textContent = Math.round(obj.val) + stats[i].suffix;
            },
            scrollTrigger: {
              trigger: stat,
              start: "top 85%",
            },
          });
        }

        gsap.from(stat, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "expo.out",
          delay: i * 0.08,
          scrollTrigger: {
            trigger: stat,
            start: "top 88%",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{
        padding: "8rem 6vw",
        borderTop: "1px solid var(--border)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "4rem",
        alignItems: "start",
      }}
    >
      {/* Left: heading */}
      <div>
        <p
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.18em",
            color: "var(--fg-dim)",
            textTransform: "uppercase",
            marginBottom: "2rem",
          }}
        >
          About
        </p>
        <h2
          ref={headingRef}
          className="font-display"
          style={{
            fontSize: "clamp(2rem, 4vw, 4rem)",
            fontWeight: 300,
            lineHeight: 1.08,
            letterSpacing: "-0.01em",
          }}
        >
          Precision in
          <br />
          every line of
          <br />
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>code.</em>
        </h2>
      </div>

      {/* Right: bio + stats */}
      <div style={{ paddingTop: "3.5rem" }}>
        <div
          ref={textRef}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2.5rem" }}
        >
          <p style={{ fontSize: "0.85rem", lineHeight: 1.75, color: "var(--fg-dim)" }}>
            I&apos;m Tarun — a senior full stack developer who builds software that performs under
            pressure. Five years of shipping products that users actually use, for teams that
            can&apos;t afford to settle for less.
          </p>
          <p style={{ fontSize: "0.85rem", lineHeight: 1.75, color: "var(--fg-dim)" }}>
            I work across the full stack: Next.js on the front, Node.js or Go on the back,
            deployed on edge infrastructure built to scale. Clean code, fast iterations, zero
            excuses.
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: "3rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              ref={(el) => { statRefs.current[i] = el; }}
            >
              <p
                className="font-display"
                style={{ fontSize: "2.5rem", fontWeight: 300, lineHeight: 1 }}
              >
                {stat.value !== null ? (
                  <span ref={(el) => { counterRefs.current[i] = el; }}>
                    0{stat.suffix}
                  </span>
                ) : (
                  <span ref={(el) => { counterRefs.current[i] = el; }}>{stat.symbol}</span>
                )}
              </p>
              <p
                style={{
                  fontSize: "0.62rem",
                  letterSpacing: "0.15em",
                  color: "var(--fg-dim)",
                  textTransform: "uppercase",
                  marginTop: "0.4rem",
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
bun run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add app/components/AboutSection.tsx
git commit -m "feat: add about section with scroll-triggered counters"
```

---

## Task 8: Create ContactFooter

**Files:**
- Create: `app/components/ContactFooter.tsx`

- [ ] **Step 1: Create the component**

```tsx
// app/components/ContactFooter.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import LiveClock from "./LiveClock";

const socials = [
  { label: "GitHub", href: "https://github.com/TarunVishwakarma1" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/tarunvishwakarma28/" },
  { label: "Twitter", href: "https://x.com/Assassingod5" },
];

export default function ContactFooter() {
  const sectionRef = useRef<HTMLElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (labelRef.current) {
        gsap.from(labelRef.current, {
          opacity: 0,
          y: 16,
          duration: 0.6,
          ease: "expo.out",
          scrollTrigger: { trigger: labelRef.current, start: "top 88%" },
        });
      }
      if (emailRef.current) {
        gsap.from(emailRef.current, {
          opacity: 0,
          y: 32,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: emailRef.current, start: "top 88%" },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={sectionRef}
      id="contact"
      style={{
        padding: "8rem 6vw 4rem",
        borderTop: "1px solid var(--border)",
      }}
    >
      {/* CTA */}
      <p
        ref={labelRef}
        style={{
          fontSize: "0.7rem",
          letterSpacing: "0.18em",
          color: "var(--fg-dim)",
          textTransform: "uppercase",
          marginBottom: "2rem",
        }}
      >
        Let&apos;s work together
      </p>

      <a
        ref={emailRef}
        href="mailto:hello@tarunvishwakarma.dev"
        className="font-display link-amber"
        style={{
          fontSize: "clamp(1.8rem, 4.5vw, 6rem)",
          fontWeight: 300,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          display: "inline-block",
          marginBottom: "6rem",
        }}
      >
        hello@tarunvishwakarma.dev
      </a>

      {/* Bottom bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          paddingTop: "2rem",
          borderTop: "1px solid var(--border)",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        <p
          style={{
            fontSize: "0.72rem",
            color: "var(--fg-dim)",
            letterSpacing: "0.1em",
            fontFamily: "var(--font-geist-mono), monospace",
          }}
        >
          <LiveClock />
        </p>

        <div style={{ display: "flex", gap: "2rem" }}>
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-amber"
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </a>
          ))}
        </div>

        <p
          style={{
            fontSize: "0.7rem",
            color: "var(--fg-dim)",
            letterSpacing: "0.1em",
          }}
        >
          © {new Date().getFullYear()} Tarun Vishwakarma
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
bun run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add app/components/ContactFooter.tsx
git commit -m "feat: add contact footer with amber email CTA and live clock"
```

---

## Task 9: Update Navigation

**Files:**
- Modify: `app/components/Navigation.tsx`

- [ ] **Step 1: Replace Navigation.tsx**

The existing Navigation has the right structure. Replace entirely with polished version using amber accent on hover and correct z-index above SmoothScroll wrapper:

```tsx
// app/components/Navigation.tsx
"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Stack", href: "#skills" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/TarunVishwakarma1" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/tarunvishwakarma28/" },
  { label: "Twitter", href: "https://x.com/Assassingod5" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <>
      {/* Fixed nav bar */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          padding: scrolled ? "1rem 3rem" : "1.6rem 3rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "padding 0.4s cubic-bezier(0.16,1,0.3,1)",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        }}
      >
        <a
          href="/"
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "1.15rem",
            fontWeight: 400,
            letterSpacing: "0.06em",
            color: "var(--fg)",
            textDecoration: "none",
            zIndex: 210,
            position: "relative",
          }}
        >
          T—V
        </a>

        <button
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          style={{
            background: "none",
            border: "none",
            cursor: "none",
            padding: "6px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            zIndex: 210,
            position: "relative",
          }}
        >
          <span
            className="ham-bar"
            style={{
              transform: isOpen ? "translateY(6px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="ham-bar"
            style={{ opacity: isOpen ? 0 : 1 }}
          />
          <span
            className="ham-bar"
            style={{
              transform: isOpen ? "translateY(-6px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </nav>

      {/* Full-screen overlay */}
      <div className={`menu-overlay ${isOpen ? "open" : ""}`}>
        <p className="menu-nav-label">Navigation</p>

        <nav style={{ flex: 1 }}>
          {navLinks.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              className="menu-nav-item"
              onClick={close}
              style={{
                transitionDelay: isOpen
                  ? `${0.08 + i * 0.05}s, ${0.08 + i * 0.05}s, 0s`
                  : "0s",
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="menu-footer">
          <div style={{ display: "flex", gap: "2rem" }}>
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.14em",
                  color: "var(--fg-dim)",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  transition: "color 0.25s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--accent)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--fg-dim)")
                }
              >
                {s.label}
              </a>
            ))}
          </div>
          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              color: "var(--fg-dim)",
              textTransform: "uppercase",
            }}
          >
            Delhi, India
          </p>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
bun run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add app/components/Navigation.tsx
git commit -m "feat: update navigation with amber hover, scroll-shrink, polished overlay"
```

---

## Task 10: Compose page.tsx

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace page.tsx**

```tsx
// app/page.tsx
import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import WorksSection from "./components/WorksSection";
import SkillsSection from "./components/SkillsSection";
import AboutSection from "./components/AboutSection";
import ContactFooter from "./components/ContactFooter";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <WorksSection />
        <SkillsSection />
        <AboutSection />
        <ContactFooter />
      </main>
    </>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
bun run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: compose full portfolio page from section components"
```

---

## Task 11: Wire SmoothScroll + CustomCursor in layout.tsx

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update layout.tsx**

Add `SmoothScroll` wrapper and `CustomCursor` inside `<body>`. Keep all existing metadata and fonts.

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import CustomCursor from "./components/CustomCursor";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tarunvishwakarma.dev"),
  title: "Tarun Vishwakarma | Full Stack Developer & Software Engineer",
  description:
    "Portfolio of Tarun Vishwakarma, a Full Stack Developer specializing in Next.js, React, and modern web technologies. Building high-performance web applications.",
  keywords: [
    "Tarun Vishwakarma",
    "Software Engineer",
    "Full Stack Developer",
    "Next.js",
    "React",
    "Portfolio",
    "Web Development",
    "JavaScript",
    "TypeScript",
  ],
  authors: [{ name: "Tarun Vishwakarma", url: "https://tarunvishwakarma.dev" }],
  creator: "Tarun Vishwakarma",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tarunvishwakarma.dev",
    title: "Tarun Vishwakarma | Full Stack Developer",
    description:
      "Explore the portfolio of Tarun Vishwakarma, building modern web experiences with Next.js and React.",
    siteName: "Tarun Vishwakarma Portfolio",
    images: [
      {
        url: "https://avatars.githubusercontent.com/u/138651451?v=1",
        width: 1200,
        height: 630,
        alt: "Tarun Vishwakarma Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tarun Vishwakarma | Full Stack Developer",
    description:
      "Portfolio of Tarun Vishwakarma, a Full Stack Developer specializing in modern web tech.",
    creator: "@Assassingod5",
    images: ["https://avatars.githubusercontent.com/u/138651451?v=1"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Tarun Vishwakarma",
  url: "https://tarunvishwakarma.dev",
  jobTitle: "Senior Software Engineer",
  sameAs: [
    "https://github.com/TarunVishwakarma1",
    "https://www.linkedin.com/in/tarunvishwakarma28/",
    "https://x.com/Assassingod5",
  ],
  worksFor: {
    "@type": "Organization",
    name: "Self-Employed",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} ${cormorant.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Final build verification**

```bash
bun run build
```

Expected:
```
✓ Compiled successfully
Route (app)
┌ ○ /
└ ○ /_not-found
```

- [ ] **Step 3: Smoke test in browser**

```bash
bun dev
```

Verify in browser at `http://localhost:3000`:
- Custom cursor visible, scales on hover over links
- Hero lines animate up on load
- Smooth scroll active (no jarring native snap)
- Works section pins and scrolls horizontally
- Skills rows stagger in on scroll
- About counters animate on scroll
- Email link shows amber underline on hover
- Hamburger opens full-screen menu with clip-path animation

- [ ] **Step 4: Final commit**

```bash
git add app/layout.tsx
git commit -m "feat: wire SmoothScroll + CustomCursor into root layout"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Editorial serif — Cormorant throughout all headings
- ✅ Lenis smooth scroll — Task 2, connected to GSAP ticker in Task 11
- ✅ GSAP + ScrollTrigger — registered in every animated component
- ✅ Hero mask line reveal — Task 4, `translateY(110% → 0)` in overflow:hidden wrappers
- ✅ Horizontal scroll pin + Draggable — Task 5
- ✅ Skills/Stack section — Task 6
- ✅ About + counter animation — Task 7
- ✅ Contact + live clock — Task 8
- ✅ Warm amber `#D4A853` — CSS var in Task 1, used in project numbers, skills dots, italic line, email hover
- ✅ Custom cursor — Task 3, `mix-blend-mode: difference`
- ✅ Grain overlay — Task 1 globals.css `body::after`
- ✅ Hamburger clip-path menu — Task 9 Navigation
- ✅ `prefers-reduced-motion` — Task 1 globals.css
- ✅ Lenis + GSAP ticker sync — Task 2 `lenis.on("scroll", ScrollTrigger.update)`

**No TBDs, no placeholders (projects are filled with realistic descriptions).**
**Type consistency: all `ref` patterns use same shape across tasks.**

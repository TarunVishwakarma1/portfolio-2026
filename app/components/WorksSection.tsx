// app/components/WorksSection.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

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
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const strip = stripRef.current!;

      const getScrollAmount = () => -(strip.scrollWidth - window.innerWidth);

      // Pin + horizontal scroll via ScrollTrigger (owns x entirely)
      gsap.to(strip, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          id: "works-h",
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${Math.abs(getScrollAmount())}`,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Section label fade in
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

    // ── Pointer drag → scroll with inertia
    // Drag controls scroll position; ScrollTrigger derives x from scroll (no conflict).
    const strip = stripRef.current!;
    let dragStartX = 0;
    let dragStartScroll = 0;
    let dragging = false;
    let lastScrollTarget = 0;
    let lastMoveTime = 0;
    let scrollVelocity = 0; // px/ms — used for inertia on release

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      dragStartX = e.clientX;
      dragStartScroll = window.scrollY;
      lastScrollTarget = window.scrollY;
      lastMoveTime = performance.now();
      scrollVelocity = 0;
      strip.setPointerCapture(e.pointerId);
      strip.style.cursor = "grabbing";
      window.__lenis?.stop();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const st = ScrollTrigger.getById("works-h");
      if (!st) return;

      const dx = dragStartX - e.clientX;
      const scrollRange = st.end - st.start;
      const horizTotal = Math.abs(strip.scrollWidth - window.innerWidth);
      const ratio = horizTotal > 0 ? scrollRange / horizTotal : 1;
      const target = Math.max(st.start, Math.min(st.end, dragStartScroll + dx * ratio));

      // Track scroll velocity for inertia
      const now = performance.now();
      const dt = now - lastMoveTime;
      if (dt > 0) scrollVelocity = (target - lastScrollTarget) / dt;
      lastScrollTarget = target;
      lastMoveTime = now;

      window.scrollTo({ top: target, behavior: "instant" as ScrollBehavior });
    };

    const onPointerUp = () => {
      if (!dragging) return;
      dragging = false;
      strip.style.cursor = "grab";

      const st = ScrollTrigger.getById("works-h");
      window.__lenis?.start();

      // Project velocity forward → smooth deceleration via Lenis
      if (st && Math.abs(scrollVelocity) > 0.05) {
        const inertiaTarget = Math.max(
          st.start,
          Math.min(st.end, window.scrollY + scrollVelocity * 380)
        );
        const duration = Math.min(1.4, 0.25 + Math.abs(scrollVelocity) * 0.6);
        window.__lenis?.scrollTo(inertiaTarget, {
          duration,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
        });
      }
    };

    strip.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      ctx.revert();
      strip.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.__lenis?.start();
    };
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
      <div ref={stripRef} className="works-strip" style={{ cursor: "grab" }}>
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

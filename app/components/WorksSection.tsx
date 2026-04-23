// app/components/WorksSection.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
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
    href: "#",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=3840&q=95&auto=format&fit=crop",
  },
  {
    id: "02",
    title: "Vektor",
    description: "Real-time API gateway with live analytics dashboard. Handles 50k+ requests/min with zero-downtime deploys.",
    tags: ["Node.js", "Redis", "React", "WebSockets"],
    year: "2024",
    role: "Architecture & Dev",
    href: "#",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=3840&q=95&auto=format&fit=crop",
  },
  {
    id: "03",
    title: "Orbit",
    description: "Enterprise-grade design system and component library. 80+ components, full Figma parity, adopted by 3 product teams.",
    tags: ["React", "Storybook", "TypeScript", "Radix UI"],
    year: "2023",
    role: "Engineering",
    href: "#",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=3840&q=95&auto=format&fit=crop",
  },
  {
    id: "04",
    title: "Pulse",
    description: "Cross-platform health and habit tracking app. 4.8★ on App Store, 10k+ active users within 3 months of launch.",
    tags: ["React Native", "iOS", "Android", "Expo"],
    year: "2023",
    role: "Full Stack",
    href: "#",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=3840&q=95&auto=format&fit=crop",
  },
];

// scale(1.5) gives 25% overflow on each side.
// At card width 900px: overflow = 225px each side.
// Unidirectional: 0 → +PARALLAX_PX. Images start centered, shift right as cards move left.
const SCALE = 1.5;
const PARALLAX_PX = 200; // stays within 225px overflow budget (25px safety margin)

export default function WorksSection() {
  const containerRef   = useRef<HTMLElement>(null);
  const stripRef       = useRef<HTMLDivElement>(null);
  const labelRef       = useRef<HTMLDivElement>(null);
  const imageRefs      = useRef<(HTMLImageElement | null)[]>([]);
  const cardRefs       = useRef<(HTMLElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  // True if the last pointer action moved enough to count as a drag (suppress click)
  const isDragRef      = useRef(false);
  const [activeCard, setActiveCard] = useState(1);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch       = window.matchMedia("(hover: none), (pointer: coarse)").matches;

    // Set h2 initial state for title reveal (before context so it's always applied)
    if (!reducedMotion) {
      cardRefs.current.forEach((card) => {
        const titleEl = card?.querySelector("h2");
        if (titleEl) gsap.set(titleEl, { y: "110%" });
      });
    }

    // Track which titles have already revealed
    const revealedTitles = new Set<number>();
    // Prevent multiple rAF calls per scroll frame (avoids forced-layout thrashing)
    let revealPending = false;

    const ctx = gsap.context(() => {
      const strip = stripRef.current!;
      const getScrollAmount = () => -(strip.scrollWidth - window.innerWidth);

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
          onUpdate(self) {
            // Image parallax — desktop only (scrubbed transform on every frame is costly on mobile)
            if (!reducedMotion && !isTouch) {
              const shift = self.progress * PARALLAX_PX;
              imageRefs.current.forEach((img) => {
                if (!img) return;
                img.style.transform = `translateX(${shift}px) scale(${SCALE})`;
              });
            }

            // Title micro-reveal — deferred to next rAF to avoid forced-layout (getBoundingClientRect
            // after GSAP's transform write would force synchronous layout recalculation)
            if (!reducedMotion && !revealPending) {
              revealPending = true;
              requestAnimationFrame(() => {
                cardRefs.current.forEach((card, idx) => {
                  if (!card || revealedTitles.has(idx)) return;
                  const rect = card.getBoundingClientRect();
                  if (rect.left < window.innerWidth * 0.88) {
                    revealedTitles.add(idx);
                    const titleEl = card.querySelector("h2");
                    if (titleEl) gsap.to(titleEl, { y: 0, duration: 0.7, ease: "expo.out" });
                  }
                });
                revealPending = false;
              });
            }

            // Progress bar scaleX
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${self.progress})`;
            }

            // Active card counter
            const idx = Math.min(
              projects.length - 1,
              Math.floor(self.progress * projects.length)
            );
            setActiveCard(idx + 1);
          },
        },
      });

      if (labelRef.current && !reducedMotion) {
        gsap.from(labelRef.current, {
          opacity: 0,
          y: 16,
          duration: 0.6,
          ease: "expo.out",
          scrollTrigger: { trigger: containerRef.current, start: "top 90%" },
        });
      }
    }, containerRef);

    // Pointer drag → scroll with inertia
    // touch-action:none on the strip lets pointer events fire on mobile without
    // the browser intercepting them as native scroll
    const strip = stripRef.current!;
    strip.style.touchAction = "none";

    let dragStartX = 0, dragStartScroll = 0, dragging = false;
    let lastScrollTarget = 0, lastMoveTime = 0, scrollVelocity = 0;
    let dragDelta = 0;

    const isTouchPointer = (e: PointerEvent) => e.pointerType === "touch";

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      dragStartX = e.clientX;
      dragStartScroll = window.scrollY;
      lastScrollTarget = window.scrollY;
      lastMoveTime = performance.now();
      scrollVelocity = 0;
      dragDelta = 0;
      isDragRef.current = false;
      strip.setPointerCapture(e.pointerId);
      if (!isTouchPointer(e)) strip.style.cursor = "grabbing";
      window.__lenis?.stop();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const st = ScrollTrigger.getById("works-h");
      if (!st) return;
      const dx = dragStartX - e.clientX;
      dragDelta = Math.abs(dx);
      if (dragDelta > 6) isDragRef.current = true;
      const ratio = (st.end - st.start) / Math.abs(strip.scrollWidth - window.innerWidth) || 1;
      // Touch: slightly higher sensitivity (1.1x) to compensate for finger width
      const sensitivity = isTouchPointer(e) ? 1.1 : 1;
      const target = Math.max(st.start, Math.min(st.end, dragStartScroll + dx * ratio * sensitivity));
      const now = performance.now();
      const dt = now - lastMoveTime;
      if (dt > 0) scrollVelocity = (target - lastScrollTarget) / dt;
      lastScrollTarget = target;
      lastMoveTime = now;
      window.scrollTo({ top: target, behavior: "instant" as ScrollBehavior });
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (!isTouchPointer(e)) strip.style.cursor = "grab";
      window.__lenis?.start();
      const st = ScrollTrigger.getById("works-h");
      // Lower inertia threshold for touch (more responsive flick)
      const inertiaThreshold = isTouchPointer(e) ? 0.02 : 0.05;
      if (st && Math.abs(scrollVelocity) > inertiaThreshold) {
        // Touch gets longer inertia travel (500 vs 380) and slightly longer duration
        const inertiaMultiplier = isTouchPointer(e) ? 500 : 380;
        const inertiaTarget = Math.max(st.start, Math.min(st.end, window.scrollY + scrollVelocity * inertiaMultiplier));
        window.__lenis?.scrollTo(inertiaTarget, {
          duration: Math.min(1.8, 0.3 + Math.abs(scrollVelocity) * 0.7),
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
        });
      }
    };

    strip.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup",    onPointerUp as EventListener);
    window.addEventListener("pointercancel", onPointerUp as EventListener);

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
      <div
        ref={labelRef}
        style={{ padding: "5rem 6vw 2.5rem" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.25rem" }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.18em", color: "var(--fg-dim)", textTransform: "uppercase" }}>
            Selected Work
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <span style={{ fontSize: "0.68rem", letterSpacing: "0.1em", color: "var(--accent)", fontFamily: "var(--font-geist-mono), monospace" }}>
              {String(activeCard).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.12em", color: "var(--fg-dim)", textTransform: "uppercase" }}>
              Drag to explore →
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ width: "100%", height: "1px", background: "var(--border)", position: "relative" }}>
          <div
            ref={progressBarRef}
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--accent)",
              transformOrigin: "left",
              transform: "scaleX(0)",
              transition: "transform 0.05s linear",
            }}
          />
        </div>
      </div>

      <div
        ref={stripRef}
        className="works-strip"
        style={{ cursor: "grab" }}
        onDragStart={(e) => e.preventDefault()}
      >
        {projects.map((project, idx) => (
          <Link
            key={project.id}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            ref={(el) => { cardRefs.current[idx] = el; }}
            className="project-card"
            draggable={false}
            onClick={(e) => {
              if (isDragRef.current) {
                isDragRef.current = false;
                e.preventDefault();
              }
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <span style={{ fontSize: "0.68rem", letterSpacing: "0.15em", color: "var(--accent)", fontFamily: "var(--font-geist-mono), monospace" }}>
                {project.id}
              </span>
              <span style={{ fontSize: "0.68rem", letterSpacing: "0.12em", color: "var(--fg-dim)", textTransform: "uppercase" }}>
                {project.role}
              </span>
            </div>

            {/* overflow:hidden clips the scale(1.5) overflow — no position:absolute needed */}
            <div
              className="project-card-img-wrap"
              style={{ width: "100%", height: "320px", marginBottom: "1.75rem", background: "var(--fg-muted)" }}
            >
              <div className={`img-skeleton${loadedImages[idx] ? " loaded" : ""}`} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={(el) => { imageRefs.current[idx] = el; }}
                src={project.image}
                alt={project.title}
                draggable={false}
                loading={idx === 0 ? "eager" : "lazy"}
                onLoad={() => setLoadedImages((prev) => ({ ...prev, [idx]: true }))}
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  transform: `scale(${SCALE})`,
                  willChange: "transform",
                }}
              />
              <div className="project-card-cta">
                <span className="project-card-cta-label">View Project</span>
                <span className="project-card-cta-arrow">↗</span>
              </div>
            </div>

            {/* overflow:hidden clips the translateY reveal */}
            <div style={{ overflow: "hidden" }}>
              <h2
                className="font-display"
                style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)", fontWeight: 300, lineHeight: 0.93, letterSpacing: "-0.02em", marginBottom: "1.25rem" }}
              >
                {project.title}
              </h2>
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--fg-dim)", lineHeight: 1.7, maxWidth: "480px", marginBottom: "2rem", flex: 1 }}>
              {project.description}
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {project.tags.map((tag) => (
                  <span key={tag} style={{ fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", border: "1px solid var(--border)", padding: "0.25rem 0.6rem", color: "var(--fg-dim)" }}>
                    {tag}
                  </span>
                ))}
              </div>
              <span style={{ fontSize: "0.68rem", letterSpacing: "0.1em", color: "var(--accent)" }}>
                {project.year} ↗
              </span>
            </div>
          </Link>
        ))}

        <div style={{ width: "6vw", flexShrink: 0 }} />
      </div>
    </section>
  );
}

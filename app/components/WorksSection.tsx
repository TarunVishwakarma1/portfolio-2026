// app/components/WorksSection.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";

const projects = [
  {
    id: "01",
    title: "GoTorrent",
    description: "A fast, lightweight cross-platform BitTorrent desktop client built with Go and Fyne. Features drag-and-drop, torrent preview, and robust lifecycle management.",
    tags: ["GoLang", "Fyne"],
    year: "2026",
    role: "Backend & Architecture",
    href: "https://gotorrent.tarunvishwakarma.dev",
    image: "/images/go-torrent.webp",
  },
  {
    id: "02",
    title: "Gormicx",
    description: "Blazingly fast, minimal-footprint ORM for Go. Supports both SQL and NoSQL databases through a unified, pluggable driver interface.",
    tags: ["GoLang", "SQL"],
    year: "2026",
    role: "Database & Programming",
    href: "https://gormicx.tarunvishwakarma.dev",
    image: "/images/gormicx.webp",
  },
  {
    id: "03",
    title: "Stratus Keyboard",
    description: "A premium e-commerce landing page for a high-end mechanical keyboard. Features a sleek, modern design, detailed technical specifications, and a pre-order waitlist system.",
    tags: ["React", "Storybook", "TypeScript", "Radix UI"],
    year: "2025",
    role: "UI/UX & Web",
    href: "https://stratus-keyboard.vercel.app/",
    image: "/images/stratus-keyboard.webp",
  },
  {
    id: "04",
    title: "Matcha Explosion",
    description: "A premium promotional landing page for an artisanal iced matcha espresso. Features a rich, dark-themed aesthetic, smooth scroll animations, and an immersive presentation of the brewing experience.",
    tags: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
    year: "2025",
    role: "Frontend Development",
    href: "https://matcha-explosion.vercel.app/",
    image: "/images/matcha.webp",
  },
];

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#&*";
const SCRAMBLE_DURATION = 700;

function scrambleText(el: HTMLElement, text: string): () => void {
  let rafId: number;
  let startTime: number | null = null;

  const frame = (ts: number) => {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;
    el.textContent = text
      .split("")
      .map((char, i) => {
        if (char === " ") return " ";
        if (elapsed >= (i / text.length) * SCRAMBLE_DURATION) return char;
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      })
      .join("");
    if (elapsed < SCRAMBLE_DURATION) {
      rafId = requestAnimationFrame(frame);
    } else {
      el.textContent = text;
    }
  };

  rafId = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(rafId); el.textContent = text; };
}

// scale(1.5) gives 25% overflow on each side.
// At card width 900px: overflow = 225px each side.
// Bidirectional: -PARALLAX_PX → +PARALLAX_PX. Images are centered when card is centered.
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
              const windowCenter = window.innerWidth / 2;
              const stripX = self.progress * getScrollAmount();
              
              imageRefs.current.forEach((img, i) => {
                const card = cardRefs.current[i];
                if (!img || !card) return;
                
                // Calculate absolute left offset without forcing layout thrashing
                let offsetLeft = card.offsetLeft;
                let parent = card.offsetParent as HTMLElement;
                while (parent && parent !== containerRef.current && parent !== document.body) {
                  offsetLeft += parent.offsetLeft;
                  parent = parent.offsetParent as HTMLElement;
                }
                
                const cardCenter = offsetLeft + card.offsetWidth / 2;
                const currentCardCenter = cardCenter + stripX;
                const distance = currentCardCenter - windowCenter;
                
                // Center the image when the card is perfectly centered on screen
                const shift = -(distance / windowCenter) * PARALLAX_PX;
                
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
    // Default touch-action: pan-y so vertical swipes still scroll the page normally.
    // We only capture the pointer (and block native scroll) once horizontal intent is
    // confirmed — i.e. finger moved more horizontally than vertically past an 8px threshold.
    const strip = stripRef.current!;
    strip.style.touchAction = "pan-y";

    let dragStartX = 0, dragStartY = 0, dragStartScroll = 0;
    let dragging = false, intentConfirmed = false;
    let lastScrollTarget = 0, lastMoveTime = 0, scrollVelocity = 0;
    let dragDelta = 0;

    const isTouchPointer = (e: PointerEvent) => e.pointerType === "touch";

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      intentConfirmed = false;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragStartScroll = window.scrollY;
      lastScrollTarget = window.scrollY;
      lastMoveTime = performance.now();
      scrollVelocity = 0;
      dragDelta = 0;
      isDragRef.current = false;

      // Desktop mouse: confirm intent immediately (no ambiguous scroll direction)
      if (!isTouchPointer(e)) {
        intentConfirmed = true;
        strip.setPointerCapture(e.pointerId);
        strip.style.cursor = "grabbing";
        window.__lenis?.stop();
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;

      const dx = dragStartX - e.clientX;
      const dy = e.clientY - dragStartY;

      // Touch: wait until direction is clear before committing to horizontal drag
      if (!intentConfirmed && isTouchPointer(e)) {
        const adx = Math.abs(dx);
        const ady = Math.abs(dy);
        if (adx < 8 && ady < 8) return; // still ambiguous — wait
        if (ady > adx) { dragging = false; return; } // vertical intent — give back to browser
        // Horizontal intent confirmed
        intentConfirmed = true;
        strip.setPointerCapture(e.pointerId);
        strip.style.touchAction = "none"; // block native scroll while dragging
        window.__lenis?.stop();
      }

      if (!intentConfirmed) return;

      const st = ScrollTrigger.getById("works-h");
      if (!st) return;
      dragDelta = Math.abs(dx);
      if (dragDelta > 6) isDragRef.current = true;
      const ratio = (st.end - st.start) / Math.abs(strip.scrollWidth - window.innerWidth) || 1;
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
      intentConfirmed = false;
      strip.style.touchAction = "pan-y"; // restore vertical scroll
      if (!isTouchPointer(e)) strip.style.cursor = "grab";
      window.__lenis?.start();
      const st = ScrollTrigger.getById("works-h");
      const inertiaThreshold = isTouchPointer(e) ? 0.02 : 0.05;
      if (st && Math.abs(scrollVelocity) > inertiaThreshold) {
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

  // Text scramble on hover — desktop only
  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const cleanups = new Map<number, () => void>();

    const handlers: Array<{ card: HTMLElement; onEnter: () => void } | null> = cardRefs.current.map((card, idx) => {
      if (!card) return null;
      const h2 = card.querySelector("h2") as HTMLElement | null;
      if (!h2) return null;
      const text = projects[idx].title;

      const onEnter = () => {
        cleanups.get(idx)?.();
        cleanups.set(idx, scrambleText(h2, text));
      };

      card.addEventListener("mouseenter", onEnter);
      return { card, onEnter };
    });

    return () => {
      handlers.forEach((h, idx) => {
        if (!h) return;
        h.card.removeEventListener("mouseenter", h.onEnter);
        cleanups.get(idx)?.();
      });
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
              <Image
                ref={(el) => { imageRefs.current[idx] = el; }}
                src={project.image}
                alt={project.title}
                draggable={false}
                priority={idx === 0}
                onLoad={() => setLoadedImages((prev) => ({ ...prev, [idx]: true }))}
                fill
                style={{
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

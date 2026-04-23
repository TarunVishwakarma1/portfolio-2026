// app/components/ServicesSection.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// scale(1.35) → 17.5% overflow each side.
// At card height 440px: overflow ≈ 77px each side.
// Parallax travel: -PARALLAX_V → +PARALLAX_V = 120px total. 60px < 77px budget ✓
const SCALE     = 1.35;
const PARALLAX_V = 60;

const services = [
  {
    id: "01",
    title: "Full Stack Development",
    description:
      "End-to-end web applications built with Next.js, React, and Node.js. From schema design to pixel-perfect UI — shipped fast, scaled right.",
    tags: ["Next.js", "React", "Node.js", "TypeScript"],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=90&auto=format&fit=crop",
  },
  {
    id: "02",
    title: "API & Backend Architecture",
    description:
      "High-throughput REST and GraphQL APIs. PostgreSQL, Redis, edge deployments. Sub-100ms response times under real load.",
    tags: ["Node.js", "Go", "PostgreSQL", "Redis"],
    image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=1600&q=90&auto=format&fit=crop",
  },
  {
    id: "03",
    title: "Performance Engineering",
    description:
      "Core Web Vitals optimization, bundle analysis, caching strategy, and infrastructure tuning. Fast by default, not by accident.",
    tags: ["Lighthouse", "Vercel", "CDN", "Web Vitals"],
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1600&q=90&auto=format&fit=crop",
  },
  {
    id: "04",
    title: "UI Engineering & Design Systems",
    description:
      "Component libraries, animation-rich interfaces, and Figma-to-code pipelines. Design systems that scale across product teams.",
    tags: ["Figma", "GSAP", "Storybook", "Radix UI"],
    image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=1600&q=90&auto=format&fit=crop",
  },
];

export default function ServicesSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs     = useRef<(HTMLImageElement | null)[]>([]);
  const [loadedImgs, setLoadedImgs] = useState<Record<number, boolean>>({});

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      // Reset all images to neutral scale (no offset), skip all motion
      imgRefs.current.forEach((img) => {
        if (img) img.style.transform = `scale(${SCALE})`;
      });
      return;
    }

    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const img = imgRefs.current[i];

        // Card reveal: fade + lift on scroll enter
        gsap.from(card, {
          opacity: 0,
          y: 32,
          duration: 0.75,
          ease: "expo.out",
          delay: i * 0.06,
          scrollTrigger: { trigger: card, start: "top 88%" },
        });

        // Vertical parallax on image:
        // Card top hits viewport bottom → img at -PARALLAX_V (shifted up)
        // Card bottom hits viewport top → img at +PARALLAX_V (shifted down)
        // Image lags behind scroll = classic parallax
        if (img) {
          gsap.fromTo(
            img,
            { y: -PARALLAX_V },
            {
              y: PARALLAX_V,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      style={{ padding: "clamp(4rem, 10vw, 8rem) 6vw" }}
    >
      <p
        style={{
          fontSize: "0.7rem",
          letterSpacing: "0.18em",
          color: "var(--fg-dim)",
          textTransform: "uppercase",
          marginBottom: "4rem",
        }}
      >
        Services
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {services.map((service, i) => (
          <div
            key={service.id}
            ref={(el) => { cardRefs.current[i] = el; }}
            style={{
              position: "relative",
              overflow: "hidden",
              minHeight: "440px",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "border-color 0.35s",
            }}
            className="service-card-wrap"
          >
            {/* Shimmer skeleton */}
            <div className={`img-skeleton${loadedImgs[i] ? " loaded" : ""}`} />

            {/* Parallax image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={(el) => { imgRefs.current[i] = el; }}
              src={service.image}
              alt={service.title}
              draggable={false}
              loading={i === 0 ? "eager" : "lazy"}
              onLoad={() => setLoadedImgs((prev) => ({ ...prev, [i]: true }))}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                // Initial scale creates overflow buffer for parallax translateY
                transform: `scale(${SCALE})`,
                willChange: "transform",
                userSelect: "none",
                WebkitUserSelect: "none",
              }}
            />

            {/* Dark gradient overlay — heavier at bottom where text lives */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(6,6,6,0.94) 0%, rgba(6,6,6,0.55) 55%, rgba(6,6,6,0.25) 100%)",
                zIndex: 1,
              }}
            />

            {/* Content — above image + overlay */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                minHeight: "440px",
              }}
            >
              {/* Top: ID */}
              <span
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  color: "var(--accent)",
                  fontFamily: "var(--font-geist-mono), monospace",
                }}
              >
                {service.id}
              </span>

              {/* Bottom: title + description + tags */}
              <div>
                <h3
                  className="font-display"
                  style={{
                    fontSize: "clamp(1.5rem, 2.5vw, 2.1rem)",
                    fontWeight: 300,
                    lineHeight: 1.08,
                    letterSpacing: "-0.01em",
                    marginBottom: "0.85rem",
                    color: "var(--fg)",
                  }}
                >
                  {service.title}
                </h3>

                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "rgba(237,234,227,0.65)",
                    lineHeight: 1.7,
                    marginBottom: "1.5rem",
                  }}
                >
                  {service.description}
                </p>

                <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: "0.58rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        border: "1px solid rgba(237,234,227,0.18)",
                        padding: "0.2rem 0.55rem",
                        color: "rgba(237,234,227,0.5)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

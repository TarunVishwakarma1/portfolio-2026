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

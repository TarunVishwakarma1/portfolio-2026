// app/components/ServicesSection.tsx
// Sticky-stacked panels: each one sticks a little lower than the last, so they
// deal onto each other as the section scrolls. The stack is the animation —
// no GSAP, no images, no client JS.

const services = [
  {
    id: "01",
    title: "Full Stack Development",
    description:
      "End-to-end web applications built with Next.js, React, and Node.js. From schema design to pixel-perfect UI — shipped fast, scaled right.",
    tags: ["Next.js", "React", "Node.js", "TypeScript"],
  },
  {
    id: "02",
    title: "API & Backend Architecture",
    description:
      "High-throughput REST and GraphQL APIs. PostgreSQL, Redis, edge deployments. Sub-100ms response times under real load.",
    tags: ["Node.js", "Go", "Rust", "PostgreSQL", "Redis"],
  },
  {
    id: "03",
    title: "Performance Engineering",
    description:
      "Core Web Vitals optimization, bundle analysis, caching strategy, and infrastructure tuning. Fast by default, not by accident.",
    tags: ["Lighthouse", "Vercel", "CDN", "Web Vitals"],
  },
  {
    id: "04",
    title: "UI Engineering & Design Systems",
    description:
      "Component libraries, animation-rich interfaces, and Figma-to-code pipelines. Design systems that scale across product teams.",
    tags: ["Figma", "GSAP", "Storybook", "Radix UI"],
  },
];

export default function ServicesSection() {
  return (
    <section id="services" style={{ padding: "clamp(4rem, 10vw, 8rem) 6vw" }}>
      <p
        style={{
          fontSize: "0.7rem",
          letterSpacing: "0.18em",
          color: "var(--fg-dim)",
          textTransform: "uppercase",
          marginBottom: "clamp(2rem, 5vw, 4rem)",
        }}
      >
        Services
      </p>

      {services.map((service, i) => (
        <article
          key={service.id}
          className="svc-panel"
          /* Each panel parks 1.75rem below the one before it, leaving the
             earlier titles visible as a stacked spine. */
          style={{ top: `calc(6rem + ${i * 1.75}rem)`, zIndex: i + 1 }}
        >
          <span className="svc-index" aria-hidden>
            {service.id}
          </span>

          <div>
            <h3 className="svc-title">{service.title}</h3>
            <p className="svc-desc">{service.description}</p>
          </div>

          <div className="svc-tags">
            {service.tags.map((tag) => (
              <span key={tag} className="svc-tag">
                {tag}
              </span>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}

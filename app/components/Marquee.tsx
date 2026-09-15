// app/components/Marquee.tsx
// Infinite ticker. The track is rendered twice and slid by exactly -100% of one
// copy, so the second copy lands where the first started and the loop is seamless.
// Pure CSS — see .marquee in globals.css.

const ITEMS = [
  "Full Stack Development",
  "API Architecture",
  "Performance Engineering",
  "Rust · Go · TypeScript",
  "UI Engineering",
  "Available for work",
];

function Track({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="marquee-track" aria-hidden={ariaHidden}>
      {ITEMS.map((item) => (
        <span key={item} className="marquee-cell">
          <span className="marquee-item">{item}</span>
          <span className="marquee-sep" aria-hidden>
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="marquee">
      <Track />
      <Track ariaHidden />
    </div>
  );
}

// app/components/LinkWipe.tsx
// Dual-text wipe hover animation — original slides down, duplicate slides up.

interface LinkWipeProps {
  children: string;
}

export default function LinkWipe({ children }: LinkWipeProps) {
  return (
    <span className="lw">
      <span className="lw-inner" data-label={children}>
        <span className="lw-text">{children}</span>
      </span>
    </span>
  );
}

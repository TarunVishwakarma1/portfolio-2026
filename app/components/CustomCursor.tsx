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
      curX += (mouseX - curX) * 0.12;
      curY += (mouseY - curY) * 0.12;
      // Use transform instead of left/top — stays on compositor thread
      dot.style.transform = `translate(calc(${curX}px - 50%), calc(${curY}px - 50%))`;
      rafId = requestAnimationFrame(loop);
    };

    const addHoverListeners = () => {
      document.querySelectorAll("a, button").forEach((el) => {
        el.addEventListener("mouseenter", onEnterLink);
        el.addEventListener("mouseleave", onLeaveLink);
      });
    };

    window.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(loop);
    addHoverListeners();

    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return <div ref={dotRef} className="cursor-dot" style={{ left: 0, top: 0 }} />;
}

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./Reveal.css";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in milliseconds, applied as transition-delay. */
  delay?: number;
}

/**
 * Scroll-triggered entrance (fade + rise) driven purely by CSS transitions.
 * Adds `.reveal--visible` once the element enters the viewport.
 * No-op under prefers-reduced-motion (see Reveal.css).
 */
export default function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("reveal--visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`.trim()}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

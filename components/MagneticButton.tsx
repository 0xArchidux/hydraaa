"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost";
  size?: "sm" | "md" | "lg";
  /** Jak mocno przycisk "ucieka" za kursorem (0–1). */
  strength?: number;
  arrow?: boolean;
  className?: string;
};

const SIZES = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
} as const;

const VARIANTS = {
  primary:
    "bg-white text-slate-900 shadow-[0_10px_40px_-10px_var(--accent)] hover:shadow-[0_16px_56px_-8px_var(--accent)]",
  ghost:
    "border border-white/20 bg-white/5 text-white backdrop-blur hover:border-white/40 hover:bg-white/10",
} as const;

/**
 * Przycisk z efektem magnetycznym (GSAP quickTo).
 * Pole przyciągania jest większe niż sam przycisk – nasłuch na oknie,
 * więc nie blokuje kliknięć w sąsiednie elementy.
 */
export default function MagneticButton({
  children,
  href,
  type = "button",
  onClick,
  disabled,
  variant = "primary",
  size = "lg",
  strength = 0.35,
  arrow,
  className = "",
}: Props) {
  const field = useRef<HTMLSpanElement>(null);
  const body = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const f = field.current;
    const b = body.current;
    const l = label.current;
    if (!f || !b || !l) return;
    if (
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const opts = { duration: 0.9, ease: "elastic.out(1, 0.4)" };
    const bx = gsap.quickTo(b, "x", opts);
    const by = gsap.quickTo(b, "y", opts);
    const lx = gsap.quickTo(l, "x", opts);
    const ly = gsap.quickTo(l, "y", opts);

    let inside = false;
    const reset = () => {
      inside = false;
      bx(0);
      by(0);
      lx(0);
      ly(0);
    };
    const onMove = (e: MouseEvent) => {
      const r = f.getBoundingClientRect();
      const hit =
        e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!hit) {
        if (inside) reset();
        return;
      }
      inside = true;
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      bx(dx * strength);
      by(dy * strength);
      lx(dx * strength * 0.4);
      ly(dy * strength * 0.4);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", reset);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", reset);
      gsap.set([b, l], { x: 0, y: 0 });
    };
  }, [strength]);

  const showArrow = arrow ?? variant === "primary";

  const classes = `group relative inline-flex items-center justify-center gap-3 rounded-full font-semibold transition-[box-shadow,background-color,border-color] duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${SIZES[size]} ${VARIANTS[variant]} ${className}`;

  const content = (
    <span ref={label} className="relative inline-flex items-center gap-3">
      {children}
      {showArrow && (
        <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--accent)] text-white transition-transform duration-300 group-hover:translate-x-0.5">
          <ArrowRight size={14} strokeWidth={2.5} />
        </span>
      )}
    </span>
  );

  return (
    // field: niewidoczne, większe pole przyciągania; nie przechwytuje zdarzeń myszy
    <span ref={field} className="pointer-events-none -m-6 inline-block p-6 align-middle">
      <span ref={body} className="pointer-events-auto inline-block will-change-transform">
        {href ? (
          <a href={href} className={classes}>
            {content}
          </a>
        ) : (
          <button type={type} onClick={onClick} disabled={disabled} className={classes}>
            {content}
          </button>
        )}
      </span>
    </span>
  );
}

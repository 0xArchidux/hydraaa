"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  /** true → animacja startuje od razu (hero); false → po wejściu w viewport. */
  immediate?: boolean;
};

/**
 * Reveal linia po linii (GSAP SplitText + maska).
 * Tekst jest ukryty klasą `split-pending` do momentu podziału, więc nie ma błysku;
 * przy `prefers-reduced-motion` i bez JS tekst jest od razu widoczny.
 */
export default function SplitReveal({
  as: Tag = "div",
  children,
  className = "",
  delay = 0,
  stagger = 0.1,
  immediate = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.remove("split-pending");
      return;
    }

    let split: SplitText | undefined;
    let cancelled = false;

    // czekamy na fonty (max 1,2 s), żeby linie liczyły się na docelowej szerokości
    const fontsReady = Promise.race([
      document.fonts.ready,
      new Promise((resolve) => setTimeout(resolve, 1200)),
    ]);

    fontsReady.then(() => {
      if (cancelled) return;
      split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 115,
            duration: 1.1,
            ease: "power4.out",
            stagger,
            delay,
            ...(immediate
              ? {}
              : { scrollTrigger: { trigger: el, start: "top 88%", once: true } }),
          }),
      });
      el.classList.remove("split-pending");
    });

    return () => {
      cancelled = true;
      split?.revert();
    };
  }, [delay, stagger, immediate]);

  return (
    <Tag ref={ref} className={`split-pending ${className}`}>
      {children}
    </Tag>
  );
}

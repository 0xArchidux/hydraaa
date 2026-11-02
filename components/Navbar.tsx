"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import HydraLogo from "./HydraLogo";
import MagneticButton from "./MagneticButton";
import { SITE } from "@/lib/site";

const LINKS = [
  { href: "#uslugi", label: "Usługi" },
  { href: "#wycena", label: "Wycena" },
  { href: "#dlaczego-my", label: "Dlaczego my" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900"
      >
        Przejdź do treści
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || open
            ? "border-b border-white/10 bg-slate-900/70 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label="Hydra Instal – strona główna">
            <HydraLogo className="h-10 w-10" />
            <span className="font-display text-lg font-bold tracking-wide text-white">
              HYDRA <span className="font-medium text-slate-300">INSTAL</span>
            </span>
          </a>

          <nav aria-label="Główna nawigacja" className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--accent)] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={SITE.phoneHref}
              className="hidden items-center gap-2 text-sm font-medium text-slate-200 transition-colors hover:text-white lg:flex"
            >
              <Phone size={16} className="text-[var(--accent)]" />
              {SITE.phone}
            </a>
            <div className="hidden md:block">
              <MagneticButton href="#wycena" size="sm" strength={0.3}>
                Darmowa wycena
              </MagneticButton>
            </div>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-white md:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Zamknij menu" : "Otwórz menu"}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden md:hidden"
            >
              <nav aria-label="Menu mobilne" className="flex flex-col gap-1 px-5 pb-6 pt-2">
                {LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-3 text-lg font-medium text-slate-100 hover:bg-white/5"
                  >
                    {l.label}
                  </a>
                ))}
                <a
                  href={SITE.phoneHref}
                  className="mt-2 flex items-center gap-2 rounded-xl px-3 py-3 text-slate-200"
                >
                  <Phone size={18} className="text-[var(--accent)]" />
                  {SITE.phone}
                </a>
                <a
                  href="#wycena"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-full bg-white px-6 py-3.5 text-center font-semibold text-slate-900"
                >
                  Odbierz darmową wycenę
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

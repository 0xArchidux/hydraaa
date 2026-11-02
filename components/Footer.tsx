import { Clock, Mail, MapPin, Phone } from "lucide-react";
import HydraLogo from "./HydraLogo";
import { SITE } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <HydraLogo className="h-12 w-12" />
            <span className="font-display text-xl font-bold tracking-wide text-white">
              HYDRA <span className="font-medium text-slate-300">INSTAL</span>
            </span>
          </div>
          <p className="mt-5 max-w-sm leading-relaxed text-slate-400">
            Hydraulika, klimatyzacja, rekuperacja, pompy ciepła i instalacje gazowe. Jedna ekipa,
            terminy zapisane w umowie.
          </p>
        </div>

        <div className="md:col-span-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Kontakt</h2>
          <ul className="mt-5 space-y-3 text-slate-200">
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-[var(--accent)]" />
              <a href={SITE.phoneHref} className="hover:text-white">{SITE.phone}</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-[var(--accent)]" />
              <a href={`mailto:${SITE.email}`} className="hover:text-white">{SITE.email}</a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin size={18} className="text-[var(--accent)]" />
              {SITE.area}
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            <Clock size={16} /> Godziny otwarcia
          </h2>
          <dl className="mt-5 space-y-2 text-sm">
            {SITE.hours.map((h) => (
              <div key={h.days} className="flex justify-between gap-4">
                <dt className="text-slate-400">{h.days}</dt>
                <dd className="font-medium text-slate-200">{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-5 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:px-8">
          <p>© {year} {SITE.name}. Wszelkie prawa zastrzeżone.</p>
          <p>NIP: {SITE.nip}</p>
        </div>
      </div>
    </footer>
  );
}

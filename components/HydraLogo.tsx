import { useId, type CSSProperties } from "react";

type Props = {
  className?: string;
  /** Włącza kołysanie głów i obrót zębatki (hero). */
  animated?: boolean;
};

const PIVOT = "120px 190px";

const sway = (duration: number, delay: number, animated: boolean): CSSProperties | undefined =>
  animated
    ? {
        transformOrigin: PIVOT,
        animation: `sway ${duration}s ease-in-out ${delay}s infinite alternate`,
      }
    : undefined;

/**
 * Logo: mechaniczna, trójgłowa hydra na zębatce.
 * Lewa głowa = woda, środkowa = powietrze, prawa = ogień.
 */
export default function HydraLogo({ className, animated = false }: Props) {
  const uid = useId().replace(/:/g, "");

  const heads = [
    { id: "w", x: 54, y: 74, rot: -22, tint: ["#7DD3FC", "#0284C7"], neck: "#0284C7", d: "M120 190 C120 148 58 142 54 96", dur: 5.2, delay: -1 },
    { id: "a", x: 120, y: 42, rot: 0, tint: ["#5EEAD4", "#0D9488"], neck: "#0D9488", d: "M120 190 C122 150 118 110 120 66", dur: 4.4, delay: -2.4 },
    { id: "f", x: 186, y: 74, rot: 22, tint: ["#FDBA74", "#EA580C"], neck: "#EA580C", d: "M120 190 C120 148 182 142 186 96", dur: 5.8, delay: -3.2 },
  ];

  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      className={className}
      role="img"
      aria-label="Logo Hydra Instal – mechaniczna hydra o trzech głowach"
    >
      <defs>
        {heads.map((h) => (
          <linearGradient key={h.id} id={`${uid}-${h.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={h.tint[0]} />
            <stop offset="1" stopColor={h.tint[1]} />
          </linearGradient>
        ))}
        <filter id={`${uid}-glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* zębatka-podstawa */}
      <g style={animated ? { transformOrigin: "120px 198px", animation: "spin-slow 28s linear infinite" } : undefined}>
        <circle cx="120" cy="198" r="31" stroke="#475569" strokeWidth="11" strokeDasharray="7.2 4.5" />
        <circle cx="120" cy="198" r="25" fill="#0F172A" stroke="#64748B" strokeWidth="2" />
        <circle cx="120" cy="198" r="9" fill="#94A3B8" />
        <circle cx="120" cy="198" r="3.5" fill="#0F172A" />
      </g>

      {heads.map((h) => (
        <g key={h.id} style={sway(h.dur, h.delay, animated)}>
          {/* szyja */}
          <path d={h.d} stroke={h.neck} strokeWidth="11" strokeLinecap="round" />
          {/* segmenty (mechanika) */}
          <path d={h.d} stroke="#0F172A" strokeOpacity="0.45" strokeWidth="11" strokeDasharray="2 9" />
          <path d={h.d} stroke="#fff" strokeOpacity="0.18" strokeWidth="2" strokeLinecap="round" transform="translate(-2 0)" />
          {/* głowa */}
          <g transform={`translate(${h.x} ${h.y}) rotate(${h.rot})`}>
            <path
              d="M-17 10 L-13 -13 Q0 -24 13 -13 L17 10 Q0 20 -17 10Z"
              fill={`url(#${uid}-${h.id})`}
              stroke="#0F172A"
              strokeOpacity="0.35"
              strokeWidth="1.5"
            />
            <path d="M-13 -13 L-19 -24 L-6 -17Z M13 -13 L19 -24 L6 -17Z" fill={h.tint[1]} />
            <path d="M-9 14 L0 24 L9 14Z" fill={h.tint[1]} />
            <g filter={`url(#${uid}-glow)`}>
              <circle cx="-6" cy="-3" r="3.2" fill="#fff" />
              <circle cx="6" cy="-3" r="3.2" fill="#fff" />
            </g>
          </g>
        </g>
      ))}
    </svg>
  );
}

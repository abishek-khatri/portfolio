import React from 'react'

// Four small hand-drawn sketches from the About page. They are simple
// approximations of the Figma doodles, drawn as inline SVG.

const PEN = '#2b4fb0'
const EMBER = '#c2461c'

function Doodle({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <div className="doodle">
      <svg viewBox="0 0 100 80" fill="none" stroke={PEN} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
      </svg>
      <p className="hand">{caption}</p>
    </div>
  )
}

export function AboutDoodles() {
  return (
    <div className="doodles" aria-hidden="true">
      <Doodle caption="circuits">
        <circle cx="8" cy="40" r="4" />
        <path d="M12 40 H26 L30 30 L36 50 L42 30 L48 50 L52 40 H66" />
        <path d="M66 28 V52 M74 28 V52 M74 40 H92" />
        <text x="32" y="22" fill={PEN} stroke="none" fontSize="14" className="hand">R</text>
        <text x="86" y="62" fill={PEN} stroke="none" fontSize="14" className="hand">C</text>
      </Doodle>
      <Doodle caption="signals">
        <path d="M6 40 C 18 8, 30 8, 42 40 S 66 72, 78 40 S 90 8, 94 22" />
        <circle cx="6" cy="40" r="3" fill={EMBER} stroke="none" />
        <circle cx="24" cy="14" r="3" fill={EMBER} stroke="none" />
        <circle cx="42" cy="40" r="3" fill={EMBER} stroke="none" />
        <circle cx="60" cy="66" r="3" fill={EMBER} stroke="none" />
        <circle cx="78" cy="40" r="3" fill={EMBER} stroke="none" />
      </Doodle>
      <Doodle caption="statics">
        <rect x="34" y="26" width="32" height="28" />
        <path d="M50 4 V26 M46 12 L50 4 L54 12" />
        <path d="M50 54 V76 M46 68 L50 76 L54 68" />
        <path d="M66 40 H94 M86 36 L94 40 L86 44" />
        <path d="M34 40 H6 M14 36 L6 40 L14 44" />
        <text x="56" y="14" fill={PEN} stroke="none" fontSize="12" className="hand">N</text>
        <text x="56" y="74" fill={PEN} stroke="none" fontSize="12" className="hand">W</text>
      </Doodle>
      <Doodle caption="fluids">
        <path d="M4 12 C 30 8, 70 8, 96 14" />
        <path d="M4 22 C 30 18, 70 18, 96 24" />
        <path d="M4 52 C 30 58, 70 58, 96 52" />
        <path d="M4 62 C 30 68, 70 68, 96 62" />
        <circle cx="50" cy="38" r="11" />
        <path d="M90 24 L96 24 L92 30 M90 52 L96 52 L92 46" />
      </Doodle>
    </div>
  )
}
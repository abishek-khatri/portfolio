import React from 'react'

// Small hand-drawn sketches for the top of the Hardware, Software and 3D pages.
// They are simple approximations of the Figma doodles, drawn as inline SVG.

const PEN = '#2b4fb0'
const EMBER = '#c2461c'

function Doodle({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <div className="doodle">
      <svg
        viewBox="0 0 110 80"
        fill="none"
        stroke={PEN}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
      <p className="hand">{caption}</p>
    </div>
  )
}

function Label({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return (
    <text x={x} y={y} fill={PEN} stroke="none" fontSize="14" className="hand">
      {children}
    </text>
  )
}

export function DrawerDoodles({ drawer }: { drawer: 'hardware' | 'software' | '3d' }) {
  if (drawer === 'hardware') {
    return (
      <div className="drawer-doodles" aria-hidden="true">
        <Doodle caption="op-amp">
          <path d="M30 10 L30 60 L80 35 Z" />
          <path d="M6 24 H30 M6 46 H30 M80 35 H106" />
          <Label x={33} y={29}>+</Label>
          <Label x={33} y={52}>−</Label>
        </Doodle>
        <Doodle caption="RC filter">
          <circle cx="8" cy="40" r="4" />
          <path d="M12 40 H24 L28 30 L34 50 L40 30 L46 50 L50 40 H70" />
          <path d="M70 28 V52 M78 28 V52 M78 40 H104" />
          <Label x={30} y={22}>R</Label>
          <Label x={96} y={64}>C</Label>
        </Doodle>
        <Doodle caption="scope trace">
          <path d="M4 50 H18 V22 H36 V50 H54 V22 H72 V50 H90 V22 H106" />
          <circle cx="63" cy="22" r="3" fill={EMBER} stroke="none" />
        </Doodle>
      </div>
    )
  }

  if (drawer === 'software') {
    return (
      <div className="drawer-doodles" aria-hidden="true">
        <Doodle caption="neural net">
          <path d="M20 16 L55 26 M20 16 L55 54 M20 40 L55 26 M20 40 L55 54 M20 64 L55 26 M20 64 L55 54 M55 26 L92 40 M55 54 L92 40" />
          <circle cx="20" cy="16" r="5" fill={PEN} stroke="none" />
          <circle cx="20" cy="40" r="5" fill={PEN} stroke="none" />
          <circle cx="20" cy="64" r="5" fill={PEN} stroke="none" />
          <circle cx="55" cy="26" r="5" fill={PEN} stroke="none" />
          <circle cx="55" cy="54" r="5" fill={PEN} stroke="none" />
          <circle cx="92" cy="40" r="5" fill={EMBER} stroke="none" />
        </Doodle>
        <Doodle caption="loss curve">
          <path d="M8 8 C 20 50, 50 62, 100 66" />
          <path d="M8 16 C 24 52, 54 58, 100 60" stroke={EMBER} />
          <circle cx="100" cy="66" r="3" fill={EMBER} stroke="none" />
        </Doodle>
        <Doodle caption="bode plot">
          <path d="M6 14 H40 C 60 14, 70 40, 104 46" />
          <path d="M6 60 H40 C 60 60, 70 66, 104 72" stroke={EMBER} />
        </Doodle>
      </div>
    )
  }

  return (
    <div className="drawer-doodles" aria-hidden="true">
      <Doodle caption="isometric">
        <path d="M10 22 L40 8 L72 22 L72 58 L40 72 L10 58 Z" />
        <path d="M10 22 L40 36 L72 22 M40 36 V72" />
        <path d="M80 22 V58 M76 22 H84 M76 58 H84" />
        <Label x={90} y={44}>H</Label>
      </Doodle>
      <Doodle caption="hole">
        <circle cx="40" cy="36" r="24" />
        <path d="M16 36 H64 M40 12 V60" strokeDasharray="3 4" />
        <path d="M70 66 H10 M16 62 L10 66 L16 70 M64 62 L70 66 L64 70" />
        <Label x={34} y={42}>Ø</Label>
      </Doodle>
      <Doodle caption="fbd">
        <rect x="38" y="26" width="30" height="28" />
        <path d="M53 4 V26 M49 12 L53 4 L57 12" />
        <path d="M53 54 V76 M49 68 L53 76 L57 68" />
        <path d="M68 40 H100 M92 36 L100 40 L92 44" />
        <path d="M38 40 H6 M14 36 L6 40 L14 44" />
        <Label x={60} y={14}>N</Label>
        <Label x={60} y={74}>W</Label>
        <Label x={90} y={32}>F</Label>
        <Label x={8} y={32}>f</Label>
      </Doodle>
    </div>
  )
}
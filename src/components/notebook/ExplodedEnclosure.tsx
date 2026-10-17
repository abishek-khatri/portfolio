'use client'

import { Edges, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React, { useState } from 'react'

// A simple three-part enclosure (base, board, lid) that you can drag to rotate
// and pull apart with the slider. Swap this for a real .glb model later.
export function ExplodedEnclosure() {
  const [gap, setGap] = useState(0.55)

  return (
    <div>
      <div className="viewer-canvas">
        <Canvas camera={{ position: [4.6, 3.4, 5.4], fov: 32 }}>
          <ambientLight intensity={1.1} />
          <directionalLight position={[5, 8, 5]} intensity={1.6} />
          <group position={[0, -0.9, 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[2.6, 0.5, 1.8]} />
              <meshStandardMaterial color="#e2dccb" />
              <Edges color="#14202a" />
            </mesh>
            <mesh position={[0, 0.5 + gap, 0]}>
              <boxGeometry args={[2.4, 0.08, 1.6]} />
              <meshStandardMaterial color="#bcd3c6" />
              <Edges color="#14202a" />
            </mesh>
            <mesh position={[0, 0.85 + gap * 2, 0]}>
              <boxGeometry args={[2.6, 0.14, 1.8]} />
              <meshStandardMaterial color="#c2461c" />
              <Edges color="#14202a" />
            </mesh>
          </group>
          <OrbitControls enablePan={false} enableZoom={false} />
        </Canvas>
      </div>
      <label className="hand viewer-slider">
        <span>together</span>
        <input
          type="range"
          min={0}
          max={1.4}
          step={0.01}
          value={gap}
          onChange={(e) => setGap(Number(e.target.value))}
          aria-label="Explode the enclosure"
        />
        <span>apart</span>
      </label>
    </div>
  )
}
'use client'

import { OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'

import { ExplodedEnclosure } from './ExplodedEnclosure'
import { applyExplode, applyViewMode, findExplodeTargets, type ViewMode } from './explode'

import './viewer.css'

// The model is scaled so the smallest ball that fits around it has this radius.
const FIT_RADIUS = 2.0
const ZOOM_MIN = 0.5
const ZOOM_MAX = 3
const ZOOM_START = 1.15

const MODES: { key: ViewMode; label: string }[] = [
  { key: 'schematic', label: 'schematic' },
  { key: 'photo', label: 'photo' },
  { key: 'cad', label: 'CAD' },
]

function Model({
  url,
  gap,
  mode,
  onParts,
}: {
  url: string
  gap: number
  mode: ViewMode
  onParts: (count: number) => void
}) {
  const gltf = useGLTF(url)

  const prepared = useMemo(() => {
    const root = gltf.scene.clone(true)
    const targets = findExplodeTargets(root)
    const box = new THREE.Box3().setFromObject(root)
    const center = box.getCenter(new THREE.Vector3())
    const radius = box.getBoundingSphere(new THREE.Sphere()).radius
    const scale = FIT_RADIUS / Math.max(radius, 1e-6)
    return { root, targets, center, scale }
  }, [gltf])

  useEffect(() => {
    onParts(prepared.targets.length)
  }, [prepared, onParts])

  useEffect(() => {
    applyExplode(prepared.targets, gap)
  }, [prepared, gap])

  useEffect(() => {
    applyViewMode(prepared.root, mode)
  }, [prepared, mode])

  return (
    <group scale={prepared.scale}>
      <primitive
        object={prepared.root}
        position={[-prepared.center.x, -prepared.center.y, -prepared.center.z]}
      />
    </group>
  )
}

// Zooms the camera in and out without moving it.
function Zoom({ value }: { value: number }) {
  const camera = useThree((state) => state.camera)
  useEffect(() => {
    camera.zoom = value
    camera.updateProjectionMatrix()
  }, [camera, value])
  return null
}

// If the file can't be loaded, show the sample enclosure instead of breaking the page.
class ModelBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

export function ModelViewer({ url }: { url: string }) {
  const [gap, setGap] = useState(0)
  const [zoom, setZoom] = useState(ZOOM_START)
  const [mode, setMode] = useState<ViewMode>('photo')
  const [parts, setParts] = useState<number | null>(null)
  const handleParts = useCallback((count: number) => setParts(count), [])

  return (
    <ModelBoundary
      fallback={
        <div>
          <p className="hand viewer-error">couldn&apos;t load this model — showing the sample instead</p>
          <ExplodedEnclosure />
        </div>
      }
    >
      <div>
        <div className="hand viewer-modes">
          {MODES.map((m) => (
            <button
              key={m.key}
              type="button"
              className={mode === m.key ? 'on' : undefined}
              onClick={() => setMode(m.key)}
            >
              {m.label}
            </button>
          ))}
          {parts === null && <span className="status">loading model…</span>}
        </div>

        <div className="viewer-canvas">
          <Canvas camera={{ position: [5.2, 3.8, 6.2], fov: 32 }}>
            <ambientLight intensity={1.1} />
            <hemisphereLight intensity={0.6} />
            <directionalLight position={[5, 8, 5]} intensity={1.6} />
            <Zoom value={zoom} />
            <Suspense fallback={null}>
              <Model url={url} gap={gap} mode={mode} onParts={handleParts} />
            </Suspense>
            <OrbitControls enablePan={false} enableZoom={false} />
          </Canvas>
        </div>

        {parts !== null && parts >= 2 && (
          <label className="hand viewer-slider">
            <span>together</span>
            <input
              type="range"
              min={0}
              max={1.4}
              step={0.01}
              value={gap}
              onChange={(e) => setGap(Number(e.target.value))}
              aria-label="Pull the model apart"
            />
            <span>apart</span>
          </label>
        )}
        {parts !== null && parts < 2 && (
          <p className="hand viewer-note">this model is one piece, so there is nothing to pull apart</p>
        )}

        <label className="hand viewer-slider">
          <span>far</span>
          <input
            type="range"
            min={ZOOM_MIN}
            max={ZOOM_MAX}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            aria-label="Zoom"
          />
          <span>close</span>
        </label>
      </div>
    </ModelBoundary>
  )
}

// Shows the uploaded model if there is one, and the sample enclosure if not.
export function ProjectViewer({ url }: { url?: string | null }) {
  return url ? <ModelViewer url={url} /> : <ExplodedEnclosure />
}
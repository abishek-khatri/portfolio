'use client'

import React, { useState } from 'react'

import { ExplodedEnclosure } from './ExplodedEnclosure'

const X0 = 24
const X1 = 744
const MID = 170

// ---------------------------------------------------------------------------
// RC low-pass: a 1 kHz sine goes in, C is 100 nF, the slider changes R
// from 100 ohms to 100 kilohms.
// ---------------------------------------------------------------------------
const C_FARADS = 100e-9
const F_IN = 1000
const CYCLES = 3
const AMP = 120
const N = 240

function wavePath(gain: number, lag: number): string {
  const parts: string[] = []
  for (let i = 0; i <= N; i++) {
    const cycles = (i / N) * CYCLES
    const x = X0 + (i / N) * (X1 - X0)
    const y = MID - AMP * gain * Math.sin(2 * Math.PI * cycles - lag)
    parts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return parts.join(' ')
}

function formatHz(hz: number): string {
  return hz >= 1000 ? `${(hz / 1000).toFixed(2)} kHz` : `${Math.round(hz)} Hz`
}

export function RcLowPass() {
  const [pos, setPos] = useState(0.5)

  const resistance = Math.pow(10, 2 + 3 * pos)
  const cutoff = 1 / (2 * Math.PI * resistance * C_FARADS)
  const ratio = F_IN / cutoff
  const gain = 1 / Math.sqrt(1 + ratio * ratio)
  const lag = Math.atan(ratio)

  return (
    <div className="nb-card widget-card">
      <span className="tape" />
      <div className="widget-grid">
        <div>
          <p className="hand widget-title">RC low-pass, live</p>
          <p className="widget-copy">Drag the slider to change R. The orange curve is the output.</p>
          <div className="widget-slider">
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              aria-label="Resistor value"
            />
            <div className="hand labels">
              <span>smaller R</span>
              <span>bigger R</span>
            </div>
          </div>
          <p className="hand widget-fc">fc = {formatHz(cutoff)}</p>
        </div>

        <div className="widget-chart">
          <svg viewBox="0 0 780 340" role="img" aria-label="Input and output sine waves of an RC filter">
            <line x1={X0} y1={20} x2={X0} y2={320} stroke="#14202a" strokeWidth={1.5} />
            <line x1={X0} y1={MID} x2={X1 + 10} y2={MID} stroke="#14202a" strokeWidth={1.5} />
            <path d={wavePath(1, 0)} fill="none" stroke="#14202a" strokeWidth={2} />
            <path d={wavePath(gain, lag)} fill="none" stroke="#c2461c" strokeWidth={3} />
            <text x={X0 + 8} y={30} className="hand" fill="#2b4fb0" fontSize={24}>
              V
            </text>
            <text x={X1 - 60} y={MID + 40} className="hand" fill="#2b4fb0" fontSize={24}>
              time →
            </text>
            <text x={X1 - 40} y={30} className="hand" fill="#14202a" fontSize={26}>
              in
            </text>
            <text x={X1 - 40} y={60} className="hand" fill="#c2461c" fontSize={26}>
              out
            </text>
          </svg>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Training curve: drag the slider to pick an epoch. The numbers are made up
// for the demo (a smooth curve that starts to overfit near the end).
// ---------------------------------------------------------------------------
const EPOCHS = 60
const LOSS_MAX = 1.6

function trainLoss(e: number): number {
  return 0.12 + 1.3 * Math.exp(-e / 11)
}
function valLoss(e: number): number {
  return 0.2 + 1.2 * Math.exp(-e / 13) + 0.0006 * Math.pow(Math.max(0, e - 35), 1.6)
}
function lossX(e: number): number {
  return X0 + ((e - 1) / (EPOCHS - 1)) * (X1 - X0)
}
function lossY(loss: number): number {
  return 300 - (loss / LOSS_MAX) * 260
}
function lossPath(fn: (e: number) => number): string {
  const parts: string[] = []
  for (let e = 1; e <= EPOCHS; e++) {
    parts.push(`${e === 1 ? 'M' : 'L'}${lossX(e).toFixed(1)} ${lossY(fn(e)).toFixed(1)}`)
  }
  return parts.join(' ')
}

export function LossCurve() {
  const [epoch, setEpoch] = useState(24)
  const t = trainLoss(epoch)
  const v = valLoss(epoch)

  return (
    <div className="nb-card widget-card">
      <span className="tape" />
      <div className="widget-grid">
        <div>
          <p className="hand widget-title">training curve, live</p>
          <p className="widget-copy">
            Drag the slider to move through the epochs. Watch where the two curves start to part.
          </p>
          <div className="widget-slider">
            <input
              type="range"
              min={1}
              max={EPOCHS}
              step={1}
              value={epoch}
              onChange={(e) => setEpoch(Number(e.target.value))}
              aria-label="Epoch"
            />
            <div className="hand labels">
              <span>epoch 1</span>
              <span>epoch {EPOCHS}</span>
            </div>
          </div>
          <p className="hand widget-fc">epoch {epoch}</p>
          <p className="hand widget-sub">
            train {t.toFixed(2)} · val {v.toFixed(2)}
          </p>
        </div>

        <div className="widget-chart">
          <svg viewBox="0 0 780 340" role="img" aria-label="Training and validation loss over epochs">
            <line x1={X0} y1={20} x2={X0} y2={320} stroke="#14202a" strokeWidth={1.5} />
            <line x1={X0} y1={300} x2={X1 + 10} y2={300} stroke="#14202a" strokeWidth={1.5} />
            <path d={lossPath(trainLoss)} fill="none" stroke="#14202a" strokeWidth={2} />
            <path d={lossPath(valLoss)} fill="none" stroke="#c2461c" strokeWidth={3} />
            <line
              x1={lossX(epoch)}
              y1={30}
              x2={lossX(epoch)}
              y2={300}
              stroke="#2b4fb0"
              strokeWidth={1.5}
              strokeDasharray="5 5"
            />
            <circle cx={lossX(epoch)} cy={lossY(t)} r={6} fill="#14202a" />
            <circle cx={lossX(epoch)} cy={lossY(v)} r={6} fill="#c2461c" />
            <text x={X0 + 8} y={30} className="hand" fill="#2b4fb0" fontSize={24}>
              loss
            </text>
            <text x={X1 - 80} y={330} className="hand" fill="#2b4fb0" fontSize={24}>
              epochs →
            </text>
            <text x={X1 - 40} y={lossY(trainLoss(EPOCHS)) - 14} className="hand" fill="#14202a" fontSize={26}>
              train
            </text>
            <text x={X1 - 40} y={lossY(valLoss(EPOCHS)) - 14} className="hand" fill="#c2461c" fontSize={26}>
              val
            </text>
          </svg>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Exploded view: the same sample enclosure, with three labelled parts.
// ---------------------------------------------------------------------------
export function ExplodedWidget() {
  return (
    <div className="nb-card widget-card">
      <span className="tape" />
      <div className="widget-grid exploded-grid">
        <div>
          <p className="hand widget-title">exploded view, live</p>
          <p className="widget-copy">Drag to turn it around, and slide to pull it apart.</p>
        </div>
        <div className="exploded-body">
          <ExplodedEnclosure />
          <div className="parts">
            {[
              { n: '03', name: 'lid' },
              { n: '02', name: 'pcb' },
              { n: '01', name: 'base' },
            ].map((p) => (
              <div className="part" key={p.n}>
                <p className="hand part-name">{`${p.n} · ${p.name}`}</p>
                <p className="part-note">[what it is, in a few words]</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
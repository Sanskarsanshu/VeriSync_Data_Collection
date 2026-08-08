import { useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const AMBER = '#F59E0B' // Amber-500
const BLUE = '#3B82F6' // Blue-500
const EASE = [0.16, 1, 0.3, 1] as const
const GREEN = '#10B981' // Emerald-500
const HAIRLINE = 'var(--border)'
const SANS = 'inherit'
const SURFACE = 'var(--card)'
const SURFACE_RAISED = 'var(--popover, var(--card))'
const TEXT = 'var(--foreground)'
const TEXT_MUTED = 'var(--muted-foreground)'

/** Attendance Trend Fan — modified from Price Target Fan. 
 *  History walks to "now", three projections fan out to the Target / Average / Critical targets. 
 *  Scrub the history, or hover a target, and a card flips in beside the point. */

const CURRENT = 92.4

type Target = { key: string; value: number; proxies: number; color: string }
const TARGETS: Target[] = [
  { key: 'Target', value: 96.0, proxies: 2, color: GREEN },
  { key: 'Average', value: 88.5, proxies: 12, color: BLUE },
  { key: 'Critical', value: 75.0, proxies: 25, color: AMBER },
]

// deterministic weekly history ending exactly at CURRENT (last 12 weeks)
const HIST = (() => {
  let s = 17
  let v = 85
  const out: number[] = []
  for (let i = 0; i < 12; i++) {
    s = (s * 16807) % 2147483647
    v = v + ((s / 2147483647) - 0.44) * 5
    out.push(v)
  }
  const lo = Math.min(...out)
  const hi = Math.max(...out)
  const scaled = out.map((x) => 75 + ((x - lo) / (hi - lo)) * 20)
  const shift = CURRENT - scaled[scaled.length - 1]
  return scaled.map((x) => x + shift)
})()

const W = 520
const H = 236
const PAD = { l: 40, r: 104, t: 16, b: 28 }
const Y_MIN = 60
const Y_MAX = 100
const y = (v: number) => PAD.t + (1 - (v - Y_MIN) / (Y_MAX - Y_MIN)) * (H - PAD.t - PAD.b)
const pct = (p: number) => p - CURRENT
const fmt = (p: number) => `${p.toFixed(1)}%`
const CARD_W = 140

export function AttendanceTrendFan() {
  const reduced = useReducedMotion()
  const svgRef = useRef<SVGSVGElement>(null)
  const [scrub, setScrub] = useState<number | null>(null)
  const [hotT, setHotT] = useState<number | null>(null)

  const geo = useMemo(() => {
    const histW = (W - PAD.l - PAD.r) * 0.56
    const hx = (i: number) => PAD.l + (i / (HIST.length - 1)) * histW
    const nowX = hx(HIST.length - 1)
    const nowY = y(CURRENT)
    const endX = W - PAD.r
    const line = HIST.map((v, i) => `${i === 0 ? 'M' : 'L'}${hx(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
    const proj = TARGETS.map((t) => {
      const ty = y(t.value)
      const cx = nowX + (endX - nowX) * 0.5
      const cy = nowY + (ty - nowY) * 0.15
      return { ...t, ty, d: `M${nowX},${nowY} Q${cx},${cy} ${endX},${ty}`, cx, cy }
    })
    const hi = proj[0]
    const lo = proj[2]
    const band = `M${nowX},${nowY} Q${hi.cx},${hi.cy} ${endX},${hi.ty} L${endX},${lo.ty} Q${lo.cx},${lo.cy} ${nowX},${nowY} Z`
    return { hx, nowX, nowY, endX, line, proj, band }
  }, [])

  const onMove = (e: React.PointerEvent) => {
    const el = svgRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = ((e.clientX - r.left) / r.width) * W
    if (px > geo.nowX + 6) {
      setScrub(null)
      return
    }
    const histW = geo.nowX - PAD.l
    setScrub(Math.max(0, Math.min(HIST.length - 1, Math.round(((px - PAD.l) / histW) * (HIST.length - 1)))))
  }

  // the overlay card — target hover wins over scrub; flips to the side that keeps it in view
  const overlay = (() => {
    if (hotT !== null) {
      const p = geo.proj[hotT]
      const up = p.value >= CURRENT
      return {
        px: geo.endX,
        py: p.ty,
        value: fmt(p.value),
        context: `${p.key} · ${up ? '+' : ''}${pct(p.value).toFixed(1)}% · ${p.proxies} proxies`,
        color: p.color,
      }
    }
    if (scrub !== null) {
      const ago = HIST.length - 1 - scrub
      // simulate proxy count for history
      const proxies = Math.round(15 - (HIST[scrub] - 75) * 0.5)
      return { 
        px: geo.hx(scrub), 
        py: y(HIST[scrub]), 
        value: fmt(HIST[scrub]), 
        context: ago === 0 ? `Now · ${proxies} proxies` : `${ago}w ago · ${proxies} proxies`, 
        color: undefined as string | undefined 
      }
    }
    return null
  })()

  return (
    <div className="w-full max-w-[520px] mx-auto" style={{ fontFamily: SANS }}>
      {/* header — mean target + potential (KPI-style big number) */}
      <div className="mb-2 flex items-end justify-between px-1">
        <div>
          <div className="text-[10px] uppercase tracking-[0.14em] text-foreground/40 font-semibold">Attendance Target · 12wk</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-[22px] font-bold tabular-nums tracking-[-0.02em] text-foreground/90">{fmt(TARGETS[0].value)}</span>
            <span className="text-[12px] font-medium tabular-nums" style={{ color: GREEN }}>+{pct(TARGETS[0].value).toFixed(1)}%</span>
          </div>
        </div>
        <div className="text-right text-[11px] tabular-nums font-medium" style={{ color: TEXT_MUTED }}>Now {fmt(CURRENT)}</div>
      </div>

      <div className="relative mx-auto w-full aspect-[520/236]" style={{ maxWidth: W }}>
        <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} className="block cursor-crosshair overflow-visible" onPointerMove={onMove} onPointerLeave={() => setScrub(null)}>
          {/* faint gridlines + left price axis */}
          {[100, 90, 80, 70, 60].map((v) => (
            <g key={v}>
              <line x1={PAD.l} y1={y(v)} x2={geo.endX} y2={y(v)} stroke="hsl(var(--foreground) / 0.04)" strokeDasharray="2 5" />
              <text x={PAD.l - 7} y={y(v) + 3} textAnchor="end" fontSize={8.5} fill="hsl(var(--foreground) / 0.32)" className="tabular-nums">
                {v}%
              </text>
            </g>
          ))}

          {/* bottom date axis — history → now → 12mo target horizon */}
          {[
            { x: geo.hx(0), t: "12w ago", a: 'start' as const },
            { x: geo.hx(6), t: "6w ago", a: 'middle' as const },
            { x: geo.nowX, t: 'Now', a: 'middle' as const },
            { x: geo.endX, t: "In 12w", a: 'middle' as const },
          ].map((d) => (
            <text key={d.t} x={d.x} y={H - 8} textAnchor={d.a} fontSize={8.5} fill="hsl(var(--foreground) / 0.30)">
              {d.t}
            </text>
          ))}

          {/* projection band */}
          <motion.path
            d={geo.band}
            fill={`color-mix(in srgb, ${BLUE} 6%, transparent)`}
            initial={{ opacity: reduced ? 1 : 0 }}
            animate={{ opacity: hotT === null ? 1 : 0.22 }}
            transition={reduced ? { duration: 0 } : { duration: 0.5, ease: EASE, delay: 0.9 }}
          />

          {/* now marker */}
          <line x1={geo.nowX} y1={PAD.t} x2={geo.nowX} y2={H - PAD.b} stroke="hsl(var(--foreground) / 0.12)" strokeWidth={1} strokeDasharray="3 3" />

          {/* history */}
          <motion.path
            d={geo.line}
            fill="none"
            stroke="hsl(var(--foreground) / 0.78)"
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: reduced ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={reduced ? { duration: 0 } : { duration: 0.9, ease: EASE }}
          />

          {/* projections + target labels */}
          {geo.proj.map((p, i) => {
            const on = hotT === i
            const dim = hotT !== null && !on
            return (
              <motion.g
                key={p.key}
                initial={{ opacity: reduced ? 1 : 0 }}
                animate={{ opacity: dim ? 0.26 : 1 }}
                transition={reduced ? { duration: 0 } : { duration: 0.5, ease: EASE, delay: 0.9 + i * 0.12 }}
                onMouseEnter={() => setHotT(i)}
                onMouseLeave={() => setHotT(null)}
                style={{ cursor: 'default' }}
              >
                <path d={p.d} fill="none" stroke="transparent" strokeWidth={16} />
                <path d={p.d} fill="none" stroke={p.color} strokeWidth={on ? 2.2 : 1.4} strokeOpacity={on ? 1 : 0.7} strokeDasharray="2 4" vectorEffect="non-scaling-stroke" />
                <circle cx={geo.endX} cy={p.ty} r={on ? 4 : 3.2} fill={SURFACE} stroke={p.color} strokeWidth={1.6} />
                <text x={geo.endX + 10} y={p.ty - 2.5} fontSize={8} fill="hsl(var(--foreground) / 0.40)">{p.key}</text>
                <text x={geo.endX + 10} y={p.ty + 8} fontSize={10.5} fontWeight={600} fill={p.color} className="tabular-nums">{fmt(p.value)}</text>
              </motion.g>
            )
          })}

          {/* now dot */}
          <motion.circle cx={geo.nowX} cy={geo.nowY} r={3.2} fill="currentColor" initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} transition={reduced ? { duration: 0 } : { delay: 0.85 }} />

          {/* scrub crosshair */}
          {scrub !== null && (
            <g pointerEvents="none">
              <line x1={geo.hx(scrub)} y1={PAD.t} x2={geo.hx(scrub)} y2={H - PAD.b} stroke="hsl(var(--foreground) / 0.22)" strokeWidth={1} />
              <circle cx={geo.hx(scrub)} cy={y(HIST[scrub])} r={3.2} fill="currentColor" stroke={SURFACE} strokeWidth={1.5} />
            </g>
          )}
        </svg>

        {/* overlay — value big, context muted (KPI-card read) */}
        {overlay && (
          <div
            className="pointer-events-none absolute z-10 rounded-lg border px-2.5 py-1.5 shadow-sm"
            style={{
              width: CARD_W,
              left: `calc(${(overlay.px / W) * 100}% ${overlay.px < W / 2 ? '+ 14px' : `- ${CARD_W + 14}px`})`,
              top: `${(Math.max(2, Math.min(H - 44, overlay.py - 18)) / H) * 100}%`,
              background: SURFACE_RAISED,
              borderColor: HAIRLINE,
            }}
          >
            <div className="text-[13px] font-semibold tabular-nums" style={{ color: overlay.color ?? TEXT }}>{overlay.value}</div>
            <div className="mt-0.5 text-[10px]" style={{ color: TEXT_MUTED }}>{overlay.context}</div>
          </div>
        )}
      </div>
    </div>
  )
}

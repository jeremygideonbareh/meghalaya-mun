import points from '../data/globe.json'

/**
 * A dotted Earth on a 2D canvas: orthographic projection of ~2,400 land
 * points (Natural Earth), drag to spin with inertia, slow auto-rotation, and
 * an orange beacon over Shillong. No WebGL, no library.
 */
export type GlobeOptions = {
  /** called with a setter so scroll can steer the globe (0..1 progress) */
  onReady?: (api: GlobeApi) => void
  animate: boolean
}

export type GlobeApi = {
  /** rotate so that this lng/lat faces the viewer, blended by `amount` 0..1 */
  steer: (amount: number) => void
  destroy: () => void
}

const HOME = { lat: 25.57, lng: 91.88 } // Shillong
const RAD = Math.PI / 180
const DOTS = points as number[]

export function createGlobe(canvas: HTMLCanvasElement, opts: GlobeOptions): GlobeApi {
  const ctx = canvas.getContext('2d')!
  let w = 0
  let h = 0
  let r = 0
  let dpr = 1

  // Rotation state: longitude spin (lambda) and tilt (phi)
  let lambda = -20
  let phi = -18
  let velocity = 0.06
  let steerAmount = 0
  let dragging = false
  let lastX = 0
  let lastY = 0
  let raf = 0
  let t = 0

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    dpr = Math.min(2, window.devicePixelRatio || 1)
    w = rect.width
    h = rect.height
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    r = Math.min(w, h) * 0.46
  }

  const project = (lat: number, lng: number, lam: number, ph: number) => {
    const la = lat * RAD
    const lo = (lng + lam) * RAD
    const p = ph * RAD
    const x = Math.cos(la) * Math.sin(lo)
    const y0 = Math.sin(la)
    const z0 = Math.cos(la) * Math.cos(lo)
    // tilt around the x axis
    const y = y0 * Math.cos(p) - z0 * Math.sin(p)
    const z = y0 * Math.sin(p) + z0 * Math.cos(p)
    return { x: w / 2 + x * r, y: h / 2 - y * r, z }
  }

  const draw = () => {
    // Blend free rotation with "face Shillong" as the page asks
    // take the short way round, however many turns the globe has made
    const diff = ((((-HOME.lng - lambda) % 360) + 540) % 360) - 180
    const lam = lambda + diff * steerAmount
    const ph = phi + (HOME.lat - phi) * steerAmount

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)

    // Ocean disc with a soft rim
    const g = ctx.createRadialGradient(w / 2 - r * 0.3, h / 2 - r * 0.35, r * 0.1, w / 2, h / 2, r)
    g.addColorStop(0, '#3f8ae0')
    g.addColorStop(1, '#1f5aa6')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2)
    ctx.fill()

    // Graticule: a few parallels, faint
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'
    ctx.lineWidth = 1
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath()
      let started = false
      for (let lng = -180; lng <= 180; lng += 6) {
        const p = project(lat, lng, lam, ph)
        if (p.z < 0) {
          started = false
          continue
        }
        if (!started) ctx.moveTo(p.x, p.y)
        else ctx.lineTo(p.x, p.y)
        started = true
      }
      ctx.stroke()
    }

    // Land dots, sized and faded by depth
    const size = Math.max(1.1, r / 150)
    for (let i = 0; i < DOTS.length; i += 2) {
      const p = project(DOTS[i], DOTS[i + 1], lam, ph)
      if (p.z <= 0.02) continue
      ctx.globalAlpha = 0.35 + p.z * 0.65
      ctx.fillStyle = '#fffcf5'
      ctx.beginPath()
      ctx.arc(p.x, p.y, size * (0.65 + p.z * 0.45), 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1

    // Shillong beacon with expanding rings
    const home = project(HOME.lat, HOME.lng, lam, ph)
    if (home.z > 0) {
      for (let k = 0; k < 3; k++) {
        const phase = ((t / 1600 + k / 3) % 1 + 1) % 1
        ctx.strokeStyle = `rgba(242,107,29,${(1 - phase) * 0.9})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(home.x, home.y, 6 + phase * r * 0.18, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.fillStyle = '#f26b1d'
      ctx.beginPath()
      ctx.arc(home.x, home.y, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#fffcf5'
      ctx.beginPath()
      ctx.arc(home.x, home.y, 2.4, 0, Math.PI * 2)
      ctx.fill()
      if (home.z > 0.35) {
        // label in a pill, clear of the rings
        const fs = Math.max(12, r / 20)
        ctx.font = `600 ${fs}px "Geist Mono Variable", monospace`
        const label = 'SHILLONG'
        const tw = ctx.measureText(label).width
        const lx = home.x + r * 0.2 + 8
        const ly = home.y - fs * 0.9
        ctx.globalAlpha = Math.min(1, (home.z - 0.35) * 3)
        ctx.fillStyle = '#13223a'
        ctx.beginPath()
        ctx.roundRect(lx - 10, ly - fs, tw + 20, fs * 1.8, fs * 0.9)
        ctx.fill()
        ctx.fillStyle = '#fffcf5'
        ctx.fillText(label, lx, ly + fs * 0.35)
        ctx.strokeStyle = 'rgba(19,34,58,0.9)'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(home.x + 6, home.y)
        ctx.lineTo(lx - 10, ly)
        ctx.stroke()
        ctx.globalAlpha = 1
      }
    }
  }

  const tick = (now: number) => {
    t = now
    if (!dragging) {
      lambda += velocity
      // ease back to a gentle cruise after a flick
      velocity += (0.06 - velocity) * 0.02
    }
    draw()
    if (visible) raf = requestAnimationFrame(tick)
  }

  // Horizontal drag spins; vertical drag tilts a little. Page scroll is left alone.
  const down = (e: PointerEvent) => {
    dragging = true
    lastX = e.clientX
    lastY = e.clientY
    velocity = 0
    canvas.setPointerCapture(e.pointerId)
    canvas.style.cursor = 'grabbing'
  }
  const move = (e: PointerEvent) => {
    if (!dragging) return
    const dx = e.clientX - lastX
    const dy = e.clientY - lastY
    lastX = e.clientX
    lastY = e.clientY
    const k = 180 / (Math.PI * r)
    lambda += dx * k
    phi = Math.max(-60, Math.min(60, phi + dy * k * 0.6))
    velocity = dx * k
    if (!opts.animate) draw()
  }
  const up = (e: PointerEvent) => {
    dragging = false
    canvas.releasePointerCapture?.(e.pointerId)
    canvas.style.cursor = 'grab'
  }

  resize()
  canvas.style.cursor = 'grab'
  canvas.addEventListener('pointerdown', down)
  canvas.addEventListener('pointermove', move)
  canvas.addEventListener('pointerup', up)
  canvas.addEventListener('pointercancel', up)
  const ro = new ResizeObserver(() => {
    resize()
    draw()
  })
  ro.observe(canvas)

  // Only spin while the globe is on screen
  let visible = false
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    cancelAnimationFrame(raf)
    if (visible && opts.animate) raf = requestAnimationFrame(tick)
  })
  io.observe(canvas)

  if (!opts.animate) {
    steerAmount = 1
    draw()
  }

  const api: GlobeApi = {
    steer: (amount) => {
      steerAmount = Math.max(0, Math.min(1, amount))
      if (!opts.animate) draw()
    },
    destroy: () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener('pointerdown', down)
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerup', up)
      canvas.removeEventListener('pointercancel', up)
    },
  }
  opts.onReady?.(api)
  return api
}

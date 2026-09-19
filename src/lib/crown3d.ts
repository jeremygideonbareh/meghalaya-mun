import {
  AmbientLight,
  CylinderGeometry,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  Shape,
  SphereGeometry,
  TorusGeometry,
  WebGLRenderer,
} from 'three'

/**
 * MMUN's crown as a real 3D object: the logo's outline extruded into a solid,
 * two bands beneath it and five orange gems on the points. It floats, leans
 * towards the pointer, and turns as the page scrolls.
 */
export type CrownApi = {
  /** 0..1 scroll progress through the section */
  scroll: (p: number) => void
  destroy: () => void
}

// Outline of the crown from the logo, in its 120 x 90 drawing grid
const OUTLINE: [number, number][] = [
  [14, 64], [8, 26], [30, 44], [40, 14], [52, 40], [60, 6], [68, 40], [80, 14], [90, 44], [112, 26], [106, 64],
]
const GEMS: [number, number][] = [[8, 26], [40, 14], [60, 6], [80, 14], [112, 26]]

export function createCrown(canvas: HTMLCanvasElement, animate: boolean): CrownApi {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))

  const scene = new Scene()
  const camera = new PerspectiveCamera(32, 1, 0.1, 100)
  camera.position.set(0, 0.4, 9)

  // Light it like a stage: soft fill, a key from above left, a warm rim
  scene.add(new AmbientLight(0xffffff, 0.55))
  const key = new DirectionalLight(0xffffff, 2.2)
  key.position.set(-4, 6, 6)
  scene.add(key)
  const rim = new PointLight(0xff9e0f, 40, 20)
  rim.position.set(4, -1, -3)
  scene.add(rim)
  const fill = new PointLight(0xffcc99, 25, 20)
  fill.position.set(3, 3, 5)
  scene.add(fill)

  // Build the crown in grid units, then centre and scale it down
  const toWorld = ([x, y]: [number, number]) => [(x - 60) / 22, -(y - 45) / 22] as const
  const shape = new Shape()
  OUTLINE.forEach((p, i) => {
    const [x, y] = toWorld(p)
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  })
  shape.closePath()

  const blue = new MeshPhysicalMaterial({ color: 0x7d0000, roughness: 0.28, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.15 })
  const cream = new MeshPhysicalMaterial({ color: 0xf5e5cc, roughness: 0.35, metalness: 0.05, clearcoat: 0.6 })
  const orange = new MeshPhysicalMaterial({ color: 0xff9e0f, roughness: 0.15, metalness: 0.1, clearcoat: 1, emissive: 0x7a3a00, emissiveIntensity: 0.35 })

  const crown = new Group()
  const body = new Mesh(
    new ExtrudeGeometry(shape, { depth: 0.55, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.08, bevelSegments: 4 }),
    blue,
  )
  body.position.z = -0.275
  crown.add(body)

  // The two bands under the crown become rounded bars
  for (const [y, w] of [[72, 88], [80, 82]] as const) {
    const bar = new Mesh(new CylinderGeometry(0.13, 0.13, w / 22, 32), cream)
    bar.rotation.z = Math.PI / 2
    const [, wy] = toWorld([60, y])
    bar.position.set(0, wy, 0)
    crown.add(bar)
  }

  // Gems, each with a thin ring so they read as set stones
  GEMS.forEach(([gx, gy]) => {
    const [x, y] = toWorld([gx, gy])
    const gem = new Mesh(new SphereGeometry(gy === 6 ? 0.27 : 0.22, 32, 24), orange)
    gem.position.set(x, y, 0)
    crown.add(gem)
    const ring = new Mesh(new TorusGeometry(gy === 6 ? 0.3 : 0.25, 0.035, 12, 40), cream)
    ring.position.set(x, y, 0)
    crown.add(ring)
  })
  scene.add(crown)

  // Pointer leaning and scroll turning
  let targetX = 0
  let targetY = 0
  let scrollTurn = 0
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect()
    targetY = Math.max(-0.35, Math.min(0.35, ((e.clientX - r.left) / r.width - 0.5) * 0.9))
    targetX = ((e.clientY - r.top) / r.height - 0.5) * 0.5
  }
  window.addEventListener('pointermove', onMove)

  const resize = () => {
    // layout size, so scroll-driven transforms never shrink the render
    const r = { width: canvas.clientWidth, height: canvas.clientHeight }
    renderer.setSize(r.width, r.height, false)
    camera.aspect = r.width / Math.max(1, r.height)
    // pull the camera back on narrow screens so the whole crown fits
    camera.position.z = camera.aspect < 0.8 ? 15.5 : camera.aspect < 1.4 ? 13 : 10.5
    camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  let raf = 0
  let visible = false
  const start = performance.now()
  const frame = (now: number) => {
    const t = (now - start) / 1000
    crown.rotation.y += (0.26 + targetY + scrollTurn + Math.sin(t * 0.5) * 0.18 - crown.rotation.y) * 0.06
    crown.rotation.x += (targetX + Math.sin(t * 0.7) * 0.05 - crown.rotation.x) * 0.06
    crown.position.y = Math.sin(t * 1.1) * 0.12
    renderer.render(scene, camera)
    if (visible) raf = requestAnimationFrame(frame)
  }

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    cancelAnimationFrame(raf)
    if (visible && animate) raf = requestAnimationFrame(frame)
    else if (visible) renderer.render(scene, camera)
  })
  io.observe(canvas)

  return {
    scroll: (p) => {
      // a sway across the section, never so far that the crown turns edge-on
      scrollTurn = Math.sin(p * Math.PI * 2) * 0.55
      if (!animate) {
        crown.rotation.y = 0.26 + scrollTurn
        renderer.render(scene, camera)
      }
    },
    destroy: () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      renderer.dispose()
    },
  }
}

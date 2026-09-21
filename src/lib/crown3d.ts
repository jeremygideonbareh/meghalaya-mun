import {
  AmbientLight,
  Box3,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import logo from '../data/logo.json'

/**
 * MMUN's crown as a real 3D object: the official logo's silhouette, holes
 * and all, extruded into a solid. It floats, leans towards the pointer, and
 * turns as the page scrolls.
 */
export type CrownApi = {
  /** 0..1 scroll progress through the section */
  scroll: (p: number) => void
  destroy: () => void
}

// about 4.8 world units wide, so the tall crown fits the stage with room to bob
const SCALE = 4.8 / logo.crown.width

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

  // The logo's path, even-odd, becomes shapes with holes; extrude them
  const svg = `<svg xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="${logo.crown.d}"/></svg>`
  const shapes = new SVGLoader().parse(svg).paths.flatMap((path) => SVGLoader.createShapes(path))
  const geometry = new ExtrudeGeometry(shapes, {
    depth: 60,
    bevelEnabled: true,
    bevelThickness: 6,
    bevelSize: 2.5,
    bevelSegments: 3,
  })
  // SVG y runs down: turn it upright (a rotation keeps the faces facing out),
  // scale to world units and centre on the origin
  geometry.rotateX(Math.PI)
  geometry.scale(SCALE, SCALE, SCALE)
  geometry.computeBoundingBox()
  const centre = (geometry.boundingBox ?? new Box3()).getCenter(new Vector3())
  geometry.translate(-centre.x, -centre.y, -centre.z)

  const champagne = new MeshPhysicalMaterial({ color: 0xf5e5cc, roughness: 0.28, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.15 })
  const crown = new Group()
  crown.add(new Mesh(geometry, champagne))
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
      geometry.dispose()
      champagne.dispose()
      renderer.dispose()
    },
  }
}

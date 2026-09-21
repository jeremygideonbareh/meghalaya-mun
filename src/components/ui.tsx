import type { ImgHTMLAttributes, SVGProps } from 'react'
import { img } from '../lib/img'
import logo from '../data/logo.json'

type PictureProps = {
  name: string
  alt: string
  sizes: string
  eager?: boolean
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'sizes' | 'alt'>

export function Picture({ name, alt, sizes, eager, className, ...rest }: PictureProps) {
  const i = img(name)
  return (
    <img
      src={i.src}
      srcSet={i.srcSet}
      sizes={sizes}
      width={i.width}
      height={i.height}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
      className={className}
      {...rest}
    />
  )
}

/**
 * The official MMUN logo, traced from the secretariat's artwork by
 * tools/trace_logo.py. Both shapes are defined once in <LogoDefs /> and
 * drawn with <use>, so the page carries the paths a single time.
 */
export function LogoDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
      <defs>
        <path id="mmun-crown" fillRule="evenodd" d={logo.crown.d} />
        <path id="mmun-wordmark" fillRule="evenodd" d={logo.wordmark.d} />
      </defs>
    </svg>
  )
}

/** The MMUN crown, filled in the current text colour. */
export function Crown(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={`0 0 ${logo.crown.width} ${logo.crown.height}`} fill="currentColor" aria-hidden {...p}>
      <use href="#mmun-crown" />
    </svg>
  )
}

/** The MMUN lettering from the logo lockup. */
export function Wordmark(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={`0 0 ${logo.wordmark.width} ${logo.wordmark.height}`} fill="currentColor" aria-hidden {...p}>
      <use href="#mmun-wordmark" />
    </svg>
  )
}

/** Olive-branch laurel, for UN committees. */
export function Laurel(p: SVGProps<SVGSVGElement>) {
  const leaves = Array.from({ length: 7 }, (_, i) => i)
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden {...p}>
      <circle cx="50" cy="46" r="20" stroke="currentColor" strokeWidth="2.4" />
      <path d="M30 46h40M50 26v40M36 32c9 6 19 6 28 0M36 60c9-6 19-6 28 0" stroke="currentColor" strokeWidth="1.6" />
      {leaves.map((i) => {
        const a = (200 + i * 20) * (Math.PI / 180)
        const b = (-20 - i * 20) * (Math.PI / 180)
        return (
          <g key={i} fill="currentColor">
            <ellipse cx={50 + Math.cos(a) * 34} cy={50 - Math.sin(a) * 34} rx="3.2" ry="7" transform={`rotate(${-(200 + i * 20) + 90} ${50 + Math.cos(a) * 34} ${50 - Math.sin(a) * 34})`} />
            <ellipse cx={50 + Math.cos(b) * 34} cy={50 - Math.sin(b) * 34} rx="3.2" ry="7" transform={`rotate(${20 + i * 20 + 90} ${50 + Math.cos(b) * 34} ${50 - Math.sin(b) * 34})`} />
          </g>
        )
      })}
    </svg>
  )
}

/** Pillared chamber, for India's parliamentary committees. */
export function Chamber(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden {...p}>
      <path d="M14 38 50 16l36 22Z" strokeLinejoin="round" />
      <path d="M18 44h64M18 80h64M14 88h72" strokeLinecap="round" />
      {[26, 40, 54, 68].map((x) => (
        <path key={x} d={`M${x} 48v28`} strokeLinecap="round" />
      ))}
    </svg>
  )
}

/** Camera, for the International Press Corps. */
export function Press(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden {...p}>
      <rect x="14" y="30" width="72" height="50" rx="8" />
      <path d="M36 30l6-10h16l6 10" strokeLinejoin="round" />
      <circle cx="50" cy="55" r="15" />
      <circle cx="50" cy="55" r="7" />
    </svg>
  )
}

export function Arrow(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

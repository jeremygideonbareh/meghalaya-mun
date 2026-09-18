import manifest from '../data/images.json'

type Entry = { widths: number[]; ratio: number }
const images = manifest as Record<string, Entry>
const base = import.meta.env.BASE_URL

export function img(name: string) {
  const entry = images[name]
  if (!entry) throw new Error(`Unknown image: ${name}`)
  const src = (w: number) => `${base}img/${name}-${w}.webp`
  const largest = entry.widths[entry.widths.length - 1]
  return {
    src: src(entry.widths[0]),
    srcSet: entry.widths.map((w) => `${src(w)} ${w}w`).join(', '),
    width: largest,
    height: Math.round(largest / entry.ratio),
  }
}

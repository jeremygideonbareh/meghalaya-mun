import { useEffect } from 'react'
import { Committees, Frames, Join, Manifesto, Numbers, Partners, Recognition, Speaker, Theme } from './components/Chapters'
import { Chrome } from './components/Chrome'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Placard, Team, World } from './components/Interactive'

export default function App() {
  useEffect(() => {
    const html = document.documentElement
    const ready = () => {
      html.classList.add('app-ready')
      window.dispatchEvent(new Event('app:ready'))
    }
    if (html.dataset.motion === 'off') {
      ready()
      return
    }
    let stop: (() => void) | undefined
    let cancelled = false
    import('./lib/cinema').then(({ startCinema }) => {
      if (cancelled) return
      stop = startCinema()
      ready()
    })
    return () => {
      cancelled = true
      stop?.()
    }
  }, [])

  return (
    <>
      <a href="#manifesto" className="sr-only z-[150] rounded-full bg-gold px-5 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
        Skip the intro
      </a>
      <Chrome />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <Hero />
            <Manifesto />
            <World />
            <Theme />
            <Numbers />
            <Committees />
            <Speaker />
            <Team />
            <Frames />
            <Recognition />
            <Partners />
            <Placard />
            <Join />
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}

import { edition, org } from '../data/content'
import { Crown } from './ui'

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pt-20 pb-10 text-paper">
      <div className="wrap grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Crown data-footer-crown className="h-16 w-20 text-orange" />
          <p className="mt-6 max-w-sm font-display text-2xl">{org.name}</p>
          <p className="mt-2 text-paper/70">{org.registered}.</p>
        </div>
        <div>
          <p className="kicker text-orange">Find us</p>
          <ul className="mt-4 grid gap-2 text-paper/85">
            <li>
              <a className="hover:text-orange" href={org.instagram} target="_blank" rel="noopener">
                Instagram · @{org.handle}
              </a>
            </li>
            <li>
              <a className="hover:text-orange" href={org.facebook} target="_blank" rel="noopener">
                Facebook · /meghalayamun
              </a>
            </li>
            <li>
              <a className="hover:text-orange" href={org.whatsappCommunity} target="_blank" rel="noopener">
                WhatsApp community
              </a>
            </li>
            <li>
              <a className="hover:text-orange" href={`mailto:${org.email}`}>
                {org.email}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="kicker text-orange">Documents</p>
          <ul className="mt-4 grid gap-2 text-paper/85">
            <li>
              <a className="hover:text-orange" href={org.brochure} target="_blank" rel="noopener">
                MMUN ’26 brochure
              </a>
            </li>
            <li>
              <a className="hover:text-orange" href={org.itinerary} target="_blank" rel="noopener">
                2026 itinerary
              </a>
            </li>
          </ul>
          <p className="mt-6 grid gap-1 text-sm text-paper/70">
            <span>{edition.title}</span>
            <span>
              {edition.dates} <span className="whitespace-nowrap">· {edition.venue}, {edition.city}</span>
            </span>
          </p>
        </div>
      </div>

      <p
        data-wordmark
        aria-hidden
        className="mt-16 overflow-hidden text-center font-display text-[clamp(5rem,26vw,24rem)] leading-[0.8] font-medium tracking-[-0.05em] whitespace-nowrap text-orange select-none"
      >
        MMUN
      </p>

      <div className="wrap mt-8 flex flex-col justify-between gap-3 text-sm text-paper/70 sm:flex-row">
        <p>© {new Date().getFullYear()} Meghalaya Model United Nations. Photographs from MMUN’s own brochure and Instagram.</p>
        <a href="#top" className="hover:text-orange">
          Back to the top ↑
        </a>
      </div>
    </footer>
  )
}

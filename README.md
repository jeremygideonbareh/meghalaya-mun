# Meghalaya Model United Nations

Single-page cinematic site for [@meghalaya_mun](https://www.instagram.com/meghalaya_mun/), built around the 7th International Shillong Edition (theme: Renovar · Renasci · Renascentia).

## Content

Everything on the page is in `src/data/content.ts`, sourced from their Instagram and the official 24-page MMUN_26 brochure linked from their Linktree. Photos are cropped from that brochure (`source-photos/brochure/`) by `npm run images` (Python + Pillow).

## Motion

GSAP 3.15 with ScrollTrigger, ScrollSmoother, SplitText and DrawSVG, all in `src/lib/cinema.ts`. Sections opt in through `data-*` attributes. The title sequence is inline in `index.html` so it plays before any JavaScript loads. A Motion toggle in the header lets anyone switch animation off; people whose system asks for reduced motion start with it off.

## Type

Ranade by Indian Type Foundry (Fontshare, ITF Free Font License, self-hosted in `public/fonts/`), with Geist and Geist Mono.

## Develop

```bash
npm install
npm run dev
```

`npm run build` type-checks, builds and pre-renders `dist/index.html`. Pushing to `main` deploys to GitHub Pages.

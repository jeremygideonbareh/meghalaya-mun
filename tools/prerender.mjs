// Inject the server-rendered app into dist/index.html so the first paint needs no JavaScript.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = path.resolve(import.meta.dirname, '..')
const { render } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href)
const file = path.join(root, 'dist/index.html')
const html = fs.readFileSync(file, 'utf8')
if (!html.includes('<div id="root"></div>')) throw new Error('root placeholder not found')
let out = html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`)

// Inline the (small) stylesheet so the first paint needs a single request
out = out.replace(/<link rel="stylesheet" crossorigin href="([^"]+)">/, (_, href) => {
  const css = fs.readFileSync(path.join(root, 'dist', href.replace(/^\/meghalaya-mun\//, '')), 'utf8')
  return `<style>${css}</style>`
})
fs.writeFileSync(file, out)
fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true })
console.log('prerendered dist/index.html')

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import RuletaApp from './RuletaApp.tsx'

// No router dependency for two static pages — strip the Vite base ("/" in
// dev, "/dnd/" in the GitHub Pages build) off the real pathname and match
// what's left. Navigation between pages is a plain <a href>, so this only
// ever needs to run once at load.
function normalizePath(pathname: string): string {
  let base = import.meta.env.BASE_URL
  if (base.length > 1 && base.endsWith('/')) base = base.slice(0, -1)
  let path = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname
  if (!path.startsWith('/')) path = '/' + path
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
  return path
}

const page = normalizePath(window.location.pathname) === '/ruleta' ? <RuletaApp /> : <App />

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {page}
  </StrictMode>,
)

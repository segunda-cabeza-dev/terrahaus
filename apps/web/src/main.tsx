import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './shared/i18n/config'
import App from './App.tsx'

declare global {
  interface ImportMetaEnv {
    readonly VITE_GTM_ID?: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

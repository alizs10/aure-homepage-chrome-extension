import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Wrappers from './Wrappers.tsx'
import App from './App.tsx'
import './index.css'
import LiquidGlass from './components/ui/LiquidGlass.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Wrappers>
      <LiquidGlass />
      <App />
    </Wrappers>
  </StrictMode>,
)
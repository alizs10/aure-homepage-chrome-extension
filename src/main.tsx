import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Wrappers from './Wrappers.tsx'
import App from './App.tsx'
import './index.css'
import LiquidGlass from './components/ui/LiquidGlass.tsx'

if (import.meta.env.DEV || import.meta.env.MODE === 'scan' || import.meta.env.VITE_REACT_SCAN === 'true') {
  const { scan } = await import('react-scan');
  scan({
    enabled: true,
    dangerouslyForceRunInProduction: true,
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Wrappers>
      <LiquidGlass />
      <App />
    </Wrappers>
  </StrictMode>,
)
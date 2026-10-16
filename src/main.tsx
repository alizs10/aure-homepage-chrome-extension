import { scan } from 'react-scan';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Wrappers from './Wrappers.tsx';
import App from './App.tsx';
import './index.css';
import LiquidGlass from './components/ui/LiquidGlass.tsx';
import { preloadFaviconCache } from './lib/favicon';

if (import.meta.env.DEV) {
  scan({
    enabled: true,
  });
}

// Preload cached favicons into memory for instant synchronous rendering
preloadFaviconCache();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Wrappers>
      <LiquidGlass />
      <App />
    </Wrappers>
  </StrictMode>,
);
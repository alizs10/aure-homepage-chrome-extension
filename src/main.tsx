import './init';
import { scan } from 'react-scan';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { z } from 'zod';
import Wrappers from './Wrappers.tsx';
import App from './App.tsx';
import './index.css';
import LiquidGlass from './components/ui/LiquidGlass.tsx';
import { preloadFaviconCache } from './lib/favicon';
import { isFirefox } from './lib/browser';
import browser from 'webextension-polyfill';

// Configure Zod for strict Content Security Policy (skips new Function() JIT eval probe)
z.config({ jitless: true });

if (import.meta.env.DEV) {
  scan({
    enabled: true,
  });
}

// Preload cached favicons into memory for instant synchronous rendering
preloadFaviconCache();

// 🌟 Firefox focus bypass: immediately swap tab on new tab load to give web content focus
if (isFirefox) {
  if (window.location.hash.includes('focused')) {
    sessionStorage.setItem('aure_focus_bypass', 'true');
    window.history.replaceState(null, '', window.location.pathname + '#/');
  } else if (!sessionStorage.getItem('aure_focus_bypass')) {
    sessionStorage.setItem('aure_focus_bypass', 'swapping');
    const requestSwap = () => {
      if (document.visibilityState !== 'visible') return;
      document.removeEventListener('visibilitychange', requestSwap);
      browser.runtime.sendMessage({ action: 'SWAP_FIREFOX_NEWTAB_FOR_FOCUS' }).catch(() => {});
    };

    if (document.visibilityState === 'visible') {
      requestSwap();
    } else {
      document.addEventListener('visibilitychange', requestSwap);
    }
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Wrappers>
      <LiquidGlass />
      <App />
    </Wrappers>
  </StrictMode>,
);
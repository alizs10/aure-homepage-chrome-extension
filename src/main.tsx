import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Wrappers from './Wrappers.tsx'
import App from './App.tsx'
import './index.css'

// FIX: Check for chrome://newtab/ specifically, because its pathname is just '/'
const isNewTabPage = window.location.href.startsWith('chrome://newtab') ||
  window.location.pathname.endsWith('/newtab.html') ||
  window.location.pathname.endsWith('/index.html');

if (isNewTabPage && window.location.search !== "?focused") {
  // Redirect to the same page with a query parameter to bypass the focus restriction
  window.location.search = "?focused";
} else if (isNewTabPage) {
  // Clean up the URL so the user doesn't see "?focused" in the address bar.
  // We use window.location.pathname to keep the exact path (e.g., /newtab or /newtab.html)
  window.history.replaceState(null, "", window.location.pathname);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Wrappers>

      <App />
    </Wrappers>
  </StrictMode>,
)
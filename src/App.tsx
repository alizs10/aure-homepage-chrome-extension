import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import AppLoader from "./AppLoader";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Wizard from "./pages/Wizard";
import Layout from "./layouts/Layout";
import AppLayout from "./layouts/AppLayout";

export default function App() {
  return (
    <HashRouter>
      <AppLoader>
        <Routes>
          {/* Root Layout wraps EVERYTHING */}
          <Route element={<Layout />}>

            {/* Wizard has NO header, renders directly in Root Layout */}
            <Route path="/wizard" element={<Wizard />} />

            {/* AppLayout wraps Home and Settings */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* ✅ Catch-all route: Redirects any unmatched paths (404) to the Home page */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Route>
        </Routes>
      </AppLoader>
    </HashRouter>
  )
}
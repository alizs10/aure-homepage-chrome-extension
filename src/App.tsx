import { HashRouter, Route, Routes } from "react-router-dom";
import AppLoader from "./AppLoader";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Wizard from "./pages/Wizard";
import UiShowcase from "./pages/UiShowcase"; // 🌟 New Showcase Page
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

            {/* AppLayout wraps Home, Settings, and UI Showcase */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/ui" element={<UiShowcase />} />
            </Route>

          </Route>
        </Routes>
      </AppLoader>
    </HashRouter>
  )
}
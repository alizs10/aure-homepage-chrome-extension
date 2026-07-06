import { HashRouter, Route, Routes } from "react-router-dom";
import AppLoader from "./AppLoader";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Wizard from "./pages/Wizard";


export default function App() {
  return (
    <HashRouter>
      <AppLoader>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wizard" element={<Wizard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>

      </AppLoader>
    </HashRouter>
  )
}

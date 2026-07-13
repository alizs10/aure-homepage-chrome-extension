import { HashRouter, Route, Routes } from "react-router-dom";
import AppLoader from "./AppLoader";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Wizard from "./pages/Wizard";
// import { useMoodTracker } from "./components/widgets/mood-tracker/hooks/useMoodTracker";
// import { useEffect } from "react";
// import { useCalendar } from "./components/widgets/calendar/hooks/useCalendar";
// import { usePetHouse } from "./components/widgets/pet-house/hooks/usePetHouse";
// import { useNotesAndChecklists } from "./components/widgets/notes-and-checklists/hooks/useNotesAndChecklists";
// import { useFavorites } from "./components/settings/components/tabs-details/sites-and-shortcuts/hooks/useFavorites";


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

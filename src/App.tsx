import { useEffect, useState } from "react";
import type { Settings } from "./types/settings";
import { storage } from "./lib/storage";
import Home from "./pages/Home";
import Wizard from "./pages/Wizard";

function App() {

  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState<Settings | null>(null)

  const [pageToDisplay, setPageToDisplay] = useState<'home' | 'wizard'>('home')


  useEffect(() => {

    const loadSettings = async () => {
      const result = await storage.get<Settings>('settings')
      console.log(result)
      if (result) {
        setSettings(result)
      } else {
        setPageToDisplay('wizard')
      }

      setIsLoading(false)
    }


    loadSettings()

  }, [])

  if (isLoading) {
    return <div>loading...</div>
  }

  if (pageToDisplay === 'home' && settings) {
    return <Home settings={settings} />
  }

  return <Wizard />

}

export default App

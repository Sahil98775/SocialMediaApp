import * as SplashScreen from "expo-splash-screen";
import { useState, useEffect, useCallback } from "react";

import AuthScr from "./src/Navigation/AuthScreens";
SplashScreen.preventAutoHideAsync();
export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setAppIsReady(true);
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) return null;

  return <AuthScr />;
}

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import AuthScr from "./AuthScreens";

import { auth } from "../FireBase/FireBaseConfig";
import MainAppTabs from "./MainTab";
const Stack = createNativeStackNavigator();

const RootNav = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null; // you can put a splash/loading screen here

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // If user is logged in, show App Tabs
          <Stack.Screen name="MainAppTabs" component={MainAppTabs} />
        ) : (
          // Otherwise, show Auth screens
          <Stack.Screen name="Auth" component={AuthScr} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNav;

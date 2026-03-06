import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect } from "react";
import AuthScr from "./AuthScreens";
import MainAppTabs from "./MainTab";
import { supabase } from "../SupaBase";

const Stack = createNativeStackNavigator();

const RootNav = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check current session on mount
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // 2. Listen for auth state changes (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return null; // you can render a splash/loading screen here

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="MainAppTabs" component={MainAppTabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthScr} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNav;

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Edits from "../Screens/Profile/Edits/Edit";
import Settings from "../Screens/Profile/settings/Setting";
import AppNav from "./AppNav";
const Stack = createNativeStackNavigator();

const MainAppTabs = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Mains" component={AppNav} />
      <Stack.Screen
        name="Edits"
        component={Edits}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};
export default MainAppTabs;

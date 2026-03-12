import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import Edits from "../Screens/Profile/Edits/Edit";
import Settings from "../Screens/Profile/settings/Setting";
import AppNav from "./AppNav";
import ChatScreen from "../Screens/Messages/ChatScreen";
const Stack = createNativeStackNavigator();

const MainAppTabs = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackground: () => (
          <LinearGradient
            colors={["#FFF2F7", "#FFF5E6"]}
            // colors={["#EEF3FF", "#FFF5E6", "#FFF2F7", "#EEF3FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          />
        ),
      }}
    >
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
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
export default MainAppTabs;

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../Screens/LoginAuth/Login/LoginScreen";
import Register from "../Screens/LoginAuth/Registration/RegistrationScreen";

const Stack = createNativeStackNavigator();

const AuthScr = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AuthScr;

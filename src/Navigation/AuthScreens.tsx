import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../Screens/LoginAuth/Login/LoginScreen";
import Register from "../Screens/LoginAuth/Registration/RegistrationScreen";

const Stack = createNativeStackNavigator();

const AuthScr = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
};
export default AuthScr;

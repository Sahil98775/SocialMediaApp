import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Styles from "./LogStyle";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../FireBase/FireBaseConfig";
import { useState } from "react";
const Login = () => {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and Password are required");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully");
      setError("");

      navigation.navigate("Feed");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("User not found");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password");
      } else {
        setError("Something went wrong");
      }
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={Styles.container}>
        <LinearGradient
          colors={["#7B8FF7", "#DDE7FF", "#F8E1F4", "#FFF5E6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={Styles.container1}
        >
          <Image
            source={require("../../../icon.png")}
            style={{ width: 300, height: 300 }}
            resizeMode="contain"
          />
        </LinearGradient>
        <View style={Styles.container2}>
          <View style={Styles.log}>
            <Text style={Styles.logIn}>Log In</Text>

            <View style={Styles.textBox}>
              <Ionicons name="person" color={"grey"} size={22} />
              <TextInput
                placeholder="Enter your Email"
                style={Styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={Styles.textBox}>
              <Ionicons name="clipboard" color={"grey"} size={22} />
              <TextInput
                placeholder="Enter your Passward"
                style={Styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={{ marginBottom: 40, alignItems: "flex-end" }}>
              <Text style={{ color: "#2D7CF6", fontSize: 15 }}>
                Forget Password?
              </Text>
            </View>

            <TouchableOpacity style={Styles.logbutton} onPress={handleLogin}>
              <Text style={{ color: "#FFFFFF", fontSize: 22 }}>Log In</Text>
            </TouchableOpacity>
          </View>
          <View style={Styles.haveAccount}>
            <Text style={Styles.Sign}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text
                style={{ color: "#2D7CF6", fontWeight: "400", fontSize: 19 }}
              >
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
export default Login;

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
import { useState } from "react";
import { supabase } from "../../../SupaBase";
import FeedScreen from "../../Feeds/Feed";

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
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) {
        if (loginError.message.includes("Invalid login credentials")) {
          setError("Incorrect email or password");
        } else if (loginError.message.includes("User not found")) {
          setError("User not found");
        } else {
          setError(loginError.message);
        }
        return;
      }

      console.log("User logged in successfully:", data.user);
      setError("");

      // Navigate to FeedScreen
      navigation.navigate("FeedScreen");
    } catch (err: any) {
      console.log("Unexpected error:", err);
      setError("Something went wrong");
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
                placeholderTextColor={"grey"}
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
                placeholder="Enter your Password"
                placeholderTextColor={"grey"}
                style={Styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {error ? (
              <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
            ) : null}

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
            <TouchableOpacity
              onPress={navigation.navigate("Mains", {
                screen: "Profile",
              })}
            >
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

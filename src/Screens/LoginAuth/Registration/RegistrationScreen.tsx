import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Styles from "./RegStyle";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { supabase } from "../../../SupaBase";
import {
  validationRegistration,
  RegistrationErrors,
} from "../../../Utils/validation";

const Register = () => {
  const navigation = useNavigation<any>();
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    const validationErrors = validationRegistration(
      username,
      email,
      phone,
      password,
      confirmPassword
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // 1. Sign up user with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setErrors({ email: "Email already in use" });
        } else {
          setErrors({ email: signUpError.message });
        }
        return;
      }

      // 2. Create user profile in "profiles" table
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          user_id: data.user?.id, // Supabase user ID
          username: username,
          phone: phone,
          email: email,
        },
      ]);

      if (profileError) {
        setErrors({
          email: "Profile creation failed: " + profileError.message,
        });
        return;
      }

      console.log("User registered successfully:", data.user);

      // Reset fields
      setUsername("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setErrors({});

      // Navigate to Login
      navigation.navigate("Login");
    } catch (err: any) {
      console.log("Unexpected error:", err);
      setErrors({ email: "Something went wrong" });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView>
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
          {/* Username */}
          <Text style={Styles.heading}>UserName</Text>
          <View style={Styles.textBox}>
            <Ionicons name="person" color={"grey"} size={22} />
            <TextInput
              placeholder="Enter your UserName"
              placeholderTextColor={"grey"}
              style={Styles.input}
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setErrors((prev) => ({ ...prev, username: undefined }));
              }}
            />
          </View>
          {errors.username && (
            <Text style={{ color: "red" }}>{errors.username}</Text>
          )}

          {/* Email */}
          <Text style={Styles.heading}>Email</Text>
          <View style={Styles.textBox}>
            <Ionicons name="mail" color={"grey"} size={22} />
            <TextInput
              placeholder="Enter your Email"
              placeholderTextColor={"grey"}
              style={Styles.input}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {errors.email && <Text style={{ color: "red" }}>{errors.email}</Text>}

          {/* Phone */}
          <Text style={Styles.heading}>Phone Number</Text>
          <View style={Styles.textBox}>
            <Ionicons name="call" color={"grey"} size={22} />
            <TextInput
              placeholder="Enter Phone Number"
              placeholderTextColor={"grey"}
              style={Styles.input}
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              keyboardType="number-pad"
            />
          </View>
          {errors.phone && <Text style={{ color: "red" }}>{errors.phone}</Text>}

          {/* Password */}
          <Text style={Styles.heading}>Password</Text>
          <View style={Styles.textBox}>
            <Ionicons name="lock-closed" color={"grey"} size={22} />
            <TextInput
              placeholder="Enter Password"
              placeholderTextColor={"grey"}
              style={Styles.input}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              secureTextEntry
            />
          </View>
          {errors.password && (
            <Text style={{ color: "red" }}>{errors.password}</Text>
          )}

          {/* Confirm Password */}
          <View style={[Styles.textBox, { marginTop: 15 }]}>
            <Ionicons name="lock-closed" color={"grey"} size={22} />
            <TextInput
              placeholder="Re-Enter Password"
              placeholderTextColor={"grey"}
              style={Styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
          {errors.confirmPassword && (
            <Text style={{ color: "red" }}>{errors.confirmPassword}</Text>
          )}

          {/* Sign Up Button */}
          <TouchableOpacity style={Styles.logbutton} onPress={handleRegister}>
            <Text style={{ color: "#FFFFFF", fontSize: 22 }}>Sign Up</Text>
          </TouchableOpacity>

          <View style={Styles.haveAccount}>
            <Text numberOfLines={3} style={Styles.Sign}>
              By signing up, you agree to our{" "}
              <Text style={{ color: "#2D7CF6", fontSize: 16 }}>
                Terms of service and Privacy Policy.
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;

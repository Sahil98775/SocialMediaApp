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
import {
  validationRegistration,
  RegistrationErrors,
  User,
} from "../../../Utils/validation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../FireBase/FireBaseConfig";
import { doc, setDoc } from "firebase/firestore";

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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username: username,
        phone: phone,
        email: email,
      });

      console.log("User registered successfully");
      setUsername("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setErrors({});

      navigation.navigate("Login");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setErrors({ email: "Email already in use" });
      } else {
        console.error(error);
      }
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
          <Text style={Styles.heading}>Name</Text>
          <View style={Styles.textBox}>
            <Ionicons name="person" color={"grey"} size={22} />
            <TextInput placeholder="Enter your Name" style={Styles.input} />
          </View>
          <Text style={Styles.heading}>UserName</Text>
          <View style={Styles.textBox}>
            <Ionicons name="person" color={"grey"} size={22} />
            <TextInput
              placeholder="Enter your UserName"
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
          <Text style={Styles.heading}>Email</Text>
          <View style={Styles.textBox}>
            <Ionicons name="person" color={"grey"} size={22} />
            <TextInput
              placeholder="Enter your Email"
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
          <Text style={Styles.heading}>Phone Number</Text>
          <View style={Styles.textBox}>
            <Ionicons name="person" color={"grey"} size={22} />
            <TextInput
              placeholder="Enter Phone Number"
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
          <Text style={Styles.heading}>Password</Text>
          <View style={Styles.textBox}>
            <Ionicons name="person" color={"grey"} size={22} />
            <TextInput
              placeholder="Enter Password"
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
          <View style={[Styles.textBox, { marginTop: 15 }]}>
            <Ionicons name="person" color={"grey"} size={22} />
            <TextInput
              placeholder="Re-Enter Password"
              style={Styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
          {errors.confirmPassword && (
            <Text style={{ color: "red" }}>{errors.confirmPassword}</Text>
          )}

          <TouchableOpacity style={Styles.logbutton} onPress={handleRegister}>
            <Text style={{ color: "#FFFFFF", fontSize: 22 }}>Sign Up</Text>
          </TouchableOpacity>

          <View style={Styles.haveAccount}>
            <Text numberOfLines={3} style={Styles.Sign}>
              By signing up, you agree to our
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

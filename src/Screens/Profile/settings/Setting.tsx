import { View, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { RootState } from "../../../Redux/store";
import { Ionicons } from "@expo/vector-icons";
import { toggleTheme } from "../../../Redux/redxSlice";

import React, { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const Settings = () => {
  const navigation = useNavigation<any>();

  const logoutUser = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);

      navigation.replace("LoginScreen");
    } catch (error) {
      console.log("Logout Error:");
    }
  };

  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.mode);
  return (
    <LinearGradient
      colors={
        theme === "light"
          ? ["#7B8FF7", "#DDE7FF", "#F8E1F4", "#FFF5E6"]
          : ["#0A0E17", "#141A29", "#1C2233"]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: theme === "light" ? "#ffffff" : "#141A29",
          margin: 7,
          width: "98%",
          padding: 15,
          borderRadius: 20,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
        onPress={() => dispatch(toggleTheme())}
      >
        <Text
          style={{
            color: theme === "light" ? "#000" : "#ffffff",
            fontSize: 30,
            fontWeight: "600",
          }}
        >
          {theme}
        </Text>
        <Ionicons
          name={theme === "light" ? "sunny-sharp" : "moon-sharp"}
          color={"yellow"}
          size={35}
          style={{ position: "absolute", right: 10 }}
        />
      </TouchableOpacity>

      <View
        style={{ backgroundColor: "#FFFFFF", marginBottom: 15, padding: 10 }}
      >
        <Text>Post you liked</Text>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "#9FB1F5",
          marginBottom: 15,
          padding: 10,
          borderRadius: 10,
          borderWidth: 3,
          borderColor: "#FFFFFF",
        }}
        onPress={logoutUser}
      >
        <Text style={{ color: "#FFFFFf", fontSize: 25, padding: 8 }}>
          LogOut
        </Text>
      </TouchableOpacity>
      <View
        style={{ backgroundColor: "#FFFFFF", marginBottom: 15, padding: 10 }}
      >
        <Text>Delete the account</Text>
      </View>
    </LinearGradient>
  );
};
export default Settings;

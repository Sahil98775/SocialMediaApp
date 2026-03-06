import { View, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { RootState } from "../../../Redux/store";
import { Ionicons } from "@expo/vector-icons";
import { toggleTheme } from "../../../Redux/redxSlice";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../../SupaBase";
import React from "react";

const Settings = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.mode);

  const logoutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Logout error:", error.message);
    } else {
      console.log("User logged out successfully");
      navigation.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      });
    }
  };

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
        <Text>Posts you liked</Text>
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
        <Text style={{ color: "#FFFFFF", fontSize: 25, padding: 8 }}>
          Log Out
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

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
        routes: [{ name: "Login" }],
      });
    }
  };

  return (
    <LinearGradient
      colors={
        theme === "light"
          ? ["#FFF2F7", "#FFF5E6"]
          : ["#0A0E17", "#141A29", "#1C2233"]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={{ flex: 1, width: "100%" }}>
        <TouchableOpacity
          style={{
            backgroundColor: theme === "light" ? "#ffffff" : "#141A29",
            margin: 7,
            padding: 15,
            borderRadius: 20,
            borderWidth: 0,
            elevation: 3,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onPress={() => dispatch(toggleTheme())}
        >
          <Text
            style={{
              color: theme === "light" ? "#000" : "#ffffff",
              fontSize: 30,
              fontWeight: "500",
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
          style={{
            backgroundColor: theme === "light" ? "#ffffff" : "#141A29",
            margin: 7,
            padding: 15,
            borderRadius: 20,
            borderWidth: 0,
            elevation: 3,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 25,
              fontWeight: "500",
              color: theme === "light" ? "#000" : "#ffffff",
            }}
          >
            Posts you liked
          </Text>
          <Ionicons name="heart" size={30} color={"red"} />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: 50,
          padding: 10,
          width: "100%",
        }}
      >
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#9FB1F5",
            marginBottom: 22,
            padding: 8,
            borderRadius: 10,
            elevation: 3,
            borderWidth: 0,
          }}
          onPress={logoutUser}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 25, padding: 8 }}>
            Log Out
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme === "light" ? "#ffffff" : "#141A29",
            marginBottom: 15,
            padding: 10,
            borderWidth: 0,
            borderRadius: 7,
            elevation: 3,
            width: "60%",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: theme === "light" ? "#000" : "#ffffff",
            }}
          >
            Delete the account
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default Settings;

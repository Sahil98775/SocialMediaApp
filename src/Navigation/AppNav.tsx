import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";
import FeedScreen from "../Screens/Feeds/Feed";
import MessageScreen from "../Screens/Messages/Message";
import ProfileScreen from "../Screens/Profile/Profile";
import SearchScreen from "../Screens/SearchUser/Search";
import UploadScreen from "../Screens/uploads/Upload";
import { useFonts } from "expo-font";
import { PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import {
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

const Tab = createBottomTabNavigator();
const AppNav = () => {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#5B6EAE",
        tabBarInactiveTintColor: "#020202",
        // tabBarInactiveTintColor: "#9FB1F5",
        tabBarStyle: {
          paddingBottom: 10,
          height: 90,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
      }}
    >
      <Tab.Screen
        name="FeedScreen"
        component={FeedScreen}
        options={{
          headerTitle: () => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 32,
                  fontFamily: "PlayfairDisplay_700Bold",
                  letterSpacing: 1.5,
                }}
              >
                Vibe
              </Text>
              <TouchableOpacity style={{ position: "absolute", left: "290%" }}>
                <Ionicons name="notifications" size={30} color={"#020202"} />
              </TouchableOpacity>
            </View>
          ),
          headerTitleAlign: "center",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-sharp" color={color} size={32} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerTitle: () => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 32,
                  fontFamily: "PlayfairDisplay_700Bold",
                }}
              >
                Explore
              </Text>
            </View>
          ),
          headerTitleAlign: "center",
          tabBarIcon: ({ color }) => (
            <Ionicons name="search" color={color} size={32} />
          ),
        }}
      />
      <Tab.Screen
        name="Upload"
        component={UploadScreen}
        options={{
          headerTitle: () => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  fontFamily: "PlayfairDisplay_700Bold",
                  // letterSpacing: 1,
                }}
              >
                Make a Post
              </Text>
            </View>
          ),
          headerTitleAlign: "center",
          tabBarIcon: ({ color }) => (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "#FFFFFF",
                backgroundColor: "#FFFFFF",
                width: 65,
                height: 65,
                borderRadius: 35,
                elevation: 2,
                shadowOpacity: 0.1,
              }}
            >
              <Ionicons
                name="add"
                color={color}
                size={50}
                style={{ transform: [{ scaleX: 1.2 }] }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Message"
        component={MessageScreen}
        options={{
          headerTitle: () => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  fontFamily: "PlayfairDisplay_700Bold",
                  letterSpacing: 1.2,
                }}
              >
                Index
              </Text>
            </View>
          ),
          headerTitleAlign: "center",
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbox" color={color} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" color={color} size={33} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
export default AppNav;

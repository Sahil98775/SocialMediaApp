import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../SupaBase";
import styles from "./PofileStyle";
import { useFonts } from "expo-font";
import { PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import {
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const navigation = useNavigation<any>();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const fetchProfile = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log("User not logged in");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.log("Profile fetch error:", error);
      return;
    }

    if (data) {
      setName(data.name);
      setUsername(data.username);
      setCountry(data.country);
      setBio(data.bio);
      setGender(data.gender);
      setProfileImage(data.profile_image);
      setBackgroundImage(data.background_image);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!isMounted) return;
      await fetchProfile();
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!fontsLoaded) return null;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri: backgroundImage || "https://picsum.photos/800/400",
        }}
        style={styles.cover}
      />

      {/* Profile Image */}
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: profileImage || "https://picsum.photos/200",
          }}
          style={styles.profileImage}
        />

        <View style={styles.verifiedBadge}>
          <Ionicons name="add" size={14} color="white" />
        </View>
      </View>

      {/* Name */}
      <Text style={styles.name}>{name || "name"}</Text>

      {/* Username */}
      <Text style={styles.username}>@{username || "username"}</Text>

      {/* Bio */}
      <View style={styles.bioCard}>
        <Text style={styles.bioText}>{bio || "bio..."}</Text>
      </View>

      <View style={styles.bioCard}>
        <Text style={{ fontSize: 25, color: "#6C63FF" }}>...</Text>
      </View>

      {/* Stats */}
      <View style={styles.edipro}>
        <View>
          <Text style={styles.countpost}>0</Text>
          <Text style={styles.postfollow}>posts</Text>
        </View>

        <View>
          <Text style={styles.countpost}>0</Text>
          <Text style={styles.postfollow}>followers</Text>
        </View>

        <View>
          <Text style={styles.countpost}>0</Text>
          <Text style={styles.postfollow}>following</Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.edits}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("Edits")}
        >
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => navigation.navigate("Settings")}
        >
          <Ionicons name="settings" size={30} color="#6C63FF" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity>
          <Ionicons name="grid-outline" size={22} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="create-outline" size={29} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={25} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

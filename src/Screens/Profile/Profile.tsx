import React, { useEffect, useState, useCallback } from "react";
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
import { fetchPosts } from "../Feeds/Feed";
import { useFocusEffect } from "@react-navigation/native";
type Post = {
  id: number;
  user_id: string;
  post_type: string;
  caption: string;
  image_url: string | null;

  profiles: {
    username: string;
    profile_image: string | null;
    country: string | null;
  };
};
const ProfileScreen = () => {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const navigation = useNavigation<any>();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("grid");
  const [posts, setPosts] = useState<Post[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        await fetchProfile();
        await fetchCounts();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        const data = await fetchPosts();
        const myPosts = data.filter((post) => post.user_id === user?.id);

        setPosts(myPosts);
      };

      loadData();
    }, [])
  );

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

  const fetchCounts = async () => {
    const { data } = await supabase.auth.getUser();
    const userId = data?.user?.id;

    if (!userId) return;

    const { count: followers } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", userId);

    const { count: following } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", userId);

    setFollowersCount(followers || 0);
    setFollowingCount(following || 0);
  };
  const imagePosts = posts.filter((post) => post.post_type === "image");
  const blogPosts = posts.filter((post) => post.post_type === "blog");
  //--------------------------------------------------------------------
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

      <Text style={styles.name}>{name || "name"}</Text>

      <Text style={styles.username}>@{username || "username"}</Text>

      <View style={styles.bioCard}>
        <Text style={[styles.bioText, !bio && { color: "#6C63FF" }]}>
          {bio || "Add bio..."}
        </Text>
      </View>

      <View style={styles.edipro}>
        <View>
          <Text style={styles.countpost}>{posts.length}</Text>
          <Text style={styles.postfollow}>posts</Text>
        </View>

        <View>
          <Text style={styles.countpost}>{followersCount}</Text>
          <Text style={styles.postfollow}>followers</Text>
        </View>

        <View>
          <Text style={styles.countpost}>{followingCount}</Text>
          <Text style={styles.postfollow}>following</Text>
        </View>
      </View>

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

      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setActiveTab("grid")}>
          <Ionicons
            name="grid"
            size={22}
            color={activeTab === "grid" ? "#6C63FF" : "black"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("blog")}>
          <Ionicons
            name="create-outline"
            size={29}
            color={activeTab === "blog" ? "#6C63FF" : "black"}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={25} />
        </TouchableOpacity>
      </View>
      {activeTab === "grid" && (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            paddingHorizontal: 10,
            marginBottom: 50,
            marginTop: 10,
          }}
        >
          {imagePosts.map((post) =>
            post.image_url ? (
              <Image
                key={post.id}
                source={{ uri: post.image_url }}
                style={{
                  width: "33%",
                  height: 120,
                  borderWidth: 2,
                  borderColor: "#FFFFFF",
                }}
              />
            ) : null
          )}
        </View>
      )}
      {activeTab === "blog" && (
        <View>
          {blogPosts.map((post) => (
            <View
              key={post.id}
              style={{
                backgroundColor: "#FFFFFF",
                margin: 8,
                padding: 15,
                borderRadius: 20,
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Image
                  source={{ uri: post.profiles?.profile_image || "Unknown" }}
                  style={{ width: 50, height: 50, borderRadius: 40 }}
                />
                <View
                  style={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginLeft: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 21,
                      fontFamily: "PlayfairDisplay_700Bold",
                      letterSpacing: 0.2,
                    }}
                  >
                    {post.profiles.username}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "grey",
                      letterSpacing: 0.2,
                    }}
                  >
                    {post.profiles.country}
                  </Text>
                </View>
              </View>
              <Text
                style={{ fontSize: 18, fontFamily: "PlayfairDisplay_700Bold" }}
              >
                {post.caption}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default ProfileScreen;

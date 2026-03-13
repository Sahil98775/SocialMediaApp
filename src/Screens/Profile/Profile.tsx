import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../SupaBase";
import { LinearGradient } from "expo-linear-gradient";
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
import { useDispatch, useSelector } from "react-redux";
import { addBookmark, removeBookmark } from "../../Redux/redxSlice";
type Post = {
  id: number;
  user_id: string;
  post_type: string;
  caption: string;
  image_url: string | null;
  created_at: string;

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
  const dispatch = useDispatch();
  const bookmarks = useSelector((state: any) => state.bookmark.bookmarks);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const toggleBookmark = (postId: string) => {
    if (bookmarks.includes(postId)) {
      dispatch(removeBookmark(postId));
    } else {
      dispatch(addBookmark(postId));
    }
  };
  const imagePosts = posts.filter((post) => post.post_type === "image");
  const blogPosts = posts.filter((post) => post.post_type === "blog");
  const bookmarkedPosts = posts.filter((post) => bookmarks.includes(post.id));
  //--------------------------------------------------------------------
  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={["#FFF2F7", "#FFF8ED"]} style={{ flex: 1 }}>
        <Image
          source={{
            uri: backgroundImage || "https://picsum.photos/800/400",
          }}
          style={styles.cover}
        />

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

          <TouchableOpacity onPress={() => setActiveTab("bookmark")}>
            <Ionicons
              name="bookmark-sharp"
              size={25}
              color={activeTab === "bookmark" ? "#6C63FF" : "black"}
            />
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
              // backgroundColor: "#FFF5FA",
            }}
          >
            {imagePosts.map((post) =>
              post.image_url ? (
                <Image
                  key={post.id}
                  source={{ uri: post.image_url }}
                  style={{
                    width: "32.5%",
                    height: 120,
                    margin: 1,
                    borderWidth: 1,

                    borderColor: "#FFFFFF",
                    borderRadius: 10,
                  }}
                />
              ) : null
            )}
          </View>
        )}

        {activeTab === "blog" && (
          <View
            style={{
              marginTop: 15,
              // marginHorizontal: 3,
            }}
          >
            {blogPosts.map((post) => (
              <View
                key={post.id}
                style={{
                  marginBottom: 15,
                  padding: 15,
                  borderRadius: 20,

                  backgroundColor: "#F3F6FF",
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
                    source={{
                      uri: post.profiles?.profile_image || "Unknown",
                    }}
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
                  style={{
                    fontSize: 18,
                    padding: 7,
                    backgroundColor: "#FFFFFF",
                    elevation: 1,
                  }}
                >
                  {post.caption}
                </Text>
                <Text style={{ marginTop: 10, color: "#CCC", marginLeft: 5 }}>
                  {formatDate(post.created_at)}
                </Text>
              </View>
            ))}
          </View>
        )}
        {activeTab === "bookmark" && (
          <View style={{ marginTop: 15, marginBottom: 40 }}>
            {bookmarkedPosts.map((post) => (
              <View
                key={post.id}
                style={{
                  marginBottom: 15,
                  padding: 15,
                  borderRadius: 20,
                  backgroundColor: "#F6F8FD",
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
                    source={{
                      uri:
                        post.profiles?.profile_image ||
                        "https://picsum.photos/200",
                    }}
                    style={{ width: 55, height: 55, borderRadius: 40 }}
                  />

                  <View style={{ marginLeft: 10 }}>
                    <Text
                      style={{
                        fontSize: 22,
                        fontFamily: "PlayfairDisplay_700Bold",
                      }}
                    >
                      {post.profiles?.username}
                    </Text>

                    <Text
                      style={{
                        fontSize: 13,
                        color: "grey",
                      }}
                    >
                      {post.profiles?.country}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleBookmark(post.id)}
                    style={{ position: "absolute", right: 0, top: 0 }}
                  >
                    <Ionicons
                      name={
                        bookmarks.includes(post.id)
                          ? "bookmark"
                          : "bookmark-outline"
                      }
                      size={26}
                      color={"#6C63FF"}
                    />
                  </TouchableOpacity>
                </View>

                {post.post_type === "image" && post.image_url && (
                  <Image
                    source={{ uri: post.image_url }}
                    style={{
                      width: "100%",
                      height: 220,
                      borderTopLeftRadius: 15,
                      borderTopRightRadius: 15,
                    }}
                  />
                )}
                <Text
                  style={{
                    fontSize: 17,
                    marginBottom: 10,
                    fontWeight: "500",
                    elevation: 2,
                    backgroundColor: "#FFFFFF",
                    padding: 10,
                    borderBottomLeftRadius: 15,
                    borderBottomRightRadius: 15,
                  }}
                >
                  {post.caption}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#ccc",
                    marginLeft: 5,
                  }}
                >
                  {formatDate(post.created_at)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </LinearGradient>
    </ScrollView>
  );
};

export default ProfileScreen;

import {
  View,
  Text,
  Modal,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "../../SupaBase";
import { useFocusEffect } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import { Ionicons } from "@expo/vector-icons";
import CommentModal from "../../Components/Molecules/commentModal";
import LikeModal from "../../Components/Molecules/likesModal";
type Post = {
  id: string;
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
  likes: {
    user_id: string;
  }[];

  comments: {
    id: number;
  }[];
};

export const fetchPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles!posts_user_id_fkey (
        username,
        profile_image,
        country
      ),likes(user_id),
      comments(id)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.log("ERROR:", error);
    return [];
  }

  return data;
};
const FeedScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  }
  const [commentModal, setCommentModal] = useState(false);
  const [likeModal, setLikeModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || null);
    };

    getUser();
  }, []);
  const loadPosts = async () => {
    const data = await fetchPosts();
    setPosts(data);
  };
  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [])
  );
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const toggleLike = async (postId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    console.log("USER:", user.id);
    console.log("POST:", postId);

    const { data: existingLike } = await supabase
      .from("likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .maybeSingle();

    console.log("EXISTING LIKE:", existingLike);

    if (existingLike) {
      console.log("REMOVING LIKE");

      await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
    } else {
      console.log("ADDING LIKE");

      const { error } = await supabase.from("likes").insert({
        post_id: postId,
        user_id: user.id,
      });

      if (error) console.log("LIKE ERROR:", error);
    }

    await loadPosts();
  };
  const renderPost = ({ item }: { item: Post }) => {
    const likesArray = Array.isArray(item.likes) ? item.likes : [];

    const isLiked = likesArray.some((like) => like.user_id === userId);

    return (
      <View
        style={{
          backgroundColor: "#F6F8FD",
          marginBottom: 10,
          borderRadius: 15,
          padding: 12,
          elevation: 3,
        }}
      >
        <TouchableOpacity style={{ position: "absolute", right: 20, top: 20 }}>
          <Ionicons name="ellipsis-horizontal" size={25} color={"#6C63FF"} />
        </TouchableOpacity>
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
                item.profiles?.profile_image ||
                "https://i.pravatar.cc/150?img=12",
            }}
            style={{ width: 50, height: 50, borderRadius: 40 }}
          />
          <View
            style={{
              justifyContent: "flex-start",
              alignItems: "flex-start",
              marginLeft: 10,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 21,
                fontFamily: "PlayfairDisplay_700Bold",
                letterSpacing: 0.2,
              }}
            >
              {item.profiles?.username || "Unknown"}
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: "gray",
                letterSpacing: 0.2,
              }}
            >
              {item.profiles?.country}
            </Text>
          </View>
        </View>

        {item.post_type === "image" && item.image_url && (
          <View>
            <Image
              source={{ uri: item.image_url }}
              style={{
                width: "100%",
                height: 250,
                borderRadius: 10,
              }}
              resizeMode="cover"
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 10,
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => toggleLike(item.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 19,
                }}
              >
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={28}
                  color={"#FF6B81"}
                />
                <Text
                  style={{
                    paddingBottom: 0,
                    marginLeft: 5,
                    fontSize: 20,
                  }}
                  onPress={() => {
                    setSelectedPostId(item.id);
                    setLikeModal(true);
                  }}
                >
                  {likesArray.length}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => {
                  setSelectedPostId(item.id);
                  setCommentModal(true);
                }}
              >
                <Ionicons name="chatbox" size={26} color={"#8FA0E0"} />
                <Text
                  style={{
                    paddingBottom: 5,
                    marginLeft: 5,
                    fontSize: 20,
                  }}
                >
                  {item.comments?.length || 0}
                </Text>
              </TouchableOpacity>
              <Ionicons
                name="bookmark-outline"
                size={25}
                color={"#6C63FF"}
                style={{ position: "absolute", right: 0 }}
              />
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "flex-start",
                flexDirection: "row",
                alignItems: "center",
                // backgroundColor: "yellow",
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  lineHeight: 17,
                  fontWeight: "700",
                  marginTop: 10,
                  paddingLeft: 10,
                  paddingRight: 5,
                }}
              >
                {item.caption ? item.profiles?.username : null}
              </Text>
              <Text
                style={{
                  fontSize: 17,
                  marginTop: 10,
                  paddingBottom: 2,
                }}
              >
                {item.caption}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 13,
                color: "gray",
                marginLeft: 10,
                marginTop: 7,
              }}
            >
              {formatDate(item.created_at)}
            </Text>
          </View>
        )}

        {item.post_type === "blog" && (
          <View>
            <View
              style={{
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 10,
                borderRadius: 15,
                paddingTop: 10,
                elevation: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  lineHeight: 24,
                  paddingHorizontal: 10,
                  marginBottom: 15,
                }}
              >
                {item.caption}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 10,
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => toggleLike(item.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 19,
                }}
              >
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={28}
                  color={"#FF6B81"}
                />
                <Text
                  style={{
                    paddingBottom: 0,
                    marginLeft: 5,
                    fontSize: 20,
                  }}
                  onPress={() => {
                    setSelectedPostId(item.id);
                    setLikeModal(true);
                  }}
                >
                  {likesArray.length}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => {
                  setSelectedPostId(item.id);
                  setCommentModal(true);
                }}
              >
                <Ionicons name="chatbox" size={26} color={"#9FB1F5"} />
                <Text
                  style={{
                    marginLeft: 5,
                    fontSize: 20,
                  }}
                >
                  {item.comments?.length || 0}
                </Text>
              </TouchableOpacity>
              <Ionicons
                name="bookmark-outline"
                size={25}
                color={"#6C63FF"}
                style={{ position: "absolute", right: 0 }}
              />
            </View>
            <Text
              style={{
                fontSize: 13,
                color: "gray",
                marginTop: 10,
                marginLeft: 12,
              }}
            >
              {formatDate(item.created_at)}
            </Text>
          </View>
        )}
      </View>
    );
  };
  return (
    <LinearGradient
      colors={["#FFF2F7", "#FFF5E6"]}
      // colors={["#F4F6FF", "#F7F2FF"]}
      // colors={["#F5F9FF", "#EEF3FF"]}
      // colors={["#F3F6FF", "#FFF2F7"]}
      // colors={["#B8C6FF", "#DCC6E8"]}
      // colors={["#C8D8FF", "#F1CFEA"]}
      // colors={["#C5CAE9", "#E1BEE7"]}
      // colors={["#C9D6FF", "#E2E2F8"]}
      style={{
        flex: 1,
        paddingHorizontal: 5,
        paddingTop: 5,
      }}
    >
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
      />
      <CommentModal
        visible={commentModal}
        postId={selectedPostId}
        onClose={() => {
          setCommentModal(false);
          loadPosts();
        }}
      />
      ››
      <LikeModal
        visible={likeModal}
        postId={selectedPostId}
        onClose={() => setLikeModal(false)}
      />
    </LinearGradient>
  );
};

export default FeedScreen;

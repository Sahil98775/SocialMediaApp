import {
  View,
  Text,
  Modal,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../SupaBase";
import { useFocusEffect } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import { Ionicons } from "@expo/vector-icons";
import CommentModal from "../../Components/Molecules/commentModal";
import LikeModal from "../../Components/Molecules/likesModal";
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
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  }
  const [commentModal, setCommentModal] = useState(false);
  const [likeModal, setLikeModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const loadPosts = async () => {
    const data = await fetchPosts();
    setPosts(data);
  };
  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [])
  );

  const renderPost = ({ item }: { item: Post }) => {
    return (
      <View
        style={{
          backgroundColor: "#FFFFFF",
          marginBottom: 10,
          borderRadius: 15,
          padding: 12,
          elevation: 3,
        }}
      >
        <TouchableOpacity style={{ position: "absolute", right: 20, top: 20 }}>
          <Ionicons name="ellipsis-horizontal" size={20} color={"#6C63FF"} />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Image
            source={{ uri: item.profiles?.profile_image || "Unknown" }}
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
          <Image
            source={{ uri: item.image_url }}
            style={{
              width: "100%",
              height: 250,
              borderRadius: 10,
              marginBottom: 10,
            }}
            resizeMode="cover"
          />
        )}

        <Text
          style={{
            fontSize: 17,
            lineHeight: 17,
            fontWeight: "500",
            paddingHorizontal: 10,
            marginBottom: 10,
          }}
        >
          {item.caption}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: 10,
            marginTop: 10,
          }}
        >
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
            <Ionicons name="chatbox-sharp" size={23} color={"#6C63FF"} />
            <Text
              style={{
                paddingBottom: 5,
                marginLeft: 5,
                fontSize: 15,
                color: "grey",
              }}
            >
              {item.comments?.length || 0} Comments
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons name="thumbs-up-sharp" size={23} color={"#6C63FF"} />
            <Text
              style={{
                paddingBottom: 0,
                marginLeft: 5,
                fontSize: 15,
                color: "grey",
              }}
              onPress={() => {
                setSelectedPostId(item.id);
                setLikeModal(true);
              }}
            >
              {item.likes?.length || 0} likes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <CommentModal
        visible={commentModal}
        postId={selectedPostId}
        onClose={() => setCommentModal(false)}
      />

      <LikeModal
        visible={likeModal}
        postId={selectedPostId}
        onClose={() => setLikeModal(false)}
      />
    </View>
  );
};

export default FeedScreen;

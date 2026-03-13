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
import { useDispatch, useSelector } from "react-redux";
import { addBookmark, removeBookmark } from "../../Redux/redxSlice";

import CommentModal from "../../Components/Molecules/commentModal";
import LikeModal from "../../Components/Molecules/likesModal";
import styles from "./feedStyle";
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
    ),
    likes:likes(user_id),
    comments:comments(id)
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
  const dispatch = useDispatch();
  const bookmarks = useSelector((state: any) => state.bookmark.bookmarks);

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
  const toggleBookmark = (postId: string) => {
    if (bookmarks.includes(postId)) {
      dispatch(removeBookmark(postId));
    } else {
      dispatch(addBookmark(postId));
    }
  };

  const renderPost = ({ item }: { item: Post }) => {
    const likesArray = Array.isArray(item.likes) ? item.likes : [];
    const isLiked = likesArray.some((like) => like.user_id === userId);
    const isBookmarked = bookmarks.includes(item.id);
    return (
      <View style={styles.style1}>
        <TouchableOpacity style={styles.style19}>
          <Ionicons name="ellipsis-horizontal" size={25} color={"#6C63FF"} />
        </TouchableOpacity>
        <View style={styles.style2}>
          <Image
            source={{
              uri:
                item.profiles?.profile_image ||
                "https://i.pravatar.cc/150?img=12",
            }}
            style={styles.profileImg}
          />
          <View style={styles.style3}>
            <Text style={styles.style4}>
              {item.profiles?.username || "Unknown"}
            </Text>

            <Text style={styles.style5}>{item.profiles?.country}</Text>
          </View>
        </View>

        {item.post_type === "image" && item.image_url && (
          <View>
            <Image
              source={{ uri: item.image_url }}
              style={styles.style6}
              resizeMode="cover"
            />

            <View style={styles.style7}>
              <View style={styles.style8}>
                <TouchableOpacity onPress={() => toggleLike(item.id)}>
                  <Ionicons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={28}
                    color={"#FF6B81"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setSelectedPostId(item.id);
                    setLikeModal(true);
                  }}
                >
                  <Text style={styles.style9}>{likesArray.length}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.style20}
                onPress={() => {
                  setSelectedPostId(item.id);
                  setCommentModal(true);
                }}
              >
                <Ionicons name="chatbox" size={26} color={"#8FA0E0"} />
                <Text style={styles.style10}>{item.comments?.length || 0}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ position: "absolute", right: 0 }}
                onPress={() => toggleBookmark(item.id)}
              >
                <Ionicons
                  name={isBookmarked ? "bookmark" : "bookmark-outline"}
                  size={25}
                  color={"#6C63FF"}
                />
              </TouchableOpacity>
            </View>

            {/* <View style={styles.style11}>
              <Text style={styles.style12}>
                {item.caption ? item.profiles?.username : null}
              </Text>
              <Text style={styles.style13}>{item.caption}</Text>
            </View> */}
            {item.caption ? (
              <View style={styles.style11}>
                <Text style={styles.style13}>
                  <Text style={styles.style12}>{item.profiles?.username} </Text>
                  {item.caption}
                </Text>
              </View>
            ) : null}
            <Text style={styles.style14}>{formatDate(item.created_at)}</Text>
          </View>
        )}

        {item.post_type === "blog" && (
          <View>
            <View style={styles.style15}>
              <Text style={styles.style16}>{item.caption}</Text>
            </View>

            <View style={styles.style7}>
              <View style={styles.style8}>
                <TouchableOpacity onPress={() => toggleLike(item.id)}>
                  <Ionicons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={28}
                    color={"#FF6B81"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setSelectedPostId(item.id);
                    setLikeModal(true);
                  }}
                >
                  <Text style={styles.style9}>{likesArray.length}</Text>
                </TouchableOpacity>
              </View>

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
                <Text style={styles.style10}>{item.comments?.length || 0}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ position: "absolute", right: 0 }}
                onPress={() => toggleBookmark(item.id)}
              >
                <Ionicons
                  name={isBookmarked ? "bookmark" : "bookmark-outline"}
                  size={25}
                  color={"#6C63FF"}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.style17}>{formatDate(item.created_at)}</Text>
          </View>
        )}
      </View>
    );
  };
  return (
    <LinearGradient colors={["#FFF2F7", "#FFF5E6"]} style={styles.style18}>
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

      <LikeModal
        visible={likeModal}
        postId={selectedPostId}
        onClose={() => setLikeModal(false)}
      />
    </LinearGradient>
  );
};

export default FeedScreen;

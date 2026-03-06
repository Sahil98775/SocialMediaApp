import { View, Text, ScrollView, FlatList, Image } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../SupaBase";
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
const FeedScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
      *,
      profiles (
        username,
        profile_image,
        country
      )
    `
      )
      .order("created_at", { ascending: false });

    console.log("POST DATA:", data);

    if (error) {
      console.log("ERROR:", error);
    } else {
      setPosts(data);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const renderPost = ({ item }: { item: Post }) => {
    return (
      <View
        style={{
          backgroundColor: "white",
          marginBottom: 15,
          borderRadius: 12,
          padding: 12,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <View>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>
              {item.profiles?.username || "Unknown"}
            </Text>

            <Text style={{ fontSize: 12, color: "gray" }}>
              {item.profiles?.country}
            </Text>
          </View>
        </View>

        {/* Image Post */}
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

        {/* Caption / Blog */}
        <Text
          style={{
            fontSize: 16,
            lineHeight: 22,
          }}
        >
          {item.caption}
        </Text>
        <Text>{}</Text>
      </View>
    );
  };
  return (
    <View style={{ flex: 1, padding: 15 }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
export default FeedScreen;

import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { supabase } from "../../SupaBase";
import { useFonts } from "expo-font";
import { PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
type Profile = {
  id: string;
  username: string;
  profile_image: string;
  bio?: string;
  country: string;
};
const SearchScreen = () => {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
  });

  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState<Profile[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchText.length >= 2) {
        searchUser(searchText);
      } else {
        setUsers([]);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [searchText]);

  const loadFollowing = async () => {
    const { data } = await supabase.auth.getUser();
    const currentUserId = data?.user?.id;

    if (!currentUserId) return;

    const { data: follows } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", currentUserId);

    if (follows) {
      setFollowing(follows.map((f) => f.following_id));
    }
  };
  useEffect(() => {
    loadFollowing();
  }, []);

  const searchUser = async (text: string) => {
    if (text.length < 2) {
      setUsers([]);
      return;
    }

    const { data: auth } = await supabase.auth.getUser();
    const currentUserId = auth?.user?.id;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .ilike("username", `%${text}%`)
      .neq("id", currentUserId) // mai khud ko include nhi kar raha
      .limit(10);
    if (!error && data) {
      setUsers(data);
    }
  };

  const toggleFollow = async (userId: string) => {
    const { data } = await supabase.auth.getUser();
    const currentUserId = data?.user?.id;
    if (!currentUserId) return;

    const { data: existing, error } = await supabase
      .from("follows")
      .select("*")
      .eq("follower_id", currentUserId)
      .eq("following_id", userId)
      .maybeSingle();

    if (error) {
      console.log("Check follow error:", error);
      return;
    }

    if (existing) {
      const { error: deleteError } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", currentUserId)
        .eq("following_id", userId);

      if (!deleteError) {
        console.log("Unfollowed");
        setFollowing((prev) => prev.filter((id) => id !== userId));
      }
    } else {
      const { error: insertError } = await supabase.from("follows").insert({
        follower_id: currentUserId,
        following_id: userId,
      });

      if (!insertError) {
        console.log("Followed");
        setFollowing((prev) => [...prev, userId]);
      }
    }
  };

  return (
    <LinearGradient
      colors={["#FFF2F7", "#FFF5E6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, padding: 8 }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 2,
          padding: 1,
          borderRadius: 15,
          // borderColor: "#6C63FF",
        }}
      >
        <Ionicons
          name="search"
          size={20}
          color={"black"}
          style={{ padding: 8 }}
        />
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Find a friend"
          placeholderTextColor={"#6C63FF"}
          style={{ fontSize: 18 }}
        />
      </View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#FFFFFF",
              flexDirection: "row",
              marginVertical: 5,
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Image
              source={{ uri: item.profile_image }}
              style={{ width: 150, height: 150, borderRadius: 5 }}
            />
            <View style={{ flex: 1, marginLeft: 5 }}>
              <View
                style={{
                  flex: 1,
                  padding: 10,
                  justifyContent: "flex-start",
                }}
              >
                <Text
                  style={{
                    fontSize: 30,
                    fontWeight: "600",
                  }}
                >
                  {item.username}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: "grey",
                    fontWeight: "600",
                    marginBottom: 5,
                  }}
                >
                  {item.country}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#7B8FF7",

                    fontFamily: "PlayfairDisplay_700Bold",
                  }}
                >
                  {item.bio || "No bio"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleFollow(item.id)}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#6C63FF",
                  padding: 8,
                  borderRadius: 8,
                  elevation: 2,
                }}
              >
                <Text style={{ color: "white" }}>
                  {following.includes(item.id) ? "Unfollow" : "Follow"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </LinearGradient>
  );
};
export default SearchScreen;

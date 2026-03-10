import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { supabase } from "../../SupaBase";
import { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import SearchScreen from "../SearchUser/Search";
type ChatUser = {
  id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender_id: string;
  reciever_id: string;
  otherUser: {
    id: string;
    username: string;
    profile_image: string;
  };
};
type FollowingUser = {
  following_id: string;
  profiles: {
    id: string;
    username: string;
    profile_image: string;
  };
};

const MessageScreen = () => {
  const [users, setUsers] = useState<FollowingUser[]>([]);
  const [chats, setChats] = useState<ChatUser[]>([]);
  const [myId, setMyId] = useState<string | null>(null);
  const navigation = useNavigation<any>();

  useFocusEffect(
    useCallback(() => {
      getCurrentUser();
      getChats();
      getFollowingUsers();
    }, [])
  );
  const getCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setMyId(user.id);
    }
  };
  const getFollowingUsers = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("follows")
      .select(
        `
    following_id,
    profiles!follows_following_id_fkey (
      id,
      username,
      profile_image
    )
  `
      )
      .eq("follower_id", user.id);

    if (error) {
      console.log(error);
    } else {
      setUsers(data);
    }
  };

  const getChats = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("message")
      .select(
        `
      id,
      content,
      created_at,
      read,
      sender_id,
      reciever_id,
      sender:sender_id (
        id,
        username,
        profile_image
      ),
      receiver:reciever_id (
        id,
        username,
        profile_image
      )
    `
      )
      .or(`sender_id.eq.${user.id},reciever_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    processChats(data, user.id);
  };
  const processChats = (messages: any[], myId: string) => {
    const chatMap: any = {};

    messages.forEach((msg) => {
      const otherUser = msg.sender_id === myId ? msg.receiver : msg.sender;

      if (!chatMap[otherUser.id]) {
        chatMap[otherUser.id] = {
          ...msg,
          otherUser,
        };
      }
    });

    setChats(Object.values(chatMap));
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          padding: 10,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            height: 90,
            width: 90,
            borderWidth: 2,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
            marginRight: 10,
            marginBottom: 15,
            borderColor: "#ccc",
          }}
        >
          <Ionicons name="add" size={35} color={"#6C63FF"} />
        </TouchableOpacity>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={users}
          keyExtractor={(item) => item.following_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ChatScreen", {
                  userId: item.profiles.id,
                  username: item.profiles.username,
                  profileImage: item.profiles.profile_image,
                })
              }
              style={{ alignItems: "center", marginRight: 15 }}
            >
              <View>
                <Image
                  source={{
                    uri:
                      item.profiles?.profile_image ||
                      "https://via.placeholder.com/150",
                  }}
                  style={{ width: 90, height: 90, borderRadius: 50 }}
                />

                <View
                  style={{
                    width: 19,
                    height: 19,
                    backgroundColor: "#6C63FF",
                    borderRadius: 10,
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    borderWidth: 3,
                    borderColor: "white",
                  }}
                />
              </View>

              <Text numberOfLines={1} style={{ marginTop: 5 }}>
                {item.profiles?.username || "Unknown"}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View
        style={{
          flex: 3,
          backgroundColor: "#FFFFFF",
          borderStartStartRadius: 40,
          borderEndStartRadius: 40,
          marginTop: -20,
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: "#6C63FF",
            marginBottom: 20,
          }}
        >
          Messages
        </Text>
        <FlatList
          data={chats}
          keyExtractor={(item) => item.otherUser.id}
          renderItem={({ item }) => {
            const isUnread = item.reciever_id === myId && item.read === false;

            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ChatScreen", {
                    userId: item.otherUser.id,
                    username: item.otherUser.username,
                    profileImage: item.otherUser.profile_image,
                  })
                }
                style={{
                  flexDirection: "row",
                  padding: 10,
                  alignItems: "center",
                  backgroundColor: isUnread ? "#D3DDEA" : "#F0F2F9",
                  borderRadius: 15,
                  marginBottom: 10,
                }}
              >
                <Image
                  source={{ uri: item.otherUser.profile_image }}
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 30,
                  }}
                />

                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "700",
                      color: "#0B0A0B",
                    }}
                  >
                    {item.otherUser.username}
                  </Text>

                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      color: isUnread ? "#0B0A0B" : "#B1AEBB",
                    }}
                  >
                    {item.content}
                  </Text>
                </View>

                {isUnread && (
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 8,
                      marginRight: 5,
                      backgroundColor: "#6C63FF",
                    }}
                  />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};
export default MessageScreen;

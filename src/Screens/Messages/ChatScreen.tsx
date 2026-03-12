import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Keyboard,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { useRoute, RouteProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../SupaBase";
type ChatScreenParams = {
  userId: string;
  username: string;
  profileImage: string;
};
type Message = {
  id: string;
  sender_id: string;
  reciever_id: string;
  content: string;
  created_at: string;
  read: boolean;
};

type ChatRouteProp = RouteProp<{ Chat: ChatScreenParams }, "Chat">;
const ChatScreen = () => {
  const route = useRoute<ChatRouteProp>();
  const { userId, username, profileImage } = route.params;
  const navigation = useNavigation();

  const [text, setText] = useState("");
  const [myId, setMyId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList>(null);

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "message",
        },
        (payload) => {
          const newMessage = payload.new as Message;

          if (
            (newMessage.sender_id === myId &&
              newMessage.reciever_id === userId) ||
            (newMessage.sender_id === userId && newMessage.reciever_id === myId)
          ) {
            setMessages((prev) => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [myId]);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setMyId(data.user?.id || "");
    };

    getUser();
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const { data, error } = await supabase
      .from("message")
      .insert({
        sender_id: myId,
        reciever_id: userId,
        content: text,
      })
      .select()
      .single();

    if (error) {
      console.log("Send error:", error);
    } else {
      setMessages((prev) => [...prev, data]);
      setText("");
    }
  };

  const getMessages = async () => {
    const { data, error } = await supabase
      .from("message")
      .select("*")
      .or(
        `and(sender_id.eq.${myId},reciever_id.eq.${userId}),and(sender_id.eq.${userId},reciever_id.eq.${myId})`
      )
      .order("created_at", { ascending: true });

    if (data) setMessages(data);
  };
  const markMessagesAsRead = async () => {
    const { error } = await supabase
      .from("message")
      .update({ read: true })
      .eq("sender_id", userId)
      .eq("reciever_id", myId)
      .eq("read", false);

    if (error) {
      console.log("Read update error:", error);
    }
  };
  useEffect(() => {
    if (myId && userId) {
      markMessagesAsRead();
    }

    if (myId) {
      getMessages();
    }
  }, [myId]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={["#FFFCF7", "#FFFDF9"]} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={47}
        >
          {/* HEADER */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 15,
              borderBottomWidth: 0.3,
              borderColor: "#ccc",
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="arrow-back"
                size={28}
                color={"#6C63FF"}
                style={{ width: 35 }}
              />
            </TouchableOpacity>

            <Image
              source={{ uri: profileImage }}
              style={{
                width: 42,
                height: 42,
                borderRadius: 20,
              }}
            />

            <Text
              style={{
                marginLeft: 10,
                fontSize: 20,
                fontWeight: "700",
                color: "#0B0A0B",
              }}
            >
              {username}
            </Text>
          </View>

          <View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 10 }}>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                paddingVertical: 10,
                paddingBottom: 80,
              }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isMe = item.sender_id === myId;

                return (
                  <View
                    style={{
                      alignSelf: isMe ? "flex-end" : "flex-start",
                      backgroundColor: isMe ? "#C9D6FF" : "#EEF3FF",
                      padding: 10,
                      borderStartStartRadius: 15,
                      borderEndStartRadius: 15,
                      borderStartEndRadius: isMe ? 15 : 0,
                      borderEndEndRadius: isMe ? 0 : 15,
                      marginVertical: 4,
                      maxWidth: "75%",
                      alignItems: isMe ? "flex-end" : "flex-start",
                      elevation: 2,
                    }}
                  >
                    <Text
                      style={{
                        color: isMe ? "#0B0A0B" : "#625D62",
                        fontSize: 18,
                        fontWeight: "500",
                      }}
                    >
                      {item.content}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "center",
                        marginTop: 3,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",

                          color: "#6C63FF",
                        }}
                      >
                        {formatTime(item.created_at)}
                      </Text>
                      {isMe && (
                        <Text
                          style={{
                            fontSize: 10,
                            fontWeight: "bold",
                            color: item.read ? "blue" : "#625D62",
                            marginLeft: 5,
                          }}
                        >
                          {item.read ? "✓✓" : "✓"}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              }}
            />
          </View>

          {/* INPUT */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 10,
            }}
          >
            <TextInput
              placeholder="Message..."
              placeholderTextColor={"#B1AEBB"}
              value={text}
              onChangeText={setText}
              style={{
                flex: 1,
                borderWidth: 0.1,
                borderColor: "#D3DDEA",
                borderRadius: 20,
                paddingHorizontal: 15,
                backgroundColor: "#F8F9FE",
                marginRight: 10,
                elevation: 2,
                fontSize: 20,
                height: 45,
              }}
            />

            <TouchableOpacity
              onPress={sendMessage}
              style={{
                padding: 2,
              }}
            >
              <Ionicons name="send" size={29} color="#7289DA" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};
export default ChatScreen;

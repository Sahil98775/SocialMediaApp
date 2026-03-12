import {
  View,
  Text,
  Modal,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "../../SupaBase";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
type Comment = {
  id: number;
  comment: string;
  user_id: string;

  profiles: {
    username: string;
    profile_image: string | null;
  };
};
type CommentModalProps = {
  visible: boolean;
  postId: string | null;
  onClose: () => void;
};

export default function CommentModal({
  visible,
  postId,
  onClose,
}: CommentModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");

  const loadComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select(
        `
        *,
        profiles(username, profile_image)
      `
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    if (!error) setComments(data || []);
  };

  useEffect(() => {
    if (visible) loadComments();
  }, [visible]);

  const addComment = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !comment.trim() || !postId) return;

    await supabase.from("comments").insert({
      post_id: postId,
      user_id: user.id,
      comment,
    });

    setComment("");
    loadComments();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                flex: 1,
                maxHeight: "70%",
                backgroundColor: "white",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingHorizontal: 20,
                paddingTop: 10,
              }}
            >
              {/* drag indicator */}
              <View
                style={{
                  width: 40,
                  height: 5,
                  backgroundColor: "#ccc",
                  borderRadius: 10,
                  alignSelf: "center",
                  marginBottom: 10,
                }}
              />

              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginBottom: 10,
                  color: "#6C63FF",
                }}
              >
                Comments
              </Text>

              {/* comments list */}
              <FlatList
                data={comments}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 90 }}
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <View style={{ flexDirection: "row", marginVertical: 8 }}>
                    <Image
                      source={{
                        uri:
                          item.profiles?.profile_image ||
                          "https://via.placeholder.com/150",
                      }}
                      style={{ width: 40, height: 40, borderRadius: 20 }}
                    />

                    <View style={{ marginLeft: 10 }}>
                      <Text style={{ fontWeight: "bold" }}>
                        {item.profiles?.username}
                      </Text>
                      <Text>{item.comment}</Text>
                    </View>
                  </View>
                )}
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <TextInput
                  placeholder="Write a comment..."
                  placeholderTextColor="grey"
                  value={comment}
                  onChangeText={setComment}
                  style={{
                    flex: 1,
                    borderWidth: 0.1,
                    borderColor: "#D3DDEA",
                    borderRadius: 20,
                    paddingHorizontal: 15,
                    backgroundColor: "#F8F9FE",
                    elevation: 1,
                    fontSize: 17,
                    height: 45,
                  }}
                />

                <TouchableOpacity
                  onPress={addComment}
                  style={{ marginLeft: 8 }}
                >
                  <Ionicons name="arrow-up-circle" size={40} color="#6C63FF" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={onClose}
                style={{ marginTop: 15, marginBottom: 20 }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 18,
                    color: "#6C63FF",
                  }}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

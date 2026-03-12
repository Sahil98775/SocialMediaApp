import {
  View,
  Text,
  Modal,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "../../SupaBase";
type Like = {
  id: number;
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
  const [likes, setLikes] = useState<Like[]>([]);

  const loadLikes = async () => {
    const { data, error } = await supabase
      .from("likes")
      .select(
        `
        *,
        profiles(username, profile_image)
      `
      )
      .eq("post_id", postId);

    if (!error) setLikes(data || []);
  };

  useEffect(() => {
    if (visible) loadLikes();
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            height: "50%",
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
          }}
        >
          {/* drag handle */}
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

          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
            People who liked
          </Text>

          <FlatList
            data={likes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={{ flexDirection: "row", marginVertical: 10 }}>
                <Image
                  source={{
                    uri:
                      item.profiles?.profile_image ||
                      "https://via.placeholder.com/150",
                  }}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />

                <Text style={{ marginLeft: 10, fontSize: 16 }}>
                  {item.profiles?.username}
                </Text>
              </View>
            )}
          />

          <TouchableOpacity
            onPress={onClose}
            style={{ marginTop: 20, marginBottom: 25 }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                color: "#6C63FF",
                fontWeight: "400",
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

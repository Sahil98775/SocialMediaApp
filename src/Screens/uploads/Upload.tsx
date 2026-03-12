import { View, Text, TouchableOpacity, TextInput, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { supabase } from "../../SupaBase";
import { useFonts } from "expo-font";
import { PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import { decode } from "base64-arraybuffer";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
const UploadScreen = () => {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [postType, setPostType] = useState("blog");
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageBase64(result.assets[0].base64 ?? null);
    }
  };
  //---------------------------
  const uploadImage = async () => {
    if (!imageBase64) {
      console.log("No base64 image");
      return null;
    }

    const fileName = `${Date.now()}.jpg`;

    console.log("Uploading base64 image...");

    const { error } = await supabase.storage
      .from("posts")
      .upload(fileName, decode(imageBase64), {
        contentType: "image/jpeg",
      });

    if (error) {
      console.log("Upload error:", error);
      return null;
    }

    const { data } = supabase.storage.from("posts").getPublicUrl(fileName);

    return data.publicUrl;
  };
  //--------------------------------

  const createPost = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("User not logged in");
      return;
    }

    let imageUrl = null;

    if (postType === "image") {
      imageUrl = await uploadImage();
      console.log("Image URL:", imageUrl);
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        post_type: postType,
        caption: caption,
        image_url: imageUrl,
      })
      .select();

    if (!error) {
      alert("Post uploaded!");

      setCaption("");
      setImage(null);
      setPostType("blog");

      navigation.goBack();
    }
  };
  return (
    <LinearGradient
      colors={["#FFF2F7", "#FFF5E6"]}
      style={{
        flex: 1,
        marginHorizontal: 5,

        backgroundColor: "yellow",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          marginBottom: 20,
          justifyContent: "space-evenly",

          marginVertical: 15,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setPostType("image");
            pickImage();
          }}
          style={{
            backgroundColor: "#FFFFFF",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: 5,
            borderRadius: 10,
          }}
        >
          <Image
            source={{
              uri: "https://thumbs.wbm.im/pw/small/408d05d7de8ce0a4fdfd30edf6f924f6.jpg",
            }}
            resizeMode="cover"
            style={{ height: 180, width: 170, borderRadius: 10 }}
          />
          <Text
            style={{
              padding: 5,
              fontSize: 19,
              fontFamily: "PlayfairDisplay_700Bold",
              letterSpacing: 0.5,
            }}
          >
            Image
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#FFFFFF",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: 5,
            borderRadius: 10,
          }}
          onPress={() => setPostType("blog")}
        >
          <Image
            source={{
              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyhhl_-LT7V5MGztEIVK4V42hzYaU9Nx2TTA&s",
            }}
            style={{ height: 180, width: 170, borderRadius: 10 }}
          />
          <Text
            style={{
              padding: 5,
              fontSize: 19,
              fontFamily: "PlayfairDisplay_700Bold",
              letterSpacing: 0.5,
            }}
          >
            blog
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row" }}>
        {image && (
          <View>
            <Image
              source={{ uri: image }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 10,
                marginBottom: 15,
                alignSelf: "center",
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setImage(null);
                setPostType("blog");
              }}
              style={{ position: "absolute", right: -10, top: -10 }}
            >
              <Ionicons name="close-circle" size={36} color={"#6C63FF"} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TextInput
        placeholder="Write caption or blog..."
        placeholderTextColor={"grey"}
        value={caption}
        onChangeText={setCaption}
        multiline
        style={{
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          fontSize: 16,
          borderRadius: 10,
          marginBottom: 7,
        }}
      />

      <TouchableOpacity
        onPress={createPost}
        style={{
          backgroundColor: "#6C63FF",
          padding: 10,
          alignItems: "center",
          borderRadius: 12,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: "white",
            fontFamily: "PlayfairDisplay_700Bold",
            letterSpacing: 1.5,
          }}
        >
          Post
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};
export default UploadScreen;

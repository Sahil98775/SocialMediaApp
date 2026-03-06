import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { supabase } from "../../../SupaBase";
import styles from "./styles";
import { pickProfileImage } from "../../../Utils/PickProfileImage";
import { pickBackgroundImage } from "../../../Utils/pickBackgroundImage";
import { uploadImage } from "../../../Utils/uploadImage";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
const Edits = () => {
  const navigation = useNavigation<any>();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  type ProfileData = {
    name: string;
    username: string;
    country: string;
    bio: string;
    gender: string;
    profileImageUri: string | null;
    backgroundImageUri: string | null;
  };
  const defaultProfile =
    "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D";

  const saveProfile = async (
    {
      name,
      username,
      country,
      bio,
      gender,
      profileImageUri,
      backgroundImageUri,
    }: ProfileData,
    onSuccess?: () => void
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("User not logged in");
      return;
    }

    let profileUrl = null;
    let backgroundUrl = null;

    if (profileImageUri) {
      profileUrl = await uploadImage(
        profileImageUri,
        "profile-images",
        `${user.id}-profile.jpg`
      );
    }

    if (backgroundImageUri) {
      backgroundUrl = await uploadImage(
        backgroundImageUri,
        "cover-images",
        `${user.id}-background.jpg`
      );
    }

    const { error } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        name,
        username,
        country,
        bio,
        gender,
        profile_image: profileUrl,
        background_image: backgroundUrl,
      },
      { onConflict: "id" }
    );

    if (error) {
      console.log("Supabase error:", error);
    } else {
      console.log("Profile uploaded successfully!");

      if (onSuccess) {
        onSuccess();
      }
    }
  };
  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.log("Fetch error:", error);
      return;
    }

    if (data) {
      setName(data.name || "");
      setUsername(data.username || "");
      setCountry(data.country || "");
      setBio(data.bio || "");
      setGender(data.gender || "");
      setProfileImage(data.profile_image || null);
      setBackgroundImage(data.background_image || null);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  return (
    <ScrollView
      contentContainerStyle={{
        padding: 10,
      }}
    >
      {backgroundImage ? (
        <ImageBackground
          source={{ uri: backgroundImage }}
          style={styles.container}
        >
          <TouchableOpacity
            onPress={() => pickBackgroundImage(setBackgroundImage)}
          >
            <Ionicons name="pencil" size={26} style={styles.pen} />
          </TouchableOpacity>
        </ImageBackground>
      ) : (
        <LinearGradient
          colors={["#7B8FF7", "#DDE7FF", "#F8E1F4", "#FFF5E6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.container}
        >
          <TouchableOpacity
            onPress={() => pickBackgroundImage(setBackgroundImage)}
          >
            <Ionicons name="pencil" size={26} style={styles.pen} />
          </TouchableOpacity>
        </LinearGradient>
      )}
      <View style={styles.container1}>
        <View style={styles.container2}>
          <Image
            source={{
              uri: profileImage || defaultProfile,
            }}
            style={{ height: 155, width: 155, borderRadius: 80 }}
          />
        </View>
        <TouchableOpacity
          style={{
            marginTop: 80,
          }}
          onPress={() => pickProfileImage(setProfileImage)}
        >
          <Text style={styles.editimage}>Edit image</Text>
        </TouchableOpacity>
        <View
          style={{
            marginTop: 30,
            width: "95%",
          }}
        >
          <View style={styles.fields}>
            <Text style={styles.textput}>Name</Text>
            <TextInput
              placeholder="Enter Name"
              placeholderTextColor={"grey"}
              style={{ fontSize: 18 }}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.textinput}>
            <Text style={styles.textput}>Username</Text>
            <TextInput
              placeholder="Enter Name"
              placeholderTextColor={"grey"}
              style={{ fontSize: 18 }}
              value={username}
              onChangeText={setUsername}
            />
          </View>
          <View style={styles.textinput}>
            <Text style={styles.textput}>Country</Text>
            <TextInput
              placeholder="Country"
              placeholderTextColor={"grey"}
              style={{ fontSize: 18 }}
              value={country}
              onChangeText={setCountry}
            />
          </View>
          <View style={styles.textinput}>
            <TextInput
              placeholder="Enter Bio"
              placeholderTextColor={"grey"}
              multiline
              numberOfLines={4}
              maxLength={150}
              value={bio}
              onChangeText={setBio}
              style={styles.bio}
            />
          </View>
          <View style={styles.textinput}>
            <Text style={styles.textput}>Gender</Text>
            <TextInput
              placeholder="Male/Female/others"
              placeholderTextColor={"grey"}
              style={{ fontSize: 18 }}
              value={gender}
              onChangeText={setGender}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.but}
          onPress={() =>
            saveProfile(
              {
                name,
                username,
                country,
                bio,
                gender,
                profileImageUri: profileImage,
                backgroundImageUri: backgroundImage,
              },
              navigation.navigate("Mains", {
                screen: "Profile",
              })
            )
          }
        >
          <Text style={styles.butText}>Add to Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
export default Edits;

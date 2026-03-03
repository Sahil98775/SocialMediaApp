import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./PofileStyle";
import { useFonts } from "expo-font";
import { PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import {
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useNavigation } from "@react-navigation/native";
const posts = [
  { id: "1", image: "https://picsum.photos/300/300?1" },
  { id: "2", image: "https://picsum.photos/300/300?2" },
  { id: "3", image: "https://picsum.photos/300/300?3" },
  { id: "4", image: "https://picsum.photos/300/300?4" },
  { id: "5", image: "https://picsum.photos/300/300?5" },
  { id: "6", image: "https://picsum.photos/300/300?6" },
];

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: "https://picsum.photos/800/400" }}
        style={styles.cover}
      />

      <View style={styles.profileContainer}>
        <Image
          source={{ uri: "https://picsum.photos/200" }}
          style={styles.profileImage}
        />

        <View style={styles.verifiedBadge}>
          <Ionicons name="add" size={14} color="white" />
        </View>
      </View>

      <Text style={styles.name}>name</Text>
      <Text style={styles.username}>@username</Text>

      <View style={styles.bioCard}>
        <Text style={styles.bioText}>Bio..</Text>
      </View>
      <View style={styles.edipro}>
        <View>
          <Text style={styles.countpost}>0</Text>
          <Text style={styles.postfollow}>posts</Text>
        </View>
        <View>
          <Text style={styles.countpost}>0</Text>
          <Text style={styles.postfollow}>followers</Text>
        </View>
        <View>
          <Text style={styles.countpost}>0</Text>
          <Text style={styles.postfollow}>following</Text>
        </View>
      </View>
      <View style={styles.edits}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("Edits")}
        >
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => navigation.navigate("Settings")}
        >
          <Ionicons name="settings" size={30} color="#6C63FF" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity>
          <Ionicons name="grid-outline" size={22} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="create-outline" size={29} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={25} />
        </TouchableOpacity>
      </View>

      {/* <FlatList
        data={posts}
        numColumns={3}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Image source={{ uri: item.image }} style={styles.postImage} />
        )}
      /> */}
    </ScrollView>
  );
};
export default ProfileScreen;

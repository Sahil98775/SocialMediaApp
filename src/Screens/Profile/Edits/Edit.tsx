import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../PofileStyle";
import { Ionicons } from "@expo/vector-icons";
const Edits = () => {
  return (
    <ScrollView
      contentContainerStyle={{
        padding: 10,
      }}
    >
      <View>
        <LinearGradient
          colors={["#7B8FF7", "#DDE7FF", "#F8E1F4", "#FFF5E6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            height: 200,
            width: "100%",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
        />
        <TouchableOpacity>
          <Ionicons
            name="pencil"
            size={26}
            style={{ position: "absolute", top: -40, right: 5 }}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          borderStartEndRadius: 50,
          borderEndEndRadius: 50,
        }}
      >
        <View
          style={{
            height: 160,
            width: 160,
            borderRadius: 80,
            borderWidth: 3,
            borderColor: "#FFFFFF",
            elevation: 2,
            margin: -70,
            padding: 3,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={{
              uri: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
            }}
            style={{ height: 155, width: 155, borderRadius: 80 }}
          />
        </View>
        <TouchableOpacity
          style={{
            marginTop: 80,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "500", color: "#6C63FF" }}>
            Edit image
          </Text>
        </TouchableOpacity>
        <View
          style={{
            marginTop: 30,
            width: "95%",
          }}
        >
          <View
            style={{
              borderRadius: 10,
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingTop: 2,
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: "700" }}>Name</Text>
            <TextInput placeholder="Enter Name" style={{ fontSize: 18 }} />
          </View>
          <View
            style={{
              borderRadius: 10,
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingTop: 2,
              marginTop: 15,
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: "700" }}>Username</Text>
            <TextInput placeholder="Enter Name" style={{ fontSize: 18 }} />
          </View>
          <View
            style={{
              borderRadius: 10,
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingTop: 2,
              marginTop: 15,
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: "700" }}>Country</Text>
            <TextInput placeholder="Country" style={{ fontSize: 18 }} />
          </View>
          <View
            style={{
              borderRadius: 10,
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingTop: 2,
              marginTop: 15,
            }}
          >
            <TextInput
              placeholder="Enter Bio"
              multiline
              numberOfLines={4}
              maxLength={150}
              style={{
                width: "90%",
                height: 150,

                fontSize: 16,
                textAlignVertical: "top",
              }}
            />
          </View>
          <View
            style={{
              borderRadius: 10,
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingTop: 2,
              marginTop: 15,
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: "700" }}>Gender</Text>
            <TextInput
              placeholder="Male/Female/others"
              style={{ fontSize: 18 }}
            />
          </View>
        </View>
        <TouchableOpacity
          style={{
            margin: 100,
            borderWidth: 3,
            borderRadius: 20,
            borderColor: "#FFFFFF",
            backgroundColor: "#6C63FF",
            width: "60%",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              padding: 20,
              color: "#FFFFFF",
            }}
          >
            Add to Profile
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
export default Edits;

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Styles from "./RegStyle";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const Register = () => {
  const navigation = useNavigation<any>();
  return (
    <ScrollView>
      <LinearGradient
        colors={["#7B8FF7", "#DDE7FF", "#F8E1F4", "#FFF5E6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={Styles.container1}
      >
        <Image
          source={require("../../../icon.png")}
          style={{ width: 300, height: 300 }}
          resizeMode="contain"
        />
      </LinearGradient>

      <View style={Styles.container2}>
        <Text style={Styles.heading}>Name</Text>
        <View style={Styles.textBox}>
          <Ionicons name="person" color={"grey"} size={22} />
          <TextInput placeholder="Enter your Name" style={Styles.input} />
        </View>
        <Text style={Styles.heading}>UserName</Text>
        <View style={Styles.textBox}>
          <Ionicons name="person" color={"grey"} size={22} />
          <TextInput placeholder="Enter your UserName" style={Styles.input} />
        </View>
        <Text style={Styles.heading}>Email</Text>
        <View style={Styles.textBox}>
          <Ionicons name="person" color={"grey"} size={22} />
          <TextInput placeholder="Enter your Email" style={Styles.input} />
        </View>
        <Text style={Styles.heading}>Password</Text>
        <View style={Styles.textBox}>
          <Ionicons name="person" color={"grey"} size={22} />
          <TextInput placeholder="Enter Password" style={Styles.input} />
        </View>
        <View style={[Styles.textBox, { marginTop: 15 }]}>
          <Ionicons name="person" color={"grey"} size={22} />
          <TextInput placeholder="Re-Enter Password" style={Styles.input} />
        </View>
        <TouchableOpacity
          style={Styles.logbutton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 22 }}>Sign Up</Text>
        </TouchableOpacity>

        <View style={Styles.haveAccount}>
          <Text numberOfLines={3} style={Styles.Sign}>
            By signing up, you agree to our
            <Text style={{ color: "#2D7CF6", fontSize: 16 }}>
              Terms of service and Privacy Policy.
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};
export default Register;

import { LinearGradient } from "expo-linear-gradient";
import { View, Text } from "react-native";
const SearchScreen = () => {
  return (
    <LinearGradient
      colors={["#7B8FF7", "#DDE7FF", "#F8E1F4", "#FFF5E6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, padding: 10 }}
    >
      <Text>Welcome to search screen</Text>
    </LinearGradient>
  );
};
export default SearchScreen;

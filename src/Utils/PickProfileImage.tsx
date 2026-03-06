import * as ImagePicker from "expo-image-picker";
export const pickProfileImage = async (
  setProfileImage: (uri: string) => void
) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    alert("Permission denied!");
    return;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
  });

  if (result.canceled) return;
  setProfileImage(result.assets[0].uri);
};

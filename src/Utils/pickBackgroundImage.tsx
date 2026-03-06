// utils/pickBackgroundImage.ts
import * as ImagePicker from "expo-image-picker";

export const pickBackgroundImage = async (
  setBackgroundImage: (uri: string) => void
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
  setBackgroundImage(result.assets[0].uri);
};

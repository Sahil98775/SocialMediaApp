import { supabase } from "../SupaBase";

export const uploadImage = async (
  uri: string,
  bucket: string,
  fileName: string
): Promise<string | null> => {
  try {
    const formData = new FormData();

    formData.append("file", {
      uri: uri,
      name: fileName,
      type: "image/jpeg",
    } as any);

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, formData, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) {
      console.log("Upload error:", error);
      return null;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return data.publicUrl;
  } catch (err) {
    console.log("UploadImage Error:", err);
    return null;
  }
};

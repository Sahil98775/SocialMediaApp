// import { View, Text, Image, TouchableOpacity } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import styles from "../../Screens/Feeds/feedStyle";

// type Props = {
//   item: any;
//   userId: string | null;
//   toggleLike: (id: string) => void;
//   openComment: (id: string) => void;
//   openLikes: (id: string) => void;
//   formatDate: (date: string) => string;
// };

// export default function PostCard({
//   item,
//   userId,
//   toggleLike,
//   openComment,
//   openLikes,
//   formatDate,
// }: Props) {
//   const likesArray = Array.isArray(item.likes) ? item.likes : [];
//   const isLiked = likesArray.some((like) => like.user_id === userId);

//   return (
//     <View style={styles.style1}>
//       <View style={styles.style2}>
//         <Image
//           source={{
//             uri:
//               item.profiles?.profile_image ||
//               "https://i.pravatar.cc/150?img=12",
//           }}
//           style={{ width: 50, height: 50, borderRadius: 40 }}
//         />

//         <View style={styles.style3}>
//           <Text style={styles.style4}>{item.profiles?.username}</Text>
//           <Text style={styles.style5}>{item.profiles?.country}</Text>
//         </View>
//       </View>

//       {item.post_type === "image" && item.image_url && (
//         <>
//           <Image source={{ uri: item.image_url }} style={styles.style6} />

//           <View style={styles.style7}>
//             <TouchableOpacity
//               onPress={() => toggleLike(item.id)}
//               style={styles.style8}
//             >
//               <Ionicons
//                 name={isLiked ? "heart" : "heart-outline"}
//                 size={28}
//                 color="#FF6B81"
//               />
//               <Text style={styles.style9}>{likesArray.length}</Text>
//             </TouchableOpacity>

//             <TouchableOpacity onPress={() => openComment(item.id)}>
//               <Ionicons name="chatbox" size={26} color="#8FA0E0" />
//             </TouchableOpacity>
//           </View>

//           <Text style={styles.style14}>{formatDate(item.created_at)}</Text>
//         </>
//       )}
//     </View>
//   );
// }

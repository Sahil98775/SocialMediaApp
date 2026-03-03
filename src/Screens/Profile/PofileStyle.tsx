import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");

const IMAGE_SIZE = width / 3 - 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5FA",
  },
  cover: {
    width: "100%",
    height: 150,
  },
  profileContainer: {
    alignSelf: "center",
    marginTop: -50,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "white",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#6C63FF",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  username: {
    textAlign: "center",
    color: "gray",
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  bioCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bioText: {
    flex: 1,
  },
  countpost: { fontSize: 30, color: "#6C63FF", fontWeight: "500" },
  postfollow: { fontSize: 17, fontFamily: "Poppins_600Bold" },
  edits: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 20,
  },
  edipro: {
    marginHorizontal: 30,
    marginVertical: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editIcon: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  //   "#9FB1F5"
  editButton: {
    backgroundColor: "#6C63FF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "85%",
  },
  editText: {
    fontSize: 17,
    color: "white",
    fontWeight: "bold",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "white",
  },
  postImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    margin: 5,
    borderRadius: 10,
  },
});
export default styles;

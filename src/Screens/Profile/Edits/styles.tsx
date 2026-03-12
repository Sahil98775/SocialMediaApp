import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  pen: { position: "absolute", right: 10, top: 10 },
  container1: {
    alignItems: "center",
    justifyContent: "center",
    borderStartEndRadius: 50,
    borderEndEndRadius: 50,
    backgroundColor: "#FFFFFF",
    elevation: 1,
  },
  container2: {
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
  },
  editimage: { fontSize: 20, fontWeight: "500", color: "#6C63FF" },
  fields: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingTop: 2,
  },
  textinput: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingTop: 2,
    marginTop: 15,
  },
  textput: { fontSize: 17, fontWeight: "700" },
  bio: {
    width: "90%",
    height: 150,
    fontSize: 16,
    textAlignVertical: "top",
  },
  but: {
    margin: 100,
    borderWidth: 3,
    borderRadius: 20,
    borderColor: "#FFFFFF",
    backgroundColor: "#6C63FF",
    width: "60%",
    alignItems: "center",
  },
  butText: {
    fontSize: 18,
    fontWeight: "700",
    padding: 20,
    color: "#FFFFFF",
  },
});
export default styles;

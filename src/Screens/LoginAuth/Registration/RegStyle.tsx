import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
  container1: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  container2: {
    flex: 8,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 35,
    paddingHorizontal: 20,
    marginTop: -30,
    overflow: "hidden",
  },
  heading: {
    fontSize: 20,
    fontWeight: "500",
    marginHorizontal: 5,
  },
  textBox: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    borderWidth: 1,
    padding: 8,
    borderRadius: 15,
    borderColor: "grey",
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "400",
    color: "#020202",
  },
  logbutton: {
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 0.5,
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: "#1E59B3",
    borderRadius: 10,
    marginBottom: 30,
    elevation: 3,
  },
  haveAccount: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    paddingBottom: 30,
  },
  Sign: {
    margin: 20,
    color: "#020202",
    fontSize: 15,
    fontWeight: "400",
    paddingRight: 3,
  },
});
export default Styles;

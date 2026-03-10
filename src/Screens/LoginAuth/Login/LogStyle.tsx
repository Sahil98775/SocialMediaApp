import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  log: {
    padding: 10,
    marginTop: 15,
    borderBottomWidth: 0.3,
  },
  logIn: {
    fontSize: 35,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 20,
  },
  container1: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  container2: {
    flex: 5,
    backgroundColor: "#F8F9FE",
    borderRadius: 50,
    padding: 7,
    marginTop: -30,
    overflow: "hidden",
  },
  textBox: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    borderWidth: 1,
    padding: 4,
    borderRadius: 15,
    borderColor: "grey",
  },
  input: {
    flex: 1,
    marginLeft: 2,
    fontSize: 17,
    fontWeight: "400",
    color: "#020202",
  },
  logbutton: {
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 0.5,
    marginHorizontal: 5,
    padding: 7,
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
  },
  Sign: {
    color: "#020202",
    fontSize: 17,
    fontWeight: "400",
    paddingRight: 3,
  },
});
export default Styles;

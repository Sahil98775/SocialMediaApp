import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  log: {
    padding: 10,
    marginTop: 10,
    borderBottomWidth: 0.3,
  },
  logIn: {
    fontSize: 35,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 30,
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
    padding: 20,
    marginTop: -30,
    overflow: "hidden",
  },
  textBox: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
    marginVertical: 10,
    borderWidth: 1,
    padding: 8,
    borderRadius: 15,
    borderColor: "grey",
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 17,
    fontWeight: "400",
    color: "#020202",
  },
  logbutton: {
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
  },
  Sign: {
    color: "#020202",
    fontSize: 17,
    fontWeight: "400",
    paddingRight: 3,
  },
});
export default Styles;

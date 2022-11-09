import { StyleSheet } from "react-native";

module.exports = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0.7,
    backgroundColor: "black",
    padding: 15,
    borderRadius: 40,
    marginTop: 20,
  },
  secondaryButton: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0.7,
    backgroundColor: "white",
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 1,
    padding: 15,
    borderRadius: 40,
    marginTop: 20,
  },
  intputContainer: {
    flexDirection: "row",
    marginVertical: 10,
    width: "100%",
  },
  input: {
    backgroundColor: "#f3f3f3",
    flex: 1,
    padding: 10,
    borderRadius: 20,
  },
  errText: {
    color: "red",
  },
});

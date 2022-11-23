import { StyleSheet, View, TouchableOpacity } from "react-native";
import RText from "../RText";
import Greeting from "../../assets/svg/greeting.svg";
import MainButton, { SecondaryButton } from "../buttons";
import Login from "../access/Login";
import Register from "../access/Register";
function Welcome({ navigation }) {
  return (
    <>
      <View style={styles.greetingsContainer}>
        <View style={{ width: "90%", flex: 1, justifyContent: "center" }}>
          <Login />
        </View>
        <TouchableOpacity
          style={{ marginBottom: 15 }}
          onPress={() => navigation.navigate("register")}
        >
          <RText tipo={"bold"}>¿Todavía no tenes una cuenta? Registrate</RText>
        </TouchableOpacity>
        {/* <Greeting height={60} width={60} fill="black" />
        <RText style={styles.text}>Bienvenido a Binkio</RText>
        <MainButton
          width={0.7}
          style={{ marginTop: 20 }}
          callback={() => navigation.navigate("register")}
        >
          Registrate
        </MainButton>
        <SecondaryButton
          width={0.7}
          style={{ marginTop: 20 }}
          callback={() => navigation.navigate("login")}
        >
          Iniciar Sesión
        </SecondaryButton> */}
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  titleContainer: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  greetingsContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 35,
    marginTop: 20,
    fontWeight: "500",
  },
  image: {
    height: 70,
    width: 70,
  },
});

export default Welcome;

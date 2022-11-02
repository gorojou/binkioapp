import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import RText from "../RText";
import s from "../styles";
import useAuth from "../../context/AuthContext";
import Navbar from "./Navbar";
import SelectToken from "./SelectToken";
import CopyToClipboard from "../CopyToClipboard";
import MainButton from "../buttons";
import Bitcoin from "../../assets/svg/bitcoin.svg";
import Ethereum from "../../assets/svg/ethereum.svg";
export default function Recibir({ navigation }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [token, setToken] = useState("btc");
  return (
    <>
      <ScrollView contentContainerStyle={styles.sessionContainer}>
        <View style={styles.formContainer}>
          <View style={styles.formulario}>
            <RText style={styles.formTitle} tipo={"bold"}>
              Recibir
            </RText>
            <RText style={styles.sessionTitle} tipo={"thin"}>
              Recibir token en:
            </RText>
            {err && <RText style={s.errText}>{err}</RText>}

            <SelectToken token={token} setToken={setToken} />
            {currentUser[token === "btc" ? token : "eth"].publicKey ? (
              <>
                <CopyToClipboard
                  value={
                    token === "btc"
                      ? currentUser[token].publicKey
                      : currentUser.eth.publicKey
                  }
                />
                <Image
                  source={require("../../assets/qr.png")}
                  style={styles.qr}
                />
              </>
            ) : (
              <>
                <RText style={{ ...styles.formTitle, marginTop: 30 }}>
                  Necesitas crear una wallet
                </RText>
                <MainButton callback={() => navigation.navigate("wallet")}>
                  Ir a crear Wallet
                </MainButton>
              </>
            )}
          </View>
        </View>
      </ScrollView>
      <Navbar navigation={navigation} />
    </>
  );
}
const styles = StyleSheet.create({
  sessionContainer: {
    overflow: "scroll",
    paddingBottom: 60,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    marginVertical: 10,
    fontSize: 25,
  },
  formContainer: {
    width: Dimensions.get("window").width - 30,
  },
  formulario: {
    justifyContent: "center",
    alignItems: "center",
  },
  formTitle: {
    fontSize: 30,
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    padding: 5,
    marginTop: 20,
  },
  balance: {
    fontSize: 20,
    textAlign: "center",
  },
  balanceNum: {
    fontSize: 25,
    textAlign: "center",
  },
  qr: {
    width: Dimensions.get("window").width - 30,
    maxHeight: Dimensions.get("window").width - 30,
  },
});

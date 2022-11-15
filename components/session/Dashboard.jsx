import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import RText from "../RText";
import Navbar from "./Navbar";
import useAuth from "../../context/AuthContext";
import paid from "../../assets/paid.png";
import send from "../../assets/send.png";
import data from "../../assets/data.png";
import download from "../../assets/download.png";
import PfpImage from "./PfpImage";
import ftx from "../../assets/ftx.png";
import CurrentTokenSvg from "./CurrentTokenSvg";
import { useBlockChainContext } from "../../context/BlockchainContext";
import Popup from "./Popup";
import SelectToken from "./SelectToken";
import MainButton from "../buttons";
export default function Dashboard({ navigation }) {
  const { currentUser, balance } = useAuth();
  const { token } = useBlockChainContext();
  const [FTXStatus, setFTXStatus] = useState("");
  const [show, setShow] = useState();
  const connectFTX = () => {
    if (FTXStatus === "Conectado a FTX") return;
    setFTXStatus("Conectando con FTX...");
    setTimeout(() => {
      setFTXStatus("Conectado a FTX");
    }, 3000);
  };
  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View>
            <RText style={styles.titulo}>
              ¡Hola <RText tipo={"bold"}>{currentUser.nombre}</RText>!
            </RText>
            <TouchableOpacity style={styles.ftxConection} onPress={connectFTX}>
              <Image source={ftx} style={{ height: 25, width: 30 }} />

              {FTXStatus ? (
                <>
                  {FTXStatus == "Conectado a FTX" ? (
                    <RText style={{ ...styles.FTXStatusText, color: "green" }}>
                      {FTXStatus}
                    </RText>
                  ) : (
                    <RText style={styles.FTXStatusText}>
                      Conectando Con FTX...
                    </RText>
                  )}
                </>
              ) : (
                <RText style={styles.FTXStatusText}>
                  Presiona para conectar con FTX
                </RText>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dashBalance}
              onPress={() => setShow(true)}
            >
              <RText style={styles.balance}>
                Balance: {balance[token] === null ? "-.--" : balance[token]}
              </RText>
              <CurrentTokenSvg height={20} width={20} />
            </TouchableOpacity>
          </View>
          <View>
            <PfpImage styles={styles.pfpImage} size={60} />
          </View>
        </View>

        <View style={styles.body}>
          <Activities
            navigation={navigation}
            title={"Solicitud de Credito"}
            bg={download}
            link={"solicitud"}
          />
          <Activities
            navigation={navigation}
            title={"Enviar"}
            bg={send}
            link={"enviar"}
          />
          <Activities
            navigation={navigation}
            title={"Garantía"}
            bg={data}
            link={"garantia"}
          />
          <Activities
            navigation={navigation}
            title={"Recibir"}
            bg={paid}
            link={"recibir"}
          />
        </View>
      </ScrollView>
      {show && (
        <Popup setShow={setShow}>
          <RText
            style={{
              ...styles.titulo,
              textAlign: "center",
              marginVertical: 15,
            }}
          >
            Selecciona el Token que quieras
          </RText>
          <SelectToken />
          <MainButton width={0.8} callback={() => setShow(false)}>
            Listo
          </MainButton>
        </Popup>
      )}
      <Navbar navigation={navigation} />
    </>
  );
}
const Activities = ({ title, navigation, bg, link }) => {
  return (
    <>
      <TouchableOpacity
        style={styles.activity}
        onPress={() => navigation.navigate(link)}
      >
        <RText style={styles.titulo} tipo={"bold"}>
          {title}
        </RText>
        <Image source={bg} style={styles.activityBg} />
      </TouchableOpacity>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "scroll",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 0,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titulo: {
    fontSize: 30,
  },
  pfpImage: {
    marginBottom: 15,
  },
  body: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 40,
  },
  activity: {
    position: "relative",
    marginVertical: 10,
    padding: 30,
    borderRadius: 30,
    backgroundColor: "#f3f3f3",
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityBg: {
    position: "absolute",
    right: 0,
    height: 100,
    width: 100,
    opacity: 0.05,
  },
  ftxConection: {
    padding: 5,
    marginTop: 5,
    backgroundColor: "#f3f3f3",
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  FTXStatusText: {
    fontSize: 10,
    paddingLeft: 10,
  },
  dashBalance: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  balance: {
    marginRight: 2,
    fontSize: 15,
  },
});

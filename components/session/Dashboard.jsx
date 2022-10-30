import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import RText from "../RText";
import Navbar from "./Navbar";
import useAuth from "../../context/AuthContext";
import paid from "../../assets/paid.png";
import send from "../../assets/send.png";
import download from "../../assets/download.png";
import PfpImage from "./PfpImage";
import { useFTX } from "../../context/FTXContext";
import ftx from "../../assets/ftx.png";
export default function Dashboard({ navigation }) {
  const { currentUser } = useAuth();
  const { getMarkets } = useFTX();
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    const app = async () => {
      try {
        const response = await getMarkets();
        console.log(response);
        setConnected(true);
      } catch (err) {
        console.log(err);
      }
    };
    return app;
  }, []);

  return (
    <>
      <View style={styles.header}>
        <View>
          <RText style={styles.titulo}>
            ¡Hola <RText tipo={"bold"}>{currentUser.nombre}</RText>!
          </RText>
          <RText>
            Balance Actual: <RText tipo={"bold"}>0.00</RText>
          </RText>
        </View>
        <PfpImage styles={styles.pfpImage} size={60} />
      </View>
      <View style={styles.ftxConection}>
        <Image source={ftx} style={{ height: 80, width: 80 }} />
        {connected ? (
          <RText tipo={"bold"} style={{ color: "green" }}>
            Conectado
          </RText>
        ) : (
          <RText>Conectando Con FTX...</RText>
        )}
      </View>
      <View style={styles.body}>
        <Activities navigation={navigation} title={"Cargar"} bg={download} />
        <Activities navigation={navigation} title={"Enviar"} bg={send} />
        <Activities navigation={navigation} title={"Recibir"} bg={paid} />
      </View>
      <Navbar navigation={navigation} />
    </>
  );
}
const Activities = ({ title, navigation, bg }) => {
  return (
    <>
      <TouchableOpacity style={styles.activity}>
        <RText style={styles.titulo} tipo={"bold"}>
          {title}
        </RText>
        <Image source={bg} style={styles.activityBg} />
      </TouchableOpacity>
    </>
  );
};
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
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
    flexDirection: "row",
    alignItems: "center",
  },
});

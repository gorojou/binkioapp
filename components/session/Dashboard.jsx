import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import RText from "../RText";
import Navbar from "./Navbar";
import useAuth from "../../context/AuthContext";
import paid from "../../assets/paid.png";
import send from "../../assets/send.png";
import data from "../../assets/data.png";
import download from "../../assets/download.png";
import PfpImage from "./PfpImage";
import { useFTX } from "../../context/FTXContext";
import ftx from "../../assets/ftx.png";
export default function Dashboard({ navigation }) {
  const { currentUser } = useAuth();
  const { connected } = useFTX();
  const [FTXStatus, setFTXStatus] = useState("");
  const connectFTX = () => {
    setFTXStatus("Conectando con FTX...");
    setTimeout(() => {
      setFTXStatus("Conectado");
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
            <View style={styles.ftxConection}>
              <TouchableOpacity onPress={connectFTX}>
                <Image source={ftx} style={{ height: 32, width: 38 }} />
              </TouchableOpacity>
              {FTXStatus ? (
                <>
                  {FTXStatus == "Conectado" ? (
                    <RText style={{ ...styles.FTXStatusText, color: "green" }}>
                      Conectado
                    </RText>
                  ) : (
                    <RText style={styles.FTXStatusText}>
                      Conectando Con FTX...
                    </RText>
                  )}
                </>
              ) : (
                <RText style={styles.FTXStatusText}>
                  Presiona para conectar
                </RText>
              )}
            </View>
          </View>
          <PfpImage styles={styles.pfpImage} size={60} />
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
    paddingBottom: 20,
    paddingTop: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  FTXStatusText: {
    fontSize: 10,
    paddingLeft: 10,
  },
});

import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import RText from "../RText";
import Navbar from "./Navbar";
import useAuth from "../../context/AuthContext";
import paid from "../../assets/paid.png";
import send from "../../assets/send.png";
import data from "../../assets/data.png";
import download from "../../assets/download.png";
import CurrentTokenSvg from "./CurrentTokenSvg";
import { useBlockChainContext } from "../../context/BlockchainContext";
import Popup from "../Popup";
import SelectToken from "./SelectToken";
import MainButton from "../buttons";
import MainWalletButton from "./Wallet/MainWalletButton";
export default function Dashboard({ navigation }) {
  const { balanceTotal, historic } = useAuth();
  const { token } = useBlockChainContext();
  const [show, setShow] = useState();

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setShow(true)}
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <RText style={{ fontSize: 20, textAlign: "center" }} tipo={"thin"}>
              Balance total de la cuenta
            </RText>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <RText style={styles.titulo}>
                {balanceTotal[token] ? (
                  <>
                    {parseFloat(balanceTotal[token]).toFixed(
                      Math.max(
                        2,
                        (balanceTotal[token].toString().split(".")[1] || [])
                          .length
                      )
                    )}{" "}
                  </>
                ) : (
                  <>{balanceTotal[token] === 0 ? <>0.00</> : "Cargando"}</>
                )}{" "}
              </RText>
              <CurrentTokenSvg height={20} width={20} />
            </View>
          </TouchableOpacity>
          <MainWalletButton width={0.9} customStyles={{ marginBottom: 20 }} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginBottom: 10,
            }}
          >
            <MainButton
              callback={() => navigation.navigate("enviar")}
              style={{ minWidth: "30%", marginHorizontal: 2.5 }}
              width={1}
              fontSize={12}
            >
              Enviar
            </MainButton>
            <MainButton
              callback={() => navigation.navigate("solicitud")}
              style={{ minWidth: "30%", marginHorizontal: 2.5 }}
              width={1}
              fontSize={12}
            >
              Solicitar
            </MainButton>
            <MainButton
              callback={() => navigation.navigate("garantia")}
              style={{ minWidth: "30%", marginHorizontal: 2.5 }}
              width={1}
              fontSize={12}
            >
              Estado Credito
            </MainButton>
          </View>
        </View>
        <View style={styles.body}>
          <ScrollView
            horizontal={true}
            contentContainerStyle={{ flexDirection: "row" }}
            style={styles.banners}
          >
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
          </ScrollView>
          <View style={styles.historic}>
            <RText style={styles.tituloHistoric}>Últimos Movimientos</RText>
            {historic ? (
              <>
                {historic.map((doc) => {
                  return (
                    <View key={doc.date} style={styles.historicDoc}>
                      <View>
                        <RText>{doc.tipo}</RText>
                        <RText tipo={"thin"} style={{ marginTop: 5 }}>
                          {doc.date.toDate().toDateString()}
                        </RText>
                      </View>
                      <View>
                        <RText>
                          {doc.cantidad} {doc.token.toUpperCase()}
                        </RText>
                      </View>
                    </View>
                  );
                })}
              </>
            ) : (
              <>
                <View style={styles.emptyHistoryContainer}>
                  <RText style={styles.emptyHistory}>
                    No haz realizado ningun movimiento aún
                  </RText>
                  <RText tipo={"thin"} style={{ textAlign: "center" }}>
                    Envia o recibe tokens y esas operaciones apareceran acá
                  </RText>
                </View>
              </>
            )}
          </View>
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
          <MainButton
            style={{ marginTop: 20 }}
            width={0.8}
            callback={() => setShow(false)}
          >
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
    justifyContent: "center",
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
    marginHorizontal: 10,
    padding: 30,
    borderRadius: 30,
    backgroundColor: "#f3f3f3",
    minWidth: 200,
    minHeight: 140,
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
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  balance: {
    marginRight: 2,
    fontSize: 15,
  },
  banners: {
    flexDirection: "row",
    padding: 5,
  },
  historic: {
    backgroundColor: "#f3f3f3",
    padding: 20,
    marginTop: 20,
    width: "100%",
    borderRadius: 20,
  },
  tituloHistoric: {
    fontSize: 25,
  },
  historicDoc: {
    flexDirection: "row",
    paddingVertical: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  emptyHistory: {
    textAlign: "center",
    fontSize: 25,
    marginBottom: 20,
  },
  emptyHistoryContainer: {
    backgroundColor: "#d9d9d9",
    borderRadius: 20,
    padding: 30,
    marginTop: 10,
  },
});

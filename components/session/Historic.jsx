import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import s from "../styles";
import React, { useEffect, useState } from "react";
import RText from "../RText";
import useAuth from "../../context/AuthContext";
import Loader from "../Loader";
export default function Historic({ dash }) {
  const { getUserHistory } = useAuth();
  const [query, setQuery] = useState();
  const [historic, setHistoric] = useState();
  const [loading, setLoading] = useState();
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setHistoric(await getUserHistory(dash));
        setLoading(false);
      } catch (err) {
        setLoading(false);
        Alert.alert("Algo salio mal");
      }
    })();
  }, []);

  return (
    <>
      {!dash ? (
        <>
          <ScrollView style={s.contianer}>
            <View style={{ paddingBottom: 50 }}>
              <RText style={styles.historicTitle}>Actividad</RText>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  marginVertical: 10,
                  backgroundColor: "#f3f3f3",
                  paddingVertical: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 0.3333,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <RText>Recientes</RText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 0.3333,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <RText style={{ color: "#a9a9a9" }}>Recibido</RText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 0.3333,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <RText style={{ color: "#a9a9a9" }}>Enviado</RText>
                </TouchableOpacity>
              </View>
              <HistoryList loading={loading} historic={historic} />
            </View>
          </ScrollView>
        </>
      ) : (
        <>
          <HistoryList loading={loading} historic={historic} />
        </>
      )}
    </>
  );
}
const HistoryList = ({ historic, loading }) => {
  return (
    <>
      <View style={styles.historicContainer}>
        {loading ? (
          <>{loading && <Loader size={100} />}</>
        ) : (
          <>
            {historic && historic.length ? (
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
          </>
        )}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  historicTitle: {
    textAlign: "center",
    fontSize: 35,
    marginTop: 20,
  },
  historicContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "relative",
    minHeight: 200,
  },
  tituloHistoric: {
    fontSize: 25,
  },
  historicDoc: {
    flexDirection: "row",
    paddingVertical: 20,
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
  },
  emptyHistory: {
    textAlign: "center",
    fontSize: 25,
    marginBottom: 20,
  },
  emptyHistoryContainer: {
    backgroundColor: "#d9d9d9",
    width: "90%",
    borderRadius: 20,
    padding: 30,
    marginTop: 20,
  },
});

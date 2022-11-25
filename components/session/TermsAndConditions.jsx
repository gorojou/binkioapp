import { View, StyleSheet, Switch } from "react-native";
import React, { useState, useEffect } from "react";
import RText from "../RText";
import Loader from "../Loader";
import s from "../styles";
import MainButton from "../buttons";
import useAuth from "../../context/AuthContext";
export default function TermsAndConditions() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [terms, setTerms] = useState(false);
  const [conditions, setConditions] = useState(false);
  const { updateTermsAndConditionsAcceptance, updateProfile } = useAuth();
  const accept = async () => {
    setLoading(true);
    try {
      await updateTermsAndConditionsAcceptance();
      await updateProfile();
    } catch (err) {
      console.log(err);
      setLoading(false);
      setErr("Algo salio mal, intenta nuevamente");
    }
  };
  return (
    <>
      <View style={styles.formularioContainer}>
        <View style={styles.formulario}>
          <RText style={styles.formTitle} tipo={"bold"}>
            Acepta nuestros terminos y condiciones
          </RText>
          {err && <RText style={s.errText}>{err}</RText>}
          <RText style={styles.instrucciones} tipo={"thin"}>
            Para continuar es necesario aceptar nuestros terminos y condiciones
          </RText>
          <View style={styles.termsYCondBox}>
            <View>
              <RText style={styles.termsYCondTitle}>
                Términos y condiciones{" "}
              </RText>
              <RText tipo={"thin"}>lorem ipsum link</RText>
            </View>
            <Switch
              trackColor={{ true: "#5d22fa" }}
              thumbColor={terms ? "5d22fa" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              value={terms}
              onValueChange={() => setTerms(!terms)}
            />
          </View>
          <View style={styles.termsYCondBox}>
            <View>
              <RText style={styles.termsYCondTitle}>
                Políticas de privacidad{" "}
              </RText>
              <RText tipo={"thin"}>lorem ipsum link</RText>
            </View>
            <Switch
              trackColor={{ true: "#5d22fa" }}
              thumbColor={conditions ? "5d22fa" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              value={conditions}
              onValueChange={() => setConditions(!conditions)}
            />
          </View>
          <MainButton
            style={{ marginTop: 20 }}
            width={1}
            blocked={!(terms && conditions)}
            callback={() => accept()}
          >
            Aceptar
          </MainButton>
          {loading && <Loader size={100} />}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  formularioContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formulario: {
    justifyContent: "center",
    alignItems: "center",
    width: "85%",
  },
  formTitle: {
    fontSize: 30,
    textAlign: "center",
  },
  termsYCondBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  termsYCondTitle: {
    fontSize: 20,
  },
  instrucciones: {
    marginVertical: 15,
    fontSize: 15,
    textAlign: "center",
  },
  popupElementsContianer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

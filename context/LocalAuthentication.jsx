import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import useAuth from "./AuthContext";
import s from "../components/styles";
import Popup from "../components/Popup";
import MainButton, { SecondaryButton } from "../components/buttons";
import FingerPrint from "../assets/svg/fingerPrint.svg";
import RText from "../components/RText";
const LocalAuthenticationContext = React.createContext();
export function useLocalAuth() {
  return useContext(LocalAuthenticationContext);
}
export default function LocalAuthenticationProvider({ children }) {
  const [isBiometricSuported, setIsBiometricSuported] = useState(false);
  const [show, setShow] = useState(false);
  const [resolver, setResolver] = useState({ resolver: null });
  const createPromise = () => {
    let resolver;
    return [
      new Promise((resolve, reject) => {
        resolver = resolve;
      }),
      resolver,
    ];
  };
  const requireAuth = async () => {
    setShow(true);
    const [promise, resolve] = await createPromise();
    setResolver({ resolve });
    return promise;
  };
  const authenticated = async (status) => {
    setShow(false);
    resolver.resolve(status);
  };
  return (
    <LocalAuthenticationContext.Provider value={{ requireAuth }}>
      {children}
      {show && (
        <Popup setShow={setShow} onClose={() => authenticated(false)}>
          <AuthPopup authenticated={authenticated} />
        </Popup>
      )}
    </LocalAuthenticationContext.Provider>
  );
}
const AuthPopup = ({ authenticated }) => {
  const [authenticateWithPin, setAuthenticateWithPin] = useState(true);
  const [err, setErr] = useState();
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState();
  const { currentUser } = useAuth();
  useEffect(() => {
    (async () => {
      setAuthenticateWithPin(!(await LocalAuthentication.hasHardwareAsync()));
    })();
  }, []);

  const authenticatePin = async () => {
    if (pin !== currentUser.pin) {
      return setErr("Pin Invalido");
    }
    authenticated(true);
  };

  const authenticateBio = async () => {
    try {
      const response = await (
        await LocalAuthentication.authenticateAsync({
          promptMessage: "Autentificate para continuar",
          cancelLabel: "Cancelar",
          disableDeviceFallback: true,
        })
      ).success;
      if (!response) return setErr("Autentificacion cancelada");
      authenticated(response);
    } catch (err) {
      console.log(err);
      setErr("Algo salio mal");
    }
  };
  return (
    <>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {authenticateWithPin ? (
          <>
            <View style={styles.formulario}>
              <View style={{ width: "90%", alignItems: "center" }}>
                <RText style={styles.formTitle} tipo={"bold"}>
                  Ingresa tu pin de seguridad
                </RText>
                <RText style={styles.sessionTitle} tipo={"thin"}>
                  Ingresa tu pin de seguridad para continuar
                </RText>
                {err && <RText style={s.errText}>{err}</RText>}
                <KeyboardAvoidingView>
                  <View style={styles.intputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Pin"
                      value={pin}
                      secureTextEntry={true}
                      keyboardType="numeric"
                      onChangeText={(value) =>
                        setPin((prev) => {
                          if (value.length > 4) return prev;
                          return value;
                        })
                      }
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View></View>
                    <MainButton
                      callback={() => authenticatePin()}
                      fontSize={15}
                    >
                      Confirmar
                    </MainButton>
                  </View>
                  {loading && <Loader size={100} />}
                </KeyboardAvoidingView>
              </View>
            </View>
          </>
        ) : (
          <>
            {err && <RText style={s.errText}>{err}</RText>}
            <TouchableOpacity
              style={styles.biometricButton}
              onPress={() => authenticateBio()}
            >
              <RText style={styles.biometricTitle}>
                Utiliza datos biometricos para continuar
              </RText>
              <FingerPrint fill={"black"} height={70} width={70} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setAuthenticateWithPin(true)}>
              <RText tipo={"bold"}>o ingresa tu pin de seguridad</RText>
            </TouchableOpacity>
          </>
        )}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  biometricButton: {
    justifyContent: "space-evenly",
    alignItems: "center",
    minHeight: 200,
    borderRadius: 20,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#f3f3f3",
    marginBottom: 40,
    width: "100%",
    padding: 20,
  },
  biometricTitle: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  formulario: {
    justifyContent: "center",
    alignItems: "center",
  },
  sessionTitle: {
    textAlign: "center",
  },
  formTitle: {
    fontSize: 30,
    textAlign: "center",
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
    textAlign: "center",
    marginVertical: 20,
  },
});

import React, { useContext, useState, useEffect } from "react";
import { Alert, View } from "react-native";
import Loader from "../components/Loader";
import firebase, { auth, firestore, storage } from "../firebase";
import * as SecureStore from "expo-secure-store";
const AuthContext = React.createContext();
export default function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children, navigation }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState({
    btc: null,
    eth: null,
    wbtc: null,
    usdt: null,
  });
  const logIn = async (email, password) => {
    try {
      await SecureStore.setItemAsync("USER_EMAIL", email);
      await SecureStore.setItemAsync("USER_PASS", password);
      const user = await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      if (err.code === "auth/wrong-password")
        throw { message: "Datos invalidos" };
      if (err.code === "auth/user-not-found")
        throw { message: "Usuario no existe" };
      throw err;
    }
  };
  const createWallet = async (wallet) => {
    await firestore.collection("users").doc(currentUser.user.uid).update({
      wallet: wallet.address,
    });
    await SecureStore.setItemAsync("MNEMONIC", wallet._mnemonic().phrase);
    await SecureStore.setItemAsync(
      "PRIVATE_KEY",
      wallet._signingKey().privateKey
    );
    await updateProfile();
  };
  const updateProfile = async () => {
    setLoading(true);
    try {
      const userDoc = await firestore
        .collection("users")
        .doc(currentUser.user.uid)
        .get();
      setCurrentUser({ user: currentUser.user, ...userDoc.data() });
      setLoading(false);
    } catch (err) {
      console.log(err);
      Alert("Hubo un error");
      await logOut();
    }
  };
  const uploadPfp = async (imageAsFile) => {
    return await storage
      .ref(`/users/${currentUser.user.uid}/pfp/pfp${currentUser.user.uid}`)
      .put(imageAsFile);
  };
  const selectType = async (type) => {
    const doc = await firestore
      .collection("users")
      .doc(currentUser.user.uid)
      .update({ type: type });
    await updateProfile();
    return doc;
  };
  const signUp = async (email, password, telefono, nombre, dia, mes, year) => {
    try {
      const user = await auth.createUserWithEmailAndPassword(email, password);
      try {
        const userDocRef = await firestore
          .collection("users")
          .doc(user.user.uid)
          .set({
            telefono,
            nombre,
            nacimiento: {
              d: dia,
              m: mes,
              a: year,
            },
            date: new Date().toUTCString(),
            type: "",
          });
        await logIn(email, password);
      } catch (err) {
        await user.user.delete();
        console.log(err);
      }
    } catch (err) {
      console.log(err);
      if (err.code === "auth/email-already-in-use")
        throw { message: "Correo ingresado ya esta registrado" };
      throw err;
    }
  };
  const logOut = async (goToStart) => {
    setLoading(true);
    await SecureStore.deleteItemAsync("USER_EMAIL", {});
    await SecureStore.deleteItemAsync("USER_PASS", {});
    await auth.signOut();
  };
  const transfer = async (amount, token) => {
    if (amount > balance[token]) throw { message: "Saldo insuficiente" };
    if (amount <= 0) throw { message: "Numero invalido" };
    try {
      // const doc = await firestore
      //   .collection("users")
      //   .doc(currentUser.user.uid)
      //   .update({
      //     balance: {
      //       ...currentUser.balance,
      //       [token]: currentUser.balance[token] - amount,
      //     },
      //   });
      await updateProfile();
    } catch (err) {
      throw err;
    }
  };
  const setStoredSession = async (user) => {
    const pass = await SecureStore.getItemAsync("USER_PASS");
    try {
      await logIn(user, pass);
    } catch (err) {
      console.log(err);
      await SecureStore.deleteItemAsync("USER_EMAIL", {});
      await SecureStore.deleteItemAsync("USER_PASS", {});
      setLoading(false);
    }
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setLoading(true);
      if (user) {
        try {
          const userDoc = await firestore
            .collection("users")
            .doc(user.uid)
            .get();
          setCurrentUser({ user: user, ...userDoc.data() });
          setLoading(false);
        } catch (err) {
          logOut();
          Alert.alert("Algo salio mal");
        }
        setLoading(false);
      } else {
        const storedUser = await SecureStore.getItemAsync("USER_EMAIL");
        if (storedUser) {
          await setStoredSession(storedUser);
        } else {
          setCurrentUser(user);
          setLoading(false);
          console.log(user);
        }
      }
    });
    return unsubscribe;
  }, []);
  const value = {
    signUp,
    currentUser,
    logIn,
    logOut,
    selectType,
    uploadPfp,
    updateProfile,
    createWallet,
    transfer,
    balance,
    setBalance,
  };
  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Loader size={100} />
          </View>
        </>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

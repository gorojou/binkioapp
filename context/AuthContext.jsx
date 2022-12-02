import React, { useContext, useState, useEffect } from "react";
import { Alert, View } from "react-native";
import Loader from "../components/Loader";
import { Firestore, runTransaction } from "firebase/firestore";
import firebase, { auth, firestore, storage } from "../firebase";
import * as SecureStore from "expo-secure-store";
import { ethers } from "ethers";
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
  const [balanceTotal, setBalanceTotal] = useState({
    btc: null,
    eth: null,
    wbtc: null,
    usdt: null,
  });
  const [walletsETH, setWalletsETH] = useState();
  const [mainWalletETH, setMainWalletETH] = useState();
  const [walletsBTC, setWalletsBTC] = useState();
  const [mainWalletBTC, setMainWalletBTC] = useState();
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
  const uploadWallet = async (wallet, name, type) => {
    try {
      await addNewWallet(wallet.address, name, type);
      const savedWallets = JSON.parse(
        await SecureStore.getItemAsync(`${type}Wallets`)
      );
      let newWallet = [
        {
          name: name,
          pub: wallet.address,
          m: wallet.imported ? "" : wallet.mnemonic,
          priv: wallet.privateKey,
          tipo: type,
        },
      ];
      if (savedWallets) newWallet = [...newWallet, ...savedWallets];
      await SecureStore.setItemAsync(
        `${type}Wallets`,
        JSON.stringify(newWallet)
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const addNewWallet = async (wallet, name, type) => {
    if (type === "eht" && !ethers.utils.isAddress(wallet))
      throw { message: "Wallet invalida" };
    if (walletsETH && walletsETH.length > 5)
      throw { message: "Ya tienes la cantidad maxima de wallets disponibles" };
    const matchName = await firebase
      .firestore()
      .collection("users")
      .doc(currentUser.user.uid)
      .collection(`${type}Wallets`)
      .where("name", "==", name)
      .get();
    const matchWallet = await firebase
      .firestore()
      .collection("users")
      .doc(currentUser.user.uid)
      .collection(`${type}Wallets`)
      .where("wallet", "==", wallet)
      .get();
    const matchMain = await firebase
      .firestore()
      .collection("users")
      .doc(currentUser.user.uid)
      .collection(`${type}Wallets`)
      .where("main", "==", true)
      .get();

    if (!matchName.empty) throw { message: "Nombre de Wallet ya existe" };
    if (!matchWallet.empty) throw { message: "Wallet ya existe" };
    await firebase
      .firestore()
      .collection("users")
      .doc(currentUser.user.uid)
      .collection(`${type}Wallets`)
      .doc(wallet)
      .set({
        name: name,
        wallet: wallet,
        main: matchMain.empty,
        tipo: type,
      })
      .then(() => {
        return true;
      })
      .catch((err) => {
        throw err;
      });
  };

  const deleteWallet = async (wallet, type) => {
    var walletDocRef = firebase
      .firestore()
      .collection("users")
      .doc(currentUser.user.uid)
      .collection(`${type}Wallets`)
      .doc(wallet);
    try {
      await walletDocRef.get().then(async (walletDoc) => {
        await walletDocRef.delete();
        const storedWalletData = await SecureStore.getItemAsync(
          `${type}Wallets`
        );
        if (storedWalletData) {
          const newStoredWallets = JSON.parse(storedWalletData).filter(
            (walletInstance) => {
              return walletInstance.pub != walletDoc.data().wallet;
            }
          );
          await SecureStore.setItemAsync(
            `${type}Wallets`,
            JSON.stringify(newStoredWallets)
          );
        }
        if (!walletDoc.data().main) return await updateProfile();
        await firebase
          .firestore()
          .collection("users")
          .doc(currentUser.user.uid)
          .collection(`${type}Wallets`)
          .where("main", "==", false)
          .limit(1)
          .get()
          .then(async (newMainWallet) => {
            if (newMainWallet.empty) return;
            await newMainWallet.forEach(async (mainWallet) => {
              await mainWallet.ref.update({ main: true });
              setUserMainWallet(mainWallet.data());
              await updateProfile();
            });
          });
      });
    } catch (err) {
      throw err;
    }
  };

  const getUserHistory = async (dash) => {
    const userHistoric = await firestore
      .collection("users")
      .doc(currentUser.user.uid)
      .collection("historic")
      .orderBy("date", "desc");
    let arr = [];
    if (dash) {
      const historicDoc = await userHistoric.limit(5).get();
      historicDoc.forEach((history) => {
        arr.push(history.data());
      });
    } else {
      const historicDoc = await userHistoric.get();
      historicDoc.forEach((history) => {
        arr.push(history.data());
      });
    }
    return arr;
  };

  const getUserWallets = async (type, user) => {
    const userWallets = await firestore
      .collection("users")
      .doc(user ? user.uid : currentUser.user.uid)
      .collection(`${type}Wallets`)
      .orderBy("main", "desc")
      .get();
    if (!userWallets.empty) {
      let arr = [];
      let main;
      await userWallets.forEach((doc) => {
        if (doc.data().main) main = doc.data();
        arr.push(doc.data());
      });
      if (!main) {
        await firebase
          .firestore()
          .collection("users")
          .doc(user ? user.uid : currentUser.user.uid)
          .collection(`${type}Wallets`)
          .doc(arr[0].wallet)
          .update({ main: true })
          .then((doc) => {
            main = { ...arr[0], main: true };
          });
      }
      if (type === "eth") {
        setMainWalletETH(main);
        setWalletsETH(arr);
        return;
      }
      setMainWalletBTC(main);
      setWalletsBTC(arr);
    }
  };

  const updateProfile = async (silent, user) => {
    if (!silent) setLoading(true);
    try {
      const userDoc = await firestore
        .collection("users")
        .doc(user ? user.uid : currentUser.user.uid)
        .get();
      setCurrentUser({
        user: user ? user : currentUser.user,
        ...userDoc.data(),
      });
      await getUserWallets("eth", user);
      await getUserWallets("btc", user);
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
  const updateUser = async (telefono, nombre, dia, mes, year) => {
    try {
      const userDocRef = await firestore
        .collection("users")
        .doc(currentUser.user.uid)
        .update({
          telefono,
          nombre,
          nacimiento: {
            d: dia,
            m: mes,
            a: year,
          },
        });
    } catch (err) {
      console.log(err);
      throw err;
    }
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
  const updateTermsAndConditionsAcceptance = async () => {
    await firestore
      .collection("users")
      .doc(currentUser.user.uid)
      .update({ terminosYCondiciones: true });
  };
  const savePin = async (pin) => {
    const userDoc = await firestore
      .collection("users")
      .doc(currentUser.user.uid)
      .update({ pin: pin });
    await updateProfile();
  };
  const logOut = async () => {
    setLoading(true);
    try {
      setLoading(true);
      await SecureStore.deleteItemAsync("USER_EMAIL", {});
      await SecureStore.deleteItemAsync("USER_PASS", {});
      await auth.signOut();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
      Alert.alert("Algo salio mal");
    }
  };
  const transfer = async (amount, token, type, nota) => {
    if (amount > balanceTotal[token]) throw { message: "Saldo insuficiente" };
    if (amount <= 0) throw { message: "Numero invalido" };
    try {
      await firestore
        .collection("users")
        .doc(currentUser.user.uid)
        .collection("historic")
        .add({
          tipo: type,
          token: token,
          cantidad: amount,
          date: firebase.firestore.Timestamp.now(),
          nota: nota ? nota : "",
        });
    } catch (err) {
      throw err;
    }
  };

  const setNewMainWallet = async (wallet, type) => {
    var walletDocRef = firebase
      .firestore()
      .collection("users")
      .doc(currentUser.user.uid)
      .collection(`${type}Wallets`)
      .doc(wallet);
    var oldMainWalletRef = firebase
      .firestore()
      .collection("users")
      .doc(currentUser.user.uid)
      .collection(`${type}Wallets`)
      .doc(type === "btc" ? mainWalletBTC.wallet : mainWalletETH.wallet);
    try {
      await runTransaction(firebase.firestore(), async (transaction) => {
        const newWalletDoc = await transaction.get(walletDocRef);
        transaction.update(walletDocRef, { main: true });
        transaction.update(oldMainWalletRef, { main: false });
        if (type === "eth") {
          setMainWalletETH(newWalletDoc.data());
        } else {
          setMainWalletBTC(newWalletDoc.data());
        }
      });
      await updateProfile(true);
    } catch (err) {
      console.log(err);
      Alert.alert(err.message);
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
      console.log(await SecureStore.getItemAsync("ethWallets"));
      console.log(await SecureStore.getItemAsync("btcWallets"));
      setLoading(true);
      if (user) {
        try {
          await updateProfile(false, user);
        } catch (err) {
          console.log(err);
          logOut();
          Alert.alert("Algo salio mal, intente nuevamente");
        }
        setLoading(false);
      } else {
        const storedUser = await SecureStore.getItemAsync("USER_EMAIL");
        if (storedUser) {
          await setStoredSession(storedUser);
        } else {
          setCurrentUser(user);
          setLoading(false);
        }
      }
    });
    return unsubscribe;
  }, []);
  const value = {
    signUp,
    savePin,
    currentUser,
    logIn,
    logOut,
    selectType,
    uploadPfp,
    updateProfile,
    uploadWallet,
    transfer,
    balance,
    walletsETH,
    setWalletsETH,
    mainWalletETH,
    setMainWalletETH,
    walletsBTC,
    setWalletsBTC,
    mainWalletBTC,
    setMainWalletBTC,
    setBalance,
    setNewMainWallet,
    setBalanceTotal,
    balanceTotal,
    deleteWallet,
    updateTermsAndConditionsAcceptance,
    getUserHistory,
    updateUser,
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

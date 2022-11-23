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
  const [wallets, setWallets] = useState();
  const [mainWallet, setMainWallet] = useState();
  const [historic, setHistoric] = useState();
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
  const createWallet = async (wallet, name) => {
    try {
      const savedWallets = JSON.parse(
        await SecureStore.getItemAsync("wallets")
      );
      let newWallet = [
        {
          name: name,
          pub: wallet.address,
          m: wallet.imported ? "" : wallet._mnemonic().phrase,
          priv: wallet.imported ? wallet.privKey : wallet._mnemonic().phrase,
        },
      ];
      if (savedWallets) newWallet = [...newWallet, ...savedWallets];
      await SecureStore.setItemAsync("wallets", JSON.stringify(newWallet));
      await addNewWallet(wallet.address, name);
      await updateProfile();
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const addNewWallet = async (wallet, name) => {
    if (!ethers.utils.isAddress(wallet)) throw { message: "Wallet invalida" };
    if (wallets && wallets.length > 5)
      throw { message: "Ya tienes la cantidad maxima de wallets disponibles" };
    const matchName = await firebase
      .firestore()
      .collection("users")
      .doc(currentUser.user.uid)
      .collection("wallets")
      .where("name", "==", name)
      .get();
    const matchWallet = await firebase
      .firestore()
      .collection("users")
      .doc(currentUser.user.uid)
      .collection("wallets")
      .where("wallet", "==", wallet)
      .get();
    const matchMain = await firebase
      .firestore()
      .collection("users")
      .doc(currentUser.user.uid)
      .collection("wallets")
      .where("main", "==", true)
      .get();

    if (!matchName.empty) throw { message: "Nombre de Wallet ya existe" };
    if (!matchWallet.empty) throw { message: "Wallet ya existe" };
    await firebase
      .firestore()
      .collection("users")
      .doc(currentUser.user.uid)
      .collection("wallets")
      .doc(wallet)
      .set({
        name: name,
        wallet: wallet,
        main: matchMain.empty,
      })
      .then(() => {
        return true;
      })
      .catch((err) => {
        throw err;
      });
  };

  const deleteWallet = async (wallet) => {
    var walletDocRef = firebase
      .firestore()
      .collection("users")
      .doc(currentUser.user.uid)
      .collection("wallets")
      .doc(wallet);
    try {
      await walletDocRef.get().then(async (wallet) => {
        console.log(wallet.data());
        await walletDocRef.delete();
        const storedWalletData = await SecureStore.getItemAsync("wallets");
        if (storedWalletData) {
          const newStoredWallets = JSON.parse(storedWalletData).filter(
            (wallet) => wallet.wallet != wallet.data().wallet
          );
          console.log(newStoredWallets);
          await SecureStore.setItemAsync(
            "wallets",
            JSON.stringify(newStoredWallets)
          );
        }
        console.log(wallet.data());
        if (!wallet.data().main) return updateProfile();
        await firebase
          .firestore()
          .collection("users")
          .doc(currentUser.uid)
          .collection("wallets")
          .where("main", "==", false)
          .limit(1)
          .get()
          .then(async (newMainWallet) => {
            if (newMainWallet.empty) return;
            await newMainWallet.forEach(async (mainWallet) => {
              await mainWallet.ref.update({ main: true });
              setUserMainWallet(mainWallet.data());
              updateProfile();
            });
          });
      });
    } catch (err) {
      throw err;
    }
  };

  const updateProfile = async (silent, user) => {
    if (!silent) setLoading(true);
    try {
      const userDoc = await firestore
        .collection("users")
        .doc(user ? user.uid : currentUser.user.uid)
        .get();
      const userWallets = await firestore
        .collection("users")
        .doc(user ? user.uid : currentUser.user.uid)
        .collection("wallets")
        .orderBy("main", "desc")
        .get();
      const userHistoric = await firestore
        .collection("users")
        .doc(user ? user.uid : currentUser.user.uid)
        .collection("historic")
        .orderBy("date", "desc")
        .get();
      if (!userHistoric.empty) {
        let historic = [];
        userHistoric.forEach((doc) => {
          historic.push(doc.data());
        });
        setHistoric(historic);
      }
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
            .collection("wallets")
            .doc(arr[0].wallet)
            .update({ main: true })
            .then((doc) => {
              main = { ...arr[0], main: true };
            });
        }
        setMainWallet(main);
        setWallets(arr);
      }
      setCurrentUser({
        user: user ? user : currentUser.user,
        ...userDoc.data(),
      });
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
  const savePin = async (pin) => {
    const userDoc = await firestore
      .collection("users")
      .doc(currentUser.user.uid)
      .update({ pin: pin });
    await updateProfile();
  };
  const logOut = async (goToStart) => {
    setLoading(true);
    await SecureStore.deleteItemAsync("USER_EMAIL", {});
    await SecureStore.deleteItemAsync("USER_PASS", {});
    await auth.signOut();
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
  const getWallet = async (wallet) => {
    return await (
      await firebase
        .firestore()
        .collection("users")
        .doc(currentUser.user.uid)
        .collection("wallets")
        .doc(wallet)
        .get()
    ).data();
  };

  const setNewMainWallet = async (wallet) => {
    var walletDocRef = firebase
      .firestore()
      .collection("users")
      .doc(currentUser.user.uid)
      .collection("wallets")
      .doc(wallet);
    var oldMainWalletRef = firebase
      .firestore()
      .collection("users")
      .doc(currentUser.user.uid)
      .collection("wallets")
      .doc(mainWallet.wallet);
    try {
      await runTransaction(firebase.firestore(), async (transaction) => {
        const newWalletDoc = await transaction.get(walletDocRef);
        transaction.update(walletDocRef, { main: true });
        transaction.update(oldMainWalletRef, { main: false });
        setMainWallet(newWalletDoc.data());
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
    createWallet,
    transfer,
    balance,
    wallets,
    mainWallet,
    setBalance,
    setNewMainWallet,
    setMainWallet,
    setBalanceTotal,
    balanceTotal,
    deleteWallet,
    setWallets,
    historic,
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

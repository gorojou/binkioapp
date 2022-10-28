import { useNavigation } from "@react-navigation/core";
import React, { useContext, useState, useEffect } from "react";
import { Alert, View } from "react-native";
import Loader from "../components/Loader";
import { auth, firestore, storage } from "../firebase";
const AuthContext = React.createContext();
export default function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children, navigation }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const logIn = async (email, password) => {
    try {
      const user = await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      if (err.code === "auth/wrong-password")
        throw { message: "Datos invalidos" };
      if (err.code === "auth/user-not-found")
        throw { message: "Usuario no existe" };
      throw err;
    }
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
    await auth.signOut();
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
          Alert("Algo salio mal");
        }
      } else {
        setCurrentUser(user);
        console.log(user);
      }
      setLoading(false);
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

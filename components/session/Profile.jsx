import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import RText from "../RText";
import Navbar from "./Navbar";
import useAuth from "../../context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import MainButton, { SecondaryButton } from "../buttons";
import firebase, { storage, firestore } from "../../firebase";
import Loader from "../Loader";
export default function Profile({ navigation }) {
  const { currentUser, uploadPfp, updateProfile } = useAuth();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { logOut } = useAuth();
  async function uploadImageAsync() {
    setLoading(true);
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
    });
    const uploadTask = await storage
      .ref(`/users/${currentUser.user.uid}/pfp/pfp${currentUser.user.uid}`)
      .put(blob);
    await firestore
      .collection("users")
      .doc(currentUser.user.uid)
      .update({ pfp: await uploadTask.ref.getDownloadURL() });
    setLoading(false);
    await updateProfile();
    blob.close();
  }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              image
                ? { uri: image }
                : currentUser.pfp
                ? { uri: currentUser.pfp }
                : require("../../assets/blankpfp.jpg")
            }
            style={styles.pfpImage}
          />
        </TouchableOpacity>
        {image && (
          <MainButton callback={uploadImageAsync}>
            Cargar imagen de perfil
          </MainButton>
        )}
      </View>
      <View style={styles.body}>
        <View style={styles.dataArea}>
          <RText style={styles.dataText}>Nombre:</RText>
          <RText style={styles.dataText} tipo={"bold"}>
            {currentUser.nombre}
          </RText>
        </View>
        <View style={styles.dataArea}>
          <RText style={styles.dataText}>Telefono:</RText>
          <RText style={styles.dataText} tipo={"bold"}>
            {currentUser.telefono}
          </RText>
        </View>
        <View style={styles.dataArea}>
          <RText style={styles.dataText}>Correo:</RText>
          <RText style={styles.dataText} tipo={"bold"}>
            {currentUser.user.email}
          </RText>
        </View>
        <View style={styles.dataArea}>
          <RText style={styles.dataText}>Fecha de nacimiento:</RText>
          <RText style={styles.dataText} tipo={"bold"}>
            {currentUser.nacimiento.d}/{currentUser.nacimiento.m}/
            {currentUser.nacimiento.a}
          </RText>
        </View>
        <SecondaryButton callback={logOut}>Cerrar sesión</SecondaryButton>
      </View>
      <Navbar navigation={navigation} />
      {loading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader size={100} />
        </View>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    fontSize: 30,
  },
  pfpImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
    marginBottom: 5,
  },
  body: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  dataArea: {
    width: "90%",
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  data: {
    fontSize: 20,
  },
  dataText: {
    fontSize: 20,
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
  nacimiento: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
});

import { View, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import RText from "../RText";
import Loader from "../Loader";
import MainButton, { SecondaryButton } from "../buttons";
import useAuth from "../../context/AuthContext";
import Selfie from "../../assets/svg/selfie.svg";
import Badge from "../../assets/svg/badge.svg";
import firebase, { storage, firestore } from "../../firebase";
import s from "../styles";
import Popup from "./Popup";
import * as ImagePicker from "expo-image-picker";
import LoaderProgress from "../LoaderProgress";
export default function KYC() {
  const [loading, setLoading] = useState(false);
  const { currentUser, uploadPfp, updateProfile } = useAuth();
  const [err, setErr] = useState("");
  const [images, setImages] = useState({ document: "", selfie: "" });
  const [show, setShow] = useState();
  const [progress, setProgress] = useState(0);
  const processImage = async (image) => {
    return await new Promise((resolve, reject) => {
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
  };
  const uploadImage = async (blob, type, last) => {
    const uploadTask = storage
      .ref(`/users/${currentUser.user.uid}/${type}/${currentUser.user.uid}`)
      .put(blob);
    uploadTask.on("state_changed", (task) => {
      setProgress(
        Math.round(
          last
            ? 50 + (task.bytesTransferred / task.totalBytes) * 50
            : (task.bytesTransferred / task.totalBytes) * 50
        )
      );
    });
    await uploadTask.then(async (doc) => {
      const update = {
        [type]: await doc.ref.getDownloadURL(),
      };
      if (last) update.verified = true;
      await firestore
        .collection("users")
        .doc(currentUser.user.uid)
        .update(update);
      blob.close();
    });
  };
  const sendImages = async () => {
    try {
      setLoading(true);
      const blobs = {
        document: await processImage(images.document),
        selfie: await processImage(images.selfie),
      };
      await uploadImage(blobs.document, "documentVerification");
      await uploadImage(blobs.selfie, "selfieVerification", true);
      await updateProfile();
    } catch (err) {
      console.log(err);
      setLoading(false);
      setErr("Algo salio mal, intente nuevamente");
    }
  };
  return (
    <>
      <View style={styles.formularioContainer}>
        <View style={styles.formulario}>
          <RText style={styles.formTitle} tipo={"bold"}>
            Ya casi
          </RText>
          {err && <RText style={s.errText}>{err}</RText>}
          <RText style={styles.instrucciones} tipo={"thin"}>
            Para continuar es necesario proveer una foto de un documento de
            identificacion y una foto de tu rostro en un fondo blanco
          </RText>
          <View style={styles.selectionView}>
            <TouchableOpacity
              style={
                images.document
                  ? styles.optionSelected
                  : styles.optionNotSelected
              }
              onPress={() => setShow("document")}
            >
              <Badge
                height={50}
                width={50}
                fill={images.document ? "green" : "black"}
              />
              <RText
                style={{
                  color: images.document ? "green" : "black",
                  textAlign: "center",
                }}
              >
                Documento identificativo
              </RText>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                images.selfie ? styles.optionSelected : styles.optionNotSelected
              }
              onPress={() => setShow("selfie")}
            >
              <Selfie
                height={50}
                width={50}
                fill={images.selfie ? "green" : "black"}
              />
              <RText style={{ color: images.selfie ? "green" : "black" }}>
                Selfie
              </RText>
            </TouchableOpacity>
          </View>
          {images.document && images.selfie && (
            <>
              <RText style={styles.instrucciones} tipo={"thin"}>
                Esto puede tardar unos minutos
              </RText>
              <MainButton width={0.9} callback={() => sendImages()}>
                Enviar
              </MainButton>
            </>
          )}
          {loading && <LoaderProgress progress={progress} />}
        </View>
      </View>
      {show && (
        <>
          {show === "document" && (
            <Document setShow={setShow} setImages={setImages} images={images} />
          )}
          {show === "selfie" && (
            <SelfieImage
              setShow={setShow}
              setImages={setImages}
              images={images}
            />
          )}
        </>
      )}
    </>
  );
}

const Document = ({ setShow, images, setImages }) => {
  const [loading, setLoading] = useState(false);
  const pickImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.granted === false)
      Alert.alert(
        "Acceso a libreria denegado, para continuar por favor acepta el acceso a la galeria"
      );

    console.log(permission);
    let result = await ImagePicker.launchCameraAsync({
      base64: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 2],
      quality: 1,
    });
    console.log(result);
    if (!result.cancelled) {
      console.log(result.uri);
      setImages({ ...images, document: result.uri });
    }
  };
  return (
    <Popup setShow={setShow} closingValue={""}>
      <View style={styles.popupElementsContianer}>
        <RText
          style={{ ...styles.formTitle, textAlign: "center" }}
          tipo={"bold"}
        >
          Documento de Identificacion
        </RText>
        <RText style={styles.instrucciones} tipo={"thin"}>
          Tomale una foto a tu documento de identificacion, puede ser una
          liscencia de conducir o un DNI, el documento debe ser legible en la
          foto
        </RText>
        {images?.document && (
          <Image
            source={{ uri: images.document }}
            style={{ borderRadius: 20, height: 100, width: 150 }}
          />
        )}
        {images.document && (
          <SecondaryButton width={0.8} callback={() => pickImage()}>
            Volver a Escoger
          </SecondaryButton>
        )}
        <MainButton
          width={0.8}
          callback={() => (images.document ? setShow("") : pickImage())}
        >
          {images.document ? "Aceptar" : "Tomar Foto"}
        </MainButton>
        {loading && <Loader size={100} />}
      </View>
    </Popup>
  );
};
const SelfieImage = ({ setShow, images, setImages }) => {
  const { currentUser, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.granted === false)
      Alert.alert(
        "Acceso a libreria denegado, para continuar por favor acepta el acceso a la galeria"
      );
    let result = await ImagePicker.launchCameraAsync({
      base64: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      setImages({ ...images, selfie: result.uri });
    }
  };
  return (
    <Popup setShow={setShow} closingValue={""}>
      <View style={styles.popupElementsContianer}>
        <RText
          style={{ ...styles.formTitle, textAlign: "center" }}
          tipo={"bold"}
        >
          Selfie
        </RText>
        <RText style={styles.instrucciones} tipo={"thin"}>
          Toma una foto de tu rostro en un fondo blanco para que podamos
          verificar tu identidad
        </RText>
        {images.selfie && (
          <Image
            source={{ uri: images.selfie }}
            style={{ borderRadius: 20, height: 150, width: 150 }}
          />
        )}
        {images.selfie && (
          <SecondaryButton width={0.8} callback={() => pickImage()}>
            Volver a tomar
          </SecondaryButton>
        )}
        <MainButton
          width={0.8}
          callback={() => (images.selfie ? setShow("") : pickImage())}
        >
          {images.selfie ? "Aceptar" : "Tomar Foto"}
        </MainButton>
        {loading && <Loader size={100} />}
      </View>
    </Popup>
  );
};
const styles = StyleSheet.create({
  formularioContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formulario: {
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
  },
  formTitle: {
    fontSize: 30,
  },
  selectionView: {
    flexDirection: "row",
    marginTop: 20,
  },
  optionSelected: {
    flex: 0.5,
    padding: 20,
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
    marginHorizontal: 10,
    shadowColor: "green",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  optionNotSelected: {
    flex: 0.5,
    padding: 20,
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    marginHorizontal: 10,
    elevation: 11,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
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

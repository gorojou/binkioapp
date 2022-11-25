import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import RText from "../../RText";
import MainButton, { SecondaryButton } from "../../buttons";
import Loader from "../../Loader";
import useAuth from "../../../context/AuthContext";
import s from "../../styles";
import { useLocalAuth } from "../../../context/LocalAuthentication";
export default function TestMnemonic({
  mnemonic,
  setdisplayTest,
  nombre,
  wallet,
}) {
  const [constructedPhrase, setConstructedPhrase] = useState([]);
  const { requireAuth } = useLocalAuth();
  const [randomPhrase, setRandomPhrase] = useState([]);
  const [correct, setCorrect] = useState(false);
  const [err, setErr] = useState();
  const [loading, setLoading] = useState(false);
  const { createWallet } = useAuth();
  useEffect(() => {
    setRandomPhrase(shuffle(mnemonic.split(" ")));
  }, []);
  useEffect(() => {
    if (constructedPhrase.join(" ") === mnemonic) {
      setCorrect(true);
    } else {
      setCorrect(false);
    }
  }, [constructedPhrase]);
  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }
  const saveWallet = async (wallet, name) => {
    setLoading(true);
    try {
      await createWallet(wallet, name);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setErr(err.message);
    }
  };
  return (
    <>
      <RText style={{ ...styles.formTitle, marginBottom: 20 }}>
        Ingresa las palabras en orden de tu frase secreta
      </RText>
      {err && (
        <RText style={{ ...s.errText, textAlign: "center" }}>{err}</RText>
      )}
      <Selected selected={constructedPhrase} />
      <View style={styles.wordContainer}>
        {randomPhrase.map((word, i) => {
          return (
            <Word
              key={i}
              word={word}
              setConstructedPhrase={setConstructedPhrase}
              constructedPhrase={constructedPhrase}
            />
          );
        })}
      </View>
      <SecondaryButton
        style={{ marginTop: 20 }}
        width={0.8}
        callback={() => setdisplayTest(false)}
      >
        Volver a ver la frase
      </SecondaryButton>
      {correct && (
        <MainButton
          style={{ marginTop: 20 }}
          width={0.8}
          callback={() => saveWallet(wallet, nombre)}
        >
          Guardar Wallet
        </MainButton>
      )}
      {loading && <Loader size={100} />}
    </>
  );
}
const Word = ({ word, setConstructedPhrase, constructedPhrase, key }) => {
  const [selected, setSelected] = useState(false);
  return (
    <TouchableOpacity
      key={key}
      onPress={() => {
        setSelected(!selected);
        if (!selected) {
          setConstructedPhrase((a) => [...a, word]);
        } else {
          let compare = constructedPhrase.filter((item) => item !== word);
          setConstructedPhrase(compare);
        }
      }}
      style={[styles.word, selected ? styles.selected : styles.notSelected]}
    >
      <RText style={{ color: selected ? "blue" : "white" }}>{word}</RText>
    </TouchableOpacity>
  );
};
const Selected = ({ selected }) => {
  return (
    <>
      <View style={styles.selectedContainer}>
        {selected.length ? (
          <>
            <RText>
              {selected.map((word) => {
                return `${word} `;
              })}
            </RText>
          </>
        ) : (
          <></>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  formTitle: {
    fontSize: 30,
    textAlign: "center",
  },
  selectedContainer: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#f3f3f3",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 200,
    marginBottom: 20,
  },
  wordContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  word: {
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    width: "29%",
  },
  selected: {
    backgroundColor: "white",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "blue",
  },
  notSelected: {
    backgroundColor: "blue",
  },
});

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import RText from "../../RText";
import MainButton, { SecondaryButton } from "../../buttons";
export default function TestMnemonic({ mnemonic, setDone, setdisplayTest }) {
  const [constructedPhrase, setConstructedPhrase] = useState([]);
  const [randomPhrase, setRandomPhrase] = useState([]);
  const [correct, setCorrect] = useState(false);
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
  return (
    <>
      <RText style={{ ...styles.formTitle, marginBottom: 20 }}>
        Ingresa las palabras en orden de tu frase secreta
      </RText>
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
      <SecondaryButton width={0.8} callback={() => setdisplayTest(false)}>
        Volver a ver la frase
      </SecondaryButton>
      {correct && (
        <MainButton width={0.8} callback={() => setDone(true)}>
          Guardar Wallet
        </MainButton>
      )}
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
    width: "90%",
    marginBottom: 20,
  },
  wordContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  word: {
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    margin: 5,
    borderRadius: 10,
    width: "25%",
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

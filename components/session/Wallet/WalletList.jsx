import { View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import RText from "../../RText";
import useAuth from "../../../context/AuthContext";
import { SecondaryButton } from "../../buttons";
import Star from "../../../assets/svg/star.svg";
import Eye from "../../../assets/svg/eye.svg";
import Delete from "../../../assets/svg/delete.svg";
import SelectToken from "../SelectToken";
import CreateWallet from "./CreateWallet";
import Loader from "../../Loader";
import { useBlockChainContext } from "../../../context/BlockchainContext";
import { usePopup } from "../../../context/Popup";
import CurrentTokenSvg from "../CurrentTokenSvg";
import MainButton from "../../buttons";
import s from "../../styles";
import { useLocalAuth } from "../../../context/LocalAuthentication";
export default function WalletList({ setShowWallet, walletSection }) {
  const { walletsETH, walletsBTC, setNewMainWallet, deleteWallet } = useAuth();
  const { token } = useBlockChainContext();
  const [loading, setLoading] = useState(false);
  const { setShow, setComponent, setClosingValue } = usePopup();
  return (
    <>
      <View
        style={{
          justifyContent: "center",
          width: "100%",
          alignItems: "center",
          postion: "relative",
        }}
      >
        <View style={{ width: "90%", marginTop: 10 }}>
          <SelectToken />
        </View>
        <SecondaryButton
          style={{ marginTop: 20 }}
          callback={() => {
            setShow(true);
            setComponent(<CreateWallet confirmWallet={false} />);
          }}
          width={0.9}
        >
          Agregar Nueva Wallet
        </SecondaryButton>
        <View style={styles.list}>
          {token !== "btc" ? (
            <>
              {walletsETH.map((wallet, i) => {
                return (
                  <Wallet
                    wallet={wallet}
                    i={i}
                    key={i}
                    walletSection={walletSection}
                    setShowWallet={setShowWallet}
                    setLoading={setLoading}
                  />
                );
              })}
            </>
          ) : (
            <>
              {walletsBTC.map((wallet, i) => {
                return (
                  <Wallet
                    wallet={wallet}
                    i={i}
                    key={i}
                    walletSection={walletSection}
                    setShowWallet={setShowWallet}
                    setLoading={setLoading}
                  />
                );
              })}
            </>
          )}
          {loading && <Loader size={100} />}
        </View>
      </View>
    </>
  );
}
const Wallet = ({ wallet, i, walletSection, setShowWallet, setLoading }) => {
  const { token } = useBlockChainContext();
  const { setShow, setComponent, setClosingValue } = usePopup();
  const { setNewMainWallet } = useAuth();
  const changeMainWallet = async (wallet) => {
    if (wallet.main) return;
    setLoading(true);
    await setNewMainWallet(wallet.wallet, wallet.tipo);
    setLoading(false);
  };
  const ereaseWallet = async (wallet) => {
    setShow(true);
    setComponent(<DeleteWallet wallet={wallet} />);
  };
  return (
    <View
      key={wallet.wallet}
      style={[
        styles.wallet,
        { backgroundColor: i % 2 != 0 ? "white" : "#f3f3f3" },
      ]}
    >
      <View style={{ justifyContent: "center", alignContent: "center" }}>
        <RText style={styles.walletText}>{wallet.name}</RText>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <RText style={styles.walletText} tipo={"thin"}>
            {wallet.balance ? (
              <>
                {wallet.balance[token] === 0 ? (
                  "0.00"
                ) : (
                  <>
                    {parseFloat(wallet.balance[token]).toFixed(
                      Math.max(
                        2,
                        (wallet.balance[token].toString().split(".")[1] || [])
                          .length
                      )
                    )}{" "}
                  </>
                )}
              </>
            ) : (
              "Cargando"
            )}{" "}
          </RText>
          <CurrentTokenSvg width={15} height={15} />
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        {walletSection && (
          <>
            <TouchableOpacity
              style={styles.walletOption}
              onPress={() => ereaseWallet(wallet)}
            >
              <Delete fill={"grey"} width={25} height={25} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.walletOption}
              onPress={() => setShowWallet(wallet)}
            >
              <Eye fill={"grey"} width={25} height={25} />
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          style={styles.walletOption}
          onPress={() => changeMainWallet(wallet)}
        >
          <Star
            fill={wallet.main ? "#5d22fa" : "grey"}
            width={25}
            height={25}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const DeleteWallet = ({ wallet }) => {
  const { deleteWallet, updateProfile } = useAuth();
  const [nombre, setNombre] = useState();
  const { requireAuth } = useLocalAuth();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState();
  const ereaseWallet = async () => {
    setLoading(true);
    try {
      if (!(await requireAuth())) return;
      await deleteWallet(wallet.wallet, wallet.tipo);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setErr("Algo salio mal");
    }
  };
  return (
    <>
      <View style={styles.deleteWalletConfirmation}>
        <RText style={styles.title}>
          Seguro que quiere borrar la wallet {wallet.name}?
        </RText>
        <RText tipo={"thin"} style={{ textAlign: "center" }}>
          Coloca el nombre de tu wallet "{wallet.name}" para confirmar la
          operacion
        </RText>
        {err && <RText style={s.errText}>{err}</RText>}
        <RText style={styles}></RText>
        <View style={s.intputContainer}>
          <TextInput
            style={s.input}
            placeholder="Nombre"
            value={nombre}
            onChangeText={(value) => setNombre(value)}
          />
        </View>
        <MainButton
          width={1}
          blocked={!(nombre === wallet.name)}
          callback={() => ereaseWallet()}
        >
          Borrar
        </MainButton>
      </View>
      {loading && <Loader size={100} />}
    </>
  );
};
const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontSize: 30,
  },
  list: {
    width: "90%",
    borderStyle: "solid",
    position: "relative",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 20,
    marginVertical: 20,
    overflow: "scroll",
  },
  wallet: {
    padding: 15,
    backgroundColor: "#f3f3f3",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  walletText: {
    fontSize: 18,
  },
  walletOption: {
    marginHorizontal: 5,
    position: "relative",
  },
  deleteWalletConfirmation: {
    justifyContent: "center",
    alignItems: "center",
  },
});

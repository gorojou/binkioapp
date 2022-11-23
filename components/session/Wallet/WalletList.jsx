import { View, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import RText from "../../RText";
import useAuth from "../../../context/AuthContext";
import MainWalletButton, { SecondaryButton } from "../../buttons";
import Star from "../../../assets/svg/star.svg";
import Eye from "../../../assets/svg/eye.svg";
import Delete from "../../../assets/svg/delete.svg";
import SelectToken from "../SelectToken";
import OnRegister from "./OnRegister";
import Loader from "../../Loader";
import { useBlockChainContext } from "../../../context/BlockchainContext";
import { usePopup } from "../../../context/Popup";
import CurrentTokenSvg from "../CurrentTokenSvg";
export default function WalletList({ setShowWallet, walletSection }) {
  const { wallets, setNewMainWallet, deleteWallet } = useAuth();
  const { token } = useBlockChainContext();
  const [createWallet, setCreateWallet] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setShow, setComponent, setClosingValue } = usePopup();
  const changeMainWallet = async (wallet) => {
    if (wallet.main) return;
    setLoading(true);
    await setNewMainWallet(wallet.wallet);
    setLoading(false);
  };
  const ereaseWallet = async (wallet) => {
    setLoading(true);
    await deleteWallet(wallet);
    setLoading(false);
  };
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
            setComponent(<OnRegister confirmWallet={true} />);
          }}
          width={0.9}
        >
          Agregar Nueva Wallet
        </SecondaryButton>
        <View style={styles.list}>
          {wallets.map((wallet, i) => {
            return (
              <View
                key={wallet.wallet}
                style={[
                  styles.wallet,
                  { backgroundColor: i % 2 != 0 ? "white" : "#f3f3f3" },
                ]}
              >
                <View
                  style={{ justifyContent: "center", alignContent: "center" }}
                >
                  <RText style={styles.walletText}>{wallet.name}</RText>
                  <RText style={styles.walletText} tipo={"thin"}>
                    {wallet.balance ? (
                      <>
                        {parseFloat(wallet.balance[token]).toFixed(
                          Math.max(
                            2,
                            (
                              wallet.balance[token].toString().split(".")[1] ||
                              []
                            ).length
                          )
                        )}{" "}
                        <CurrentTokenSvg width={15} height={15} />
                      </>
                    ) : (
                      "Cargando"
                    )}
                  </RText>
                </View>
                <View style={{ flexDirection: "row" }}>
                  {walletSection && (
                    <>
                      <TouchableOpacity
                        onPress={() => ereaseWallet(wallet.wallet)}
                      >
                        <Delete fill={"grey"} width={25} height={25} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setShowWallet(wallet)}>
                        <Eye fill={"grey"} width={25} height={25} />
                      </TouchableOpacity>
                    </>
                  )}
                  <TouchableOpacity onPress={() => changeMainWallet(wallet)}>
                    <Star
                      fill={wallet.main ? "#5d22fa" : "grey"}
                      width={25}
                      height={25}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
          {loading && <Loader size={100} />}
        </View>
      </View>
    </>
  );
}
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
});

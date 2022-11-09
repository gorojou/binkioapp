import React, { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import useAuth from "./AuthContext";
const BCContext = React.createContext();
export function useBlockChainContext() {
  return useContext(BCContext);
}
function BlockchainContext({ children }) {
  const { currentUser } = useAuth();
  const [balance, setBalance] = useState({
    btc: "0.0",
    eth: "0.0",
    wbtc: "0.0",
    usdt: "0.0",
  });

  const checkBalance = async () => {
    if (!userMainWallet) return setBalance("No Wallet");
    setBalance("Cargando");
    // const provider = new ethers.providers.JsonRpcProvider(LatamRPC);
    // const userBalance = await provider.getBalance(userMainWallet.wallet);
    // setBalance(
    //   `${parseFloat(ethers.utils.formatEther(userBalance)).toFixed(2)}$`
    // );
  };

  const createRandomWallet = async () => {
    return await ethers.Wallet.createRandom();
  };
  return (
    <BCContext.Provider value={{ createRandomWallet }}>
      {children}
    </BCContext.Provider>
  );
}

export default BlockchainContext;

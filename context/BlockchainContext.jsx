import React, { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import useAuth from "./AuthContext";
import wbtcAbi from "../utils/wbtcAbi.json";
const BCContext = React.createContext();
export function useBlockChainContext() {
  return useContext(BCContext);
}
function BlockchainContext({ children }) {
  const { currentUser, balance, setBalance } = useAuth();
  const tokenObject = {
    eth: {
      type: "eth",
      token: "main",
    },
    btc: {
      type: "btc",
      token: "main",
    },
    wbtc: {
      type: "eth",
      token: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    },
  };
  const [provider, setProvider] = useState();
  const urlProvider =
    "https://mainnet.infura.io/v3/04bfa7d48b3e4d0e87bf5c8c7e15b4c3";
  const [token, setToken] = useState("btc");

  const checkContractBalance = async (contract) => {
    return parseFloat(
      ethers.utils.formatEther(await contract.balanceOf(currentUser.wallet))
    ).toFixed(2);
  };

  const createContractInstance = async (tokenAddress, tokenAbi) => {
    return await new ethers.Contract(tokenAddress, tokenAbi, provider);
  };

  const checkBalance = async () => {
    if (!provider || token === "btc" || token === "usdt") return;
    setBalance({ ...balance, [token]: "Cargando" });
    if (token === "eth")
      setBalance({
        ...balance,
        eth: parseFloat(
          ethers.utils.formatEther(
            await provider.getBalance(currentUser.wallet)
          )
        ).toFixed(2),
      });
    if (token === "wbtc") {
      const contract = await createContractInstance(
        tokenObject[token].token,
        wbtcAbi
      );
      const contractBalance = await checkContractBalance(contract);
      setBalance({ ...balance, wbtc: await contractBalance });
    }
  };

  const createRandomWallet = async () => {
    return await ethers.Wallet.createRandom();
  };

  useEffect(() => {
    if (currentUser && balance[token] === null) {
      checkBalance();
    }
  }, [token]);

  useEffect(() => {
    const app = async () => {
      if (!provider) {
        const prov = await new ethers.providers.JsonRpcProvider(urlProvider);
        setProvider(prov);
      }
    };
    app();
  }, []);

  return (
    <BCContext.Provider value={{ createRandomWallet, token, setToken }}>
      {children}
    </BCContext.Provider>
  );
}

export default BlockchainContext;

import React, { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import useAuth from "./AuthContext";
import wbtcAbi from "../utils/wbtcAbi.json";
const BCContext = React.createContext();
export function useBlockChainContext() {
  return useContext(BCContext);
}
function BlockchainContext({ children }) {
  const {
    currentUser,
    balance,
    setBalance,
    mainWallet,
    wallets,
    setBalanceTotal,
    balanceTotal,
  } = useAuth();
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
  const urlProvider = "https://data-seed-prebsc-1-s1.binance.org:8545";
  const [token, setToken] = useState("eth");

  const checkContractBalance = async (contract, wallet) => {
    return parseFloat(
      ethers.utils.formatEther(await contract.balanceOf(wallet))
    ).toFixed(2);
  };

  const createContractInstance = async (tokenAddress, tokenAbi) => {
    return await new ethers.Contract(tokenAddress, tokenAbi, provider);
  };

  const checkBalance = async (wallet, returns) => {
    setBalance({ ...balance, [token]: "Cargando" });
    if (returns) setBalanceTotal({ ...balanceTotal, [token]: "Cargando" });
    if (token === "eth") {
      const res = parseFloat(
        ethers.utils.formatEther(await provider.getBalance(wallet))
      ).toFixed(2);
      if (returns) return await res;
      setBalance({
        ...balance,
        eth: res,
      });
    }
    if (token === "wbtc") {
      const contract = await createContractInstance(
        tokenObject[token].token,
        wbtcAbi
      );
      const contractBalance = await checkContractBalance(contract, wallet);
      if (returns) return await contractBalance;
      setBalance({ ...balance, wbtc: await contractBalance });
    }
  };

  const createRandomWallet = async () => {
    return await ethers.Wallet.createRandom();
  };

  const addBalances = async () => {
    let res = 0;
    await Promise.all(
      wallets.map(async (wallet) => {
        const balanceNum = await checkBalance(wallet.wallet, true);
        res = parseFloat(res) + parseFloat(balanceNum);
        console.log(balanceNum);
      })
    );
    return res.toFixed(2);
  };

  useEffect(() => {
    const app = async () => {
      if (!provider || token === "btc" || token === "usdt" || token === "wbtc")
        return;
      if (currentUser && balance[token] === null) {
        checkBalance(mainWallet.wallet);
        // console.log(await addBalances());
        setBalanceTotal({
          ...balanceTotal,
          [token]: await addBalances(),
        });
      }
    };
    app();
  }, [token, provider]);
  useEffect(() => {
    const app = async () => {
      if (
        !provider ||
        token === "btc" ||
        token === "usdt" ||
        token === "wbtc"
      ) {
        return;
      }
      await checkBalance(mainWallet.wallet);
    };
    app();
  }, [mainWallet]);
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

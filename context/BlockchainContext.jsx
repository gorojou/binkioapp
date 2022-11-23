import React, { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import useAuth from "./AuthContext";
import wbtcAbi from "../utils/wbtcAbi.json";
import usdtAbi from "../utils/usdtAbi.json";
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
    setMainWallet,
    wallets,
    setBalanceTotal,
    balanceTotal,
    setWallets,
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
      token: "0x6ce8dA28E2f864420840cF74474eFf5fD80E65B8",
      abi: wbtcAbi,
    },
    usdt: {
      type: "eth",
      token: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
      abi: usdtAbi,
    },
  };
  const [provider, setProvider] = useState();
  const urlProvider = "https://data-seed-prebsc-1-s1.binance.org:8545";
  const [token, setToken] = useState("eth");

  const checkContractBalance = async (contract, wallet) => {
    return parseFloat(
      ethers.utils.formatEther(await contract.balanceOf(wallet))
    );
  };

  const createContractInstance = async (tokenAddress, tokenAbi) => {
    return await new ethers.Contract(tokenAddress, tokenAbi, provider);
  };

  const checkBalance = async (wallet, returns) => {
    let balances = {};
    await Promise.all(
      Object.keys(balanceTotal).map(async (key) => {
        if (key === "btc") {
          balances = { ...balances, [key]: parseFloat(0) };
        } else if (key === "eth") {
          const res = parseFloat(
            ethers.utils.formatEther(await provider.getBalance(wallet))
          );
          balances = { ...balances, [key]: await res };
        } else {
          const contract = await createContractInstance(
            tokenObject[key].token,
            tokenObject[key].abi
          );
          const contractBalance = await checkContractBalance(contract, wallet);
          balances = { ...balances, [key]: await contractBalance };
        }
      })
    );

    return balances;
  };

  const createRandomWallet = async () => {
    return await ethers.Wallet.createRandom();
  };

  useEffect(() => {
    const app = async () => {
      if (!provider || !wallets || !mainWallet) return;
      if (wallets[0].balance) return;
      let updatedWallets = [];
      let total = { btc: 0, eth: 0, wbtc: 0, usdt: 0 };
      await Promise.all(
        wallets.map(async (wallet) => {
          const walletBalance = await checkBalance(wallet.wallet);
          Object.keys(walletBalance).map((key) => {
            total = {
              ...total,
              [key]: parseFloat(total[key]) + parseFloat(walletBalance[key]),
            };
          });
          if (wallet.main) {
            setMainWallet({ ...mainWallet, balance: await walletBalance });
          }
          updatedWallets.push({
            ...wallet,
            balance: await walletBalance,
          });
        })
      );
      setBalanceTotal(total);
      setWallets(await updatedWallets);
    };
    app();
  }, [provider, wallets]);
  // const addBalances = async () => {
  //   let res = 0;
  //   await Promise.all(
  //     wallets.map(async (wallet) => {
  //       const balanceNum = await checkBalance(wallet.wallet, null, true);
  //       res = parseFloat(res) + parseFloat(balanceNum);
  //       console.log(balanceNum);
  //     })
  //   );
  //   return res ;
  // };
  // useEffect(() => {
  //   const app = async () => {
  //     if (!provider || token === "btc") return;
  //     if (
  //       (currentUser && balance[token] === null) ||
  //       balance[token] === "Cargando"
  //     ) {
  //       setBalanceTotal({
  //         ...balanceTotal,
  //         [token]: await addBalances(),
  //       });
  //     }
  //   };
  //   app();
  // }, [token, provider]);
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

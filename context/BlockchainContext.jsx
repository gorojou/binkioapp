import React, { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import useAuth from "./AuthContext";
import wbtcAbi from "../utils/wbtcAbi.json";
import usdtAbi from "../utils/usdtAbi.json";
import * as Bip32 from "bip32";
import * as Bip39 from "bip39";
import * as Random from "expo-random";
import { bitcoin } from "bitcoinjs-lib/src/networks";
import * as bitcoinjs from "bitcoinjs-lib";
import { p2pkh } from "bitcoinjs-lib/src/payments";
import axios from "axios";
const BCContext = React.createContext();
export function useBlockChainContext() {
  return useContext(BCContext);
}
function BlockchainContext({ children }) {
  const {
    mainWalletETH,
    setMainWalletETH,
    setWalletsETH,
    walletsETH,
    mainWalletBTC,
    setWalletsBTC,
    setMainWalletBTC,
    walletsBTC,
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

  const createContractInstance = async (tokenAddress, tokenAbi) => {
    return await new ethers.Contract(tokenAddress, tokenAbi, provider);
  };

  const createRandomWalletBtc = async () => {
    const phrase = await Bip39.generateMnemonic(128, Random.getRandomBytes);
    return await getBTCWalletFromMnemonic(await phrase);
  };

  const getBTCWalletFromMnemonic = async (mnemonic) => {
    const seed = await Bip39.mnemonicToSeed(mnemonic);
    const root = await Bip32.fromSeed(seed);
    const account = await root.derivePath(`m/44'/0'/0'/0`);
    let node = await account.derive(0).derive(0);
    let btcAddress = await p2pkh({
      pubkey: await node.publicKey,
      network: await bitcoin,
    }).address;
    console.log({
      mnemonic: mnemonic,
      address: btcAddress,
      privateKey: node.toWIF(),
    });
    console.log(Bip32.from);
    return {
      mnemonic: mnemonic,
      address: btcAddress,
      privateKey: node.toWIF(),
    };
  };

  const createRandomWalletEth = async () => {
    const wallet = await ethers.Wallet.createRandom();
    console.log(wallet._mnemonic().phrase);
    return {
      mnemonic: wallet._mnemonic().phrase,
      address: wallet.address,
      privateKey: wallet._signingKey().privateKey,
    };
  };

  const checkContractBalance = async (contract, wallet) => {
    return parseFloat(
      ethers.utils.formatEther(await contract.balanceOf(wallet))
    );
  };
  const checkBalance = async (wallet, type) => {
    let balances = {};
    if (type === "btc") {
      return {
        btc: await (
          await axios.get(`https://blockchain.info/q/addressbalance/${wallet}`)
        ).data,
      };
    }
    await Promise.all(
      Object.keys(balanceTotal).map(async (key) => {
        if (key === "btc") return;
        if (key === "eth") {
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

  const getWalletBalance = async (wallets, type) => {
    let updatedWallets = [];
    let total = type === "btc" ? { btc: 0 } : { eth: 0, wbtc: 0, usdt: 0 };
    await Promise.all(
      wallets.map(async (wallet) => {
        const walletBalance = await checkBalance(wallet.wallet, type);
        Object.keys(walletBalance).map((key) => {
          total = {
            ...total,
            [key]: parseFloat(total[key]) + parseFloat(walletBalance[key]),
          };
        });
        if (wallet.main) {
          if (type === "eth") {
            setMainWalletETH({
              ...mainWalletETH,
              balance: await walletBalance,
            });
          } else {
            setMainWalletBTC({
              ...mainWalletBTC,
              balance: await walletBalance,
            });
          }
        }
        updatedWallets.push({
          ...wallet,
          balance: await walletBalance,
        });
      })
    );
    return [total, await updatedWallets];
  };

  useEffect(() => {
    const app = async () => {
      if (
        !provider ||
        !walletsETH ||
        !mainWalletETH ||
        !walletsBTC ||
        !mainWalletBTC
      )
        return;
      console.log(walletsETH[0].balance);
      if (walletsETH[0].balance && walletsBTC[0].balance) return;
      const [totalETH, updatedWalletsETH] = await getWalletBalance(
        walletsETH,
        "eth"
      );
      const [totalBTC, updatedWalletsBTC] = await getWalletBalance(
        walletsBTC,
        "btc"
      );
      setBalanceTotal((prev) => {
        return { ...prev, ...totalETH, ...totalBTC };
      });
      setWalletsETH(await updatedWalletsETH);
      setWalletsBTC(await updatedWalletsBTC);
    };
    app();
  }, [provider, walletsBTC, walletsETH]);

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
    <BCContext.Provider
      value={{
        createRandomWalletEth,
        token,
        setToken,
        createRandomWalletBtc,
        getBTCWalletFromMnemonic,
      }}
    >
      {children}
    </BCContext.Provider>
  );
}

export default BlockchainContext;

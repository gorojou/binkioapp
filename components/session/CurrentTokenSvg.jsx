import React from "react";
import Bitcoin from "../../assets/svg/btc.svg";
import Ethereum from "../../assets/svg/eth.svg";
import WBTC from "../../assets/svg/wbtc.svg";
import USDT from "../../assets/svg/usdt.svg";
import { useBlockChainContext } from "../../context/BlockchainContext";
export default function CurrentTokenSvg({ width, height }) {
  const { token } = useBlockChainContext();
  const findSvg = () => {
    switch (token) {
      case "eth":
        return <Ethereum width={width} height={height} />;
      case "btc":
        return <Bitcoin width={width} height={height} />;
      case "usdt":
        return <USDT width={width} height={height} />;
      case "wbtc":
        return <WBTC width={width} height={height} />;
    }
  };
  return <>{findSvg()}</>;
}

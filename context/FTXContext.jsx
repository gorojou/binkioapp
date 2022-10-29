import { View, Text } from "react-native";
import React, { useContext } from "react";
import axios from "axios";
import { hmacSHA256 } from "react-native-hmac";
const FTXContext = React.createContext();
export function useFTX() {
  return useContext(FTXContext);
}

export default function FTXProvider({ children }) {
  const url = "https://ftx.us/api/";
  const headers = {
    "FTX-KEY": "9CEj8l2TOb6CwE6qdOaS5MGSVEqmhmdUpdSc9i_x",
    "FTX-TS": new Date().getMilliseconds(),
    "FTX-SIGN": hmacSHA256(
      `${new Date().getMilliseconds()}GET/account`,
      "hdiWFYOJLIpXyaVt_yqExHuNTSNoqwkWu4-o5zrA"
    ),
  };
  const getMarkets = async () => {
    const response = await axios.get(url + "markets", {
      headers: headers,
    });
    return response.data;
  };
  const getHistory = async (market, depth) => {
    const response = await axios.get(
      url + `markets/${market}/orderBook?depth=${depth}`,
      { headers: headers }
    );
    return response.data;
  };
  const getOrderBooks = async (market) => {
    const response = await axios.get(url + `markets/${market}/trades`, {
      headers: headers,
    });
    return response.data;
  };
  return (
    <>
      <FTXContext.Provider value={{ getMarkets, getHistory, getOrderBooks }}>
        {children}
      </FTXContext.Provider>
    </>
  );
}

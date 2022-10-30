import { View, Text } from "react-native";
import React, { useContext } from "react";
import axios from "axios";
const FTXContext = React.createContext();
export function useFTX() {
  return useContext(FTXContext);
}

export default function FTXProvider({ children }) {
  const url = "https://ftx.us/api/";
  const getMarkets = async () => {
    const response = await axios.get(url + "markets", {});
    return response.data;
  };
  const getHistory = async (market, depth) => {
    const response = await axios.get(
      url + `markets/${market}/orderBook?depth=${depth}`
    );
    return response.data;
  };
  const getOrderBooks = async (market) => {
    const response = await axios.get(url + `markets/${market}/trades`);
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

import { View, Text } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
const FTXContext = React.createContext();
export function useFTX() {
  return useContext(FTXContext);
}

export default function FTXProvider({ children }) {
  const url = "https://ftx.us/api/";
  const [connected, setConnected] = useState(false);
  const getMarkets = async () => {
    const response = await axios.get(url + "markets", {});
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
  useEffect(() => {
    const app = async () => {
      try {
        await getMarkets();
        setConnected(true);
      } catch (err) {
        console.log(err);
      }
    };
    return app;
  }, []);

  return (
    <>
      <FTXContext.Provider
        value={{ connected, getMarkets, getHistory, getOrderBooks }}
      >
        {children}
      </FTXContext.Provider>
    </>
  );
}

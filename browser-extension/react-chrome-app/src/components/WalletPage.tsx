import { CircularProgress, Typography } from "@material-ui/core";
import { FC, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

import { Producer, Wallet } from "../types";
import client from "../api/client";
import { truncate_address, wei_to_eth } from "../utils";

const WalletPage: FC = () => {
  const [address, setAddress] = useState<string>("");
  const [wallet, setWallet] = useState<Wallet>();

  const loadAddress = async () => {
    try {
      const producer: Producer = await client.getProducer();
      setAddress(producer.eth_address);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        alert(`${axiosError.status}:  ${axiosError.message}`);
      } else {
        alert(`Error ${error}`);
      }
    }
  };

  const loadWallet = async () => {
    try {
      const wallet: Wallet = await client.getWallet();
      console.log(wallet.balance);
      setWallet(wallet);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        alert(`${axiosError.status}:  ${axiosError.message}`);
      } else {
        alert(`Error ${error}`);
      }
    }
  };

  useEffect(() => {
    loadAddress();

    const interval = setInterval(() => {
      loadWallet();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography align="left" variant="h4">
        Wallet
      </Typography>
      {wallet === undefined ? (
        <CircularProgress />
      ) : (
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <Typography variant="h5">Address:</Typography>
          <Typography variant="body1">{truncate_address(address)}</Typography>
          <Typography variant="h5">Current balance:</Typography>
          <Typography variant="body1">
            {wei_to_eth(wallet.balance)} ETH
          </Typography>
        </div>
      )}
      <div />
    </div>
  );
};

export default WalletPage;

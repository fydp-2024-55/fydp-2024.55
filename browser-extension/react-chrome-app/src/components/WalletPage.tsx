import { CircularProgress, Typography } from "@material-ui/core";
import { FC, useEffect, useState } from "react";
import { Wallet } from "../types";
import client from "../api/client";
import axios, { AxiosError } from "axios";

const WalletPage: FC = () => {
  const [wallet, setWallet] = useState<Wallet>();

  const loadWallet = async () => {
    try {
      const wallet: Wallet = await client.getWallet();
      console.log(wallet);
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

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     loadWallet();
  //   }, 600000); // 10 minutes

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  useEffect(() => {
    loadWallet();
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
          <Typography variant="body1">0x123...4567</Typography>
          <Typography variant="h5">Current balance:</Typography>
          <Typography variant="body1">{wallet.balance} ETH</Typography>
        </div>
      )}
      <div />
    </div>
  );
};

export default WalletPage;

import { CircularProgress, Typography } from "@material-ui/core";
import { FC, useContext, useEffect, useState } from "react";
import { Wallet } from "../types";
import apiClient from "../services/api-client";
import AppContext from "./AppContext";

const WalletPage: FC = () => {
  const { setAuthState } = useContext(AppContext)!;

  const [wallet, setWallet] = useState<Wallet>();

  const loadWallet = async () => {
    try {
      const wallet = await apiClient.getWallet();
      setWallet(wallet);
    } catch (error) {
      apiClient.handleError(error, setAuthState);
    }
  };

  useEffect(() => {
    loadWallet();
    const interval = setInterval(() => {
      loadWallet();
    }, 10 * 60 * 1000); // 10 minutes

    return () => {
      clearInterval(interval);
    };
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
          <Typography variant="body1">{wallet.ethAddress}</Typography>
          <Typography variant="h5">Current balance:</Typography>
          <Typography variant="h3">{wallet.balance} ETH</Typography>
        </div>
      )}
      <div />
    </div>
  );
};

export default WalletPage;

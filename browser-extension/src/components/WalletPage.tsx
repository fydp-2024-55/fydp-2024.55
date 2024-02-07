import { CircularProgress, Typography } from "@material-ui/core";
import { FC, useEffect, useState } from "react";
import { Wallet } from "../types";

const WalletPage: FC = () => {
  const [wallet, setWallet] = useState<Wallet>();

  const loadWallet = async () => {
    // Todo: Replace timeout with api call
    setTimeout(
      () =>
        setWallet({
          eth_address: "0x123...4567",
          balance: 200,
        }),
      1000
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      loadWallet();
    }, 600000); // 10 minutes

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
          <Typography variant="body1">0x123...4567</Typography>
          <Typography variant="h5">Current balance:</Typography>
          <Typography variant="h3">{wallet.balance} ETH</Typography>
        </div>
      )}
      <div />
    </div>
  );
};

export default WalletPage;

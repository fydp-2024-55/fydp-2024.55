import {
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@material-ui/core";
import { FC, useContext, useEffect, useState } from "react";
import EthereumLogo from "../../images/ethereum-logo.png";
import backendService from "../../services/backend-service";
import { Wallet } from "../../types";
import AppContext from "../contexts/AppContext";

const WalletScreen: FC = () => {
  const { setAuthState } = useContext(AppContext)!;

  const [wallet, setWallet] = useState<Wallet>();
  const [privateKey, setPrivateKey] = useState("*".repeat(64));

  const load = async () => {
    try {
      const wallet = await backendService.getWallet();
      setWallet(wallet);
    } catch (error) {
      backendService.handleError(error, setAuthState);
    }
  };

  const undo = async () => {
    await load();
  };

  const save = async () => {
    try {
      if (wallet) {
        const fetchedWallet = await backendService.updateWallet(
          wallet.ethAddress,
          privateKey
        );
        setWallet(fetchedWallet);
        alert("Saved");
      }
    } catch (error) {
      backendService.handleError(error, setAuthState);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 10 * 60 * 1000); // 10 minutes

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line
  }, []);

  if (!wallet) {
    return <CircularProgress />;
  }

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
      }}
    >
      <img src={EthereumLogo} alt="Ethereum Logo" height={50} width={50} />

      <Typography variant="h5">Balance: {wallet.balance} ETH</Typography>

      <div
        style={{
          width: "85%",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <TextField
          label="Ethereum Address"
          variant="outlined"
          value={wallet.ethAddress}
          onChange={(event) =>
            setWallet({ ...wallet, ethAddress: event.target.value })
          }
          fullWidth
        />

        <TextField
          label="Private Key"
          variant="outlined"
          type="password"
          value={privateKey}
          onChange={(event) => setPrivateKey(event.target.value)}
          fullWidth
        />
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <Button variant="contained" onClick={() => undo()} color="default">
          Undo
        </Button>
        <Button variant="contained" onClick={() => save()} color="primary">
          Save
        </Button>
      </div>
    </div>
  );
};

export default WalletScreen;

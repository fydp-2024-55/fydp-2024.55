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
  const [editedEthAddress, setEditedEthAddress] = useState<string>("");
  const [editedPrivateKey, setEditedPrivateKey] = useState<string>("");

  const loadWallet = async () => {
    try {
      const wallet = await backendService.getWallet();
      setWallet(wallet);
      setEditedEthAddress(wallet.ethAddress);
    } catch (error) {
      backendService.handleError(error, setAuthState);
    }
  };

  const updateEthAddress = async () => {
    // TODO
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

  if (editedEthAddress === undefined || wallet === undefined) {
    return <CircularProgress />;
  }

  return (
    <div
      style={{
        height: "100%",
        width: "85%",
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
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <TextField
          label="Ethereum Address"
          defaultValue={editedEthAddress}
          variant="outlined"
          onChange={(event) => setEditedEthAddress(event.target.value)}
          fullWidth
        />

        <TextField
          label="Private Key"
          defaultValue={editedEthAddress}
          variant="outlined"
          type="password"
          onChange={(event) => setEditedPrivateKey(event.target.value)}
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
        <Button
          variant="contained"
          onClick={() => {
            setEditedEthAddress(wallet.ethAddress);
            setEditedPrivateKey("");
          }}
          color="default"
        >
          Undo
        </Button>
        <Button
          variant="contained"
          onClick={() => updateEthAddress()}
          color="primary"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default WalletScreen;

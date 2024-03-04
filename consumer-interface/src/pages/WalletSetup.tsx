import React, { useContext, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Paper,
  Avatar,
} from "@mui/material";
import { Wallet } from "@mui/icons-material";

import AppContext from "../contexts/AppContext";
import backendService from "../services/backend-service";
import PageTemplate from "../components/PageTemplate";

const WalletSetup: React.FC = () => {
  const { isAuthenticated, account, setAccount } = useContext(AppContext);

  const navigate = useNavigate();

  const [walletOption, setWalletOption] = useState<"create" | "integrate">(
    "create"
  );
  const [ethAddress, setEthAddress] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWalletOption(event.target.value as "create" | "integrate");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (walletOption === "create") {
        // Create a new wallet for the user
        const wallet = await backendService.createWallet();
        // Create a consumer instance for the user
        await backendService.createConsumer();
        setAccount({ ...account, ethAddress: wallet.ethAddress });
      } else {
        await backendService.updateWallet(ethAddress, privateKey);
        setAccount({ ...account, ethAddress });
      }
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  return (
    <PageTemplate>
      <Container component="main" maxWidth="xs" sx={{ marginTop: -6 }}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <Wallet />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              align="center"
              sx={{ marginTop: 2, marginBottom: 2 }}
            >
              Wallet Setup
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Choose an option:</FormLabel>
                  <RadioGroup
                    row
                    aria-label="wallet-option"
                    name="wallet-option"
                    value={walletOption}
                    onChange={handleOptionChange}
                  >
                    <FormControlLabel
                      value="create"
                      control={<Radio />}
                      label="Create New Wallet"
                    />
                    <FormControlLabel
                      value="integrate"
                      control={<Radio />}
                      label="Integrate Existing Wallet"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              {walletOption === "integrate" && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="address"
                      label="Address"
                      variant="outlined"
                      value={ethAddress}
                      onChange={(e) => setEthAddress(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="private-key"
                      label="Private Key"
                      type="password"
                      variant="outlined"
                      value={privateKey}
                      onChange={(e) => setPrivateKey(e.target.value)}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </PageTemplate>
  );
};

export default WalletSetup;

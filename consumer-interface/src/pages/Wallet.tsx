import { FC, useContext, useEffect, useState } from "react";
import { Box, Paper, Typography, CircularProgress, Grid } from "@mui/material";

import AppContext from "../contexts/AppContext";
import backendService from "../services/backend-service";
import EthereumLogo from "../images/ethereum-logo.png";
import PageTemplate from "../components/PageTemplate";

const Wallet: FC = () => {
  const { account } = useContext(AppContext);

  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const wallet = await backendService.getWallet();
        setBalance(wallet.balance);
      } catch (error) {
        console.error(error);
      }
    };

    // Fetch initial wallet balance
    fetchWalletBalance();

    // Set interval to fetch wallet balance every 5 seconds
    const interval = setInterval(fetchWalletBalance, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <PageTemplate>
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item xs={12} sm={8} md={6}>
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              height: "50vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box display="flex" alignItems="center" flexDirection="column">
              <img
                src={EthereumLogo}
                alt="Ethereum Logo"
                style={{ width: 100, marginBottom: 20 }}
              />
              <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                {balance !== null ? (
                  `Balance: ${Math.round(balance)} ETH`
                ) : (
                  <CircularProgress size={32} />
                )}
              </Typography>
              <Typography variant="body1">
                <strong>Address:</strong> {account?.ethAddress || "Loading..."}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </PageTemplate>
  );
};

export default Wallet;

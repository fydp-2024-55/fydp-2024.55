import { FC, useContext, useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  Grid,
} from "@mui/material";

import AppContext from "../contexts/AppContext";
import backendService from "../services/backend-service";
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
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Paper elevation={3} sx={{ padding: 4 }}>
            <Typography variant="h6" gutterBottom>
              Wallet
            </Typography>
            <Divider />
            <Box mt={2}>
              <Typography variant="body1" mb={1}>
                <strong>Address:</strong> {account?.ethAddress || "Loading..."}
              </Typography>
              <Typography variant="body1">
                <strong>Balance:</strong>{" "}
                {balance !== null ? (
                  `${balance} Wei`
                ) : (
                  <CircularProgress size={16} />
                )}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </PageTemplate>
  );
};

export default Wallet;

import { FC, useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

import backendService from "../services/backend-service";
import { SubscriptionResult } from "../types";
import { exportDataToCSV, exportDataToJSON } from "../utils/export";
import SubscriptionRow from "../components/SubscriptionRow";
import PageTemplate from "../components/PageTemplate";

const Subscriptions: FC = () => {
  const [subscriptionResults, setSubscriptionResults] = useState<
    SubscriptionResult[]
  >([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const subscriptions = (await backendService.getSubscriptions()) || [];
        const updatedSubscriptions = [];
        for (const subscription of subscriptions) {
          const user = await backendService.getUserByEthAddress(
            subscription.ethAddress
          );
          const producer = await backendService.getProducerByEthAddress(
            subscription.ethAddress
          );
          const interests =
            await backendService.getProducerInterestsByEthAddress(
              subscription.ethAddress
            );
          updatedSubscriptions.push({
            email: user.email,
            interests: interests,
            ...producer,
          });
        }
        setSubscriptionResults(updatedSubscriptions);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSubscriptions();
  }, []);

  return (
    <PageTemplate>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ alignSelf: "flex-end" }}>
          <Button
            variant="contained"
            sx={{ m: 1 }}
            onClick={() => exportDataToCSV(subscriptionResults)}
          >
            Export to CSV
          </Button>
          <Button
            variant="contained"
            sx={{ m: 1 }}
            onClick={() => exportDataToJSON(subscriptionResults)}
          >
            Export to JSON
          </Button>
        </Box>
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{ my: 2, height: "60vh", maxWidth: "70vw" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Email</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Ethnicity</TableCell>
                <TableCell>Date of Birth</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Income</TableCell>
                <TableCell>Marital Status</TableCell>
                <TableCell>Parental Status</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {subscriptionResults.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    align="center"
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.2em",
                    }}
                  >
                    No subscriptions
                  </TableCell>
                </TableRow>
              ) : (
                subscriptionResults.map((subscription) => (
                  <SubscriptionRow
                    key={subscription.email}
                    subscription={subscription}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </PageTemplate>
  );
};

export default Subscriptions;

import React, { useContext, useState, useEffect } from "react";
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

import AppContext from "../contexts/AppContext";
import SubscriptionRow from "../components/SubscriptionRow";
import { Subscription } from "../types";
import PageTemplate from "../components/PageTemplate";
import { exportDataToCSV, exportDataToJSON } from "../utils/export";

const mockSubscriptions: Subscription[] = [
  {
    email: "johndoe@example.com",
    gender: "Male",
    ethnicity: "White/Caucasian",
    dateOfBirth: "September 3 2001",
    country: "United States",
    income: 100000,
    maritalStatus: "Single",
    parentalStatus: "Parent",
    interests: [
      { category: "Sports", timeSpent: 250 },
      { category: "Music", timeSpent: 200 },
      { category: "Travel", timeSpent: 150 },
    ],
  },
  {
    email: "janedoe@example.com",
    gender: "Female",
    ethnicity: "Black or African American",
    dateOfBirth: "April 15 1995",
    country: "United Kingdom",
    income: 75000,
    maritalStatus: "Married",
    parentalStatus: "Not Parent",
    interests: [
      { category: "Shopping", timeSpent: 280 },
      { category: "Entertainment", timeSpent: 220 },
      { category: "Social", timeSpent: 170 },
    ],
  },
  {
    email: "alice@example.com",
    gender: "Female",
    ethnicity: "Hispanic",
    dateOfBirth: "February 8 1990",
    country: "Canada",
    income: 60000,
    maritalStatus: "Divorced",
    parentalStatus: "Parent",
    interests: [
      { category: "Social", timeSpent: 290 },
      { category: "Cuisine", timeSpent: 240 },
      { category: "Animals", timeSpent: 180 },
    ],
  },
  {
    email: "bob@example.com",
    gender: "Male",
    ethnicity: "Asian/Pacific Islander",
    dateOfBirth: "November 20 1985",
    country: "Australia",
    income: 85000,
    maritalStatus: "Married",
    parentalStatus: "Parent",
    interests: [
      { category: "Shopping", timeSpent: 260 },
      { category: "Music", timeSpent: 210 },
      { category: "Animals", timeSpent: 160 },
    ],
  },
  {
    email: "sarah@example.com",
    gender: "Female",
    ethnicity: "White/Caucasian",
    dateOfBirth: "March 10 2000",
    country: "Germany",
    income: 40000,
    maritalStatus: "Single",
    parentalStatus: "Not Parent",
    interests: [
      { category: "Social", timeSpent: 300 },
      { category: "Cuisine", timeSpent: 250 },
      { category: "Beauty", timeSpent: 190 },
    ],
  },
  {
    email: "mike@example.com",
    gender: "Male",
    ethnicity: "Other",
    dateOfBirth: "July 7 1998",
    country: "Japan",
    income: 55000,
    maritalStatus: "Single",
    parentalStatus: "Not Parent",
    interests: [
      { category: "Travel", timeSpent: 270 },
      { category: "Sports", timeSpent: 220 },
      { category: "Entertainment", timeSpent: 170 },
    ],
  },
];

const Subscriptions: React.FC = () => {
  const { account } = useContext(AppContext);

  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>(mockSubscriptions);

  useEffect(() => {
    // Get the user's subscriptions
    setSubscriptions(mockSubscriptions);
  }, []);

  return (
    <PageTemplate>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ alignSelf: "flex-end" }}>
          <Button
            variant="contained"
            sx={{ m: 1 }}
            onClick={() => exportDataToCSV(subscriptions)}
          >
            Export to CSV
          </Button>
          <Button
            variant="contained"
            sx={{ m: 1 }}
            onClick={() => exportDataToJSON(subscriptions)}
          >
            Export to JSON
          </Button>
        </Box>
        <TableContainer
          component={Paper}
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
              {subscriptions.map((subscription) => (
                <SubscriptionRow
                  key={subscription.email}
                  subscription={subscription}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </PageTemplate>
  );
};

export default Subscriptions;

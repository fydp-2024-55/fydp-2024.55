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

import { Gender, Ethnicity, MaritalStatus, ParentalStatus } from "../types";
import { GlobalContext } from "../App";
import SubscriptionRow from "../components/SubscriptionRow";
import { Subscription } from "../types";
import PageTemplate from "../components/PageTemplate";
import { exportDataToCSV, exportDataToJSON } from "../utils/export";

const mockSubscriptions: Subscription[] = [
  {
    name: "John Doe",
    email: "johndoe@example.com",
    gender: Gender.M,
    ethnicity: Ethnicity.W,
    dateOfBirth: "September 3 2001",
    country: "United States",
    income: 100000,
    maritalStatus: MaritalStatus.S,
    parentalStatus: ParentalStatus.Y,
    history: [
      {
        url: "google.ca",
        title: "Google",
        visitTime: "December 23, 2023 10:00",
        timeSpent: "1",
      },
      {
        url: "facebook.ca",
        title: "Facebook",
        visitTime: "December 25, 2023 10:00",
        timeSpent: "1",
      },
    ],
  },
  {
    name: "Jane Smith",
    email: "janesmith@example.com",
    gender: Gender.F,
    ethnicity: Ethnicity.B,
    dateOfBirth: "March 15 1995",
    country: "Canada",
    income: 75000,
    maritalStatus: MaritalStatus.M,
    parentalStatus: ParentalStatus.Y,
    history: [
      {
        url: "amazon.com",
        title: "Amazon",
        visitTime: "January 5, 2023 12:00",
        timeSpent: "1",
      },
      {
        url: "youtube.com",
        title: "YouTube",
        visitTime: "January 7, 2023 15:30",
        timeSpent: "2",
      },
    ],
  },
  {
    name: "Michael Johnson",
    email: "michaeljohnson@example.com",
    gender: Gender.M,
    ethnicity: Ethnicity.A,
    dateOfBirth: "November 12 1988",
    country: "Australia",
    income: 85000,
    maritalStatus: MaritalStatus.S,
    parentalStatus: ParentalStatus.N,
    history: [
      {
        url: "apple.com",
        title: "Apple",
        visitTime: "February 10, 2023 09:15",
        timeSpent: "1",
      },
      {
        url: "netflix.com",
        title: "Netflix",
        visitTime: "February 12, 2023 21:45",
        timeSpent: "2",
      },
    ],
  },
  {
    name: "Emily Lee",
    email: "emilylee@example.com",
    gender: Gender.F,
    ethnicity: Ethnicity.H,
    dateOfBirth: "July 20 2000",
    country: "United Kingdom",
    income: 60000,
    maritalStatus: MaritalStatus.S,
    parentalStatus: ParentalStatus.N,
    history: [
      {
        url: "microsoft.com",
        title: "Microsoft",
        visitTime: "March 18, 2023 14:30",
        timeSpent: "1",
      },
      {
        url: "twitter.com",
        title: "Twitter",
        visitTime: "March 20, 2023 17:45",
        timeSpent: "1",
      },
    ],
  },
  {
    name: "David Brown",
    email: "davidbrown@example.com",
    gender: Gender.M,
    ethnicity: Ethnicity.O,
    dateOfBirth: "December 5 1990",
    country: "Germany",
    income: 95000,
    maritalStatus: MaritalStatus.M,
    parentalStatus: ParentalStatus.Y,
    history: [
      {
        url: "linkedin.com",
        title: "LinkedIn",
        visitTime: "April 25, 2023 11:00",
        timeSpent: "1",
      },
      {
        url: "reddit.com",
        title: "Reddit",
        visitTime: "April 28, 2023 13:30",
        timeSpent: "2",
      },
    ],
  },
];

const Subscriptions: React.FC = () => {
  const { account } = useContext(GlobalContext);

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
                <TableCell>Name</TableCell>
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

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
} from "@mui/material";

import { GlobalContext } from "../App";
import SubscriptionRow from "../components/SubscriptionRow";
import { Subscription } from "../types";
import PageTemplate from "../components/PageTemplate";

const mockSubscriptions: Subscription[] = [
  {
    name: "John Doe",
    email: "johndoe@example.com",
    gender: "Male",
    ethnicity: "White/Caucasian",
    dateOfBirth: "September 3, 2001",
    city: "San Francisco",
    state: "California",
    country: "United States",
    income: 100000,
    maritalStatus: "Single",
    parentalStatus: "Parent",
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
    name: "John Doe",
    email: "johndoe@example.com",
    gender: "Male",
    ethnicity: "White/Caucasian",
    dateOfBirth: "September 3, 2001",
    city: "San Francisco",
    state: "California",
    country: "United States",
    income: 100000,
    maritalStatus: "Single",
    parentalStatus: "Parent",
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
    name: "John Doe",
    email: "johndoe@example.com",
    gender: "Male",
    ethnicity: "White/Caucasian",
    dateOfBirth: "September 3, 2001",
    city: "San Francisco",
    state: "California",
    country: "United States",
    income: 100000,
    maritalStatus: "Single",
    parentalStatus: "Parent",
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
    name: "John Doe",
    email: "johndoe@example.com",
    gender: "Male",
    ethnicity: "White/Caucasian",
    dateOfBirth: "September 3, 2001",
    city: "San Francisco",
    state: "California",
    country: "United States",
    income: 100000,
    maritalStatus: "Single",
    parentalStatus: "Parent",
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
    name: "John Doe",
    email: "johndoe@example.com",
    gender: "Male",
    ethnicity: "White/Caucasian",
    dateOfBirth: "September 3, 2001",
    city: "San Francisco",
    state: "California",
    country: "United States",
    income: 100000,
    maritalStatus: "Single",
    parentalStatus: "Parent",
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
    name: "John Doe",
    email: "johndoe@example.com",
    gender: "Male",
    ethnicity: "White/Caucasian",
    dateOfBirth: "September 3, 2001",
    city: "San Francisco",
    state: "California",
    country: "United States",
    income: 100000,
    maritalStatus: "Single",
    parentalStatus: "Parent",
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
];

const Subscriptions: React.FC = () => {
  const { account } = useContext(GlobalContext);

  const [subscriptions, setSubscriptions] = useState(mockSubscriptions);

  useEffect(() => {
    // Get the user's subscriptions
    setSubscriptions(mockSubscriptions);
  }, []);

  return (
    <PageTemplate>
      <Box>
        <TableContainer
          component={Paper}
          sx={{ my: 2, height: "60vh", maxWidth: "70vw" }}
        >
          <Table sx={{ width: "50vw" }}>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Ethnicity</TableCell>
                <TableCell>Date of Birth</TableCell>
                <TableCell>City</TableCell>
                <TableCell>State</TableCell>
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

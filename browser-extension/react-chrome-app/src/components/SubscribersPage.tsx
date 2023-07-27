import { CircularProgress, Typography } from "@material-ui/core";
import { FC, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

import { Subscriber } from "../types";
import client from "../api/client";
import { truncate_address } from "../utils";

const SubscribersPage: FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>();

  const loadSubscribers = async () => {
    try {
      const subscriptions: Subscriber[] = await client.getSubscribers();
      setSubscribers(subscriptions);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        alert(`${axiosError.status}:  ${axiosError.message}`);
      } else {
        alert(`Error ${error}`);
      }
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        overflowY: "auto",
      }}
    >
      <Typography align="left" variant="h4">
        Subscribers
      </Typography>
      {subscribers === undefined ? (
        <CircularProgress />
      ) : subscribers.length > 0 ? (
        subscribers.map((subscriber) => (
          <div
            style={{
              margin: "3%",
            }}
            key={subscriber.eth_address}
          >
            <Typography variant="h6">
              {truncate_address(subscriber.eth_address)}
            </Typography>
            <Typography variant="body1">Name: {subscriber.name}</Typography>
            <Typography variant="body1">Email: {subscriber.email}</Typography>
          </div>
        ))
      ) : (
        <Typography variant="h6">no active subscriptions!</Typography>
      )}
      <div />
    </div>
  );
};

export default SubscribersPage;

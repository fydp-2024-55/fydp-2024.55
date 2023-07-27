import { CircularProgress, Typography } from "@material-ui/core";
import { FC, useEffect, useState } from "react";
import { Subscriber } from "../types";
import client from "../api/client";
import axios, { AxiosError } from "axios";

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
            key={subscriber.ethAddress}
          >
            <Typography variant="h6">
              {subscriber.ethAddress}: {subscriber.name}
            </Typography>
            <Typography variant="body1">
              Subscriber email: {subscriber.email}
            </Typography>
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

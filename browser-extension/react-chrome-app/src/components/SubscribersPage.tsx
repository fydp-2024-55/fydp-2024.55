import { CircularProgress, Typography } from "@material-ui/core";
import { FC, useEffect, useState } from "react";
import { Subscriber } from "../types";

const SubscribersPage: FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>();

  const loadSubscribers = async () => {
    setTimeout(
      () =>
        setSubscribers([
          {
            ethAddress: "0x342...4324",
            name: "Louis Vutton",
            subscribedSince: "Sept 7, 2024",
          },
          {
            ethAddress: "0x342...4324",
            name: "Target Vutton",
            subscribedSince: "Jan 3, 2026",
          },
        ]),
      1000
    );
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
      }}
    >
      <Typography align="left" variant="h4">
        Subscribers
      </Typography>
      {subscribers === undefined ? (
        <CircularProgress />
      ) : (
        subscribers.map((subscriber) => (
          <div key={subscriber.ethAddress}>
            <Typography variant="h6">
              {subscriber.ethAddress}: {subscriber.name}
            </Typography>
            <Typography variant="body1">
              Subscribed since: {subscriber.subscribedSince}
            </Typography>
          </div>
        ))
      )}
      <div />
    </div>
  );
};

export default SubscribersPage;

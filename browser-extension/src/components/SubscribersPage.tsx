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
            email: "louis@vutton.com",
          },
          {
            ethAddress: "0x342...4325",
            name: "Target Vutton",
            email: "target@vutton.com",
          },
          {
            ethAddress: "0x342...4326",
            name: "CVS Vutton",
            email: "CVS@vutton.com",
          },
          {
            ethAddress: "0x342...4327",
            name: "safeway Vutton",
            email: "safeway@vutton.com",
          },
          {
            ethAddress: "0x342...4328",
            name: "costco Vutton",
            email: "costco@vutton.com",
          },
          {
            ethAddress: "0x342...4329",
            name: "walmart Vutton",
            email: "walmart@vutton.com",
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
        overflowY: "auto",
      }}
    >
      <Typography align="left" variant="h4">
        Subscribers
      </Typography>
      {subscribers === undefined ? (
        <CircularProgress />
      ) : (
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
      )}
      <div />
    </div>
  );
};

export default SubscribersPage;

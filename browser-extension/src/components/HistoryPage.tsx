import { CircularProgress, Typography } from "@material-ui/core";
import axios, { AxiosError } from "axios";
import { FC, useEffect, useState } from "react";
import client from "../api/client";
import { History } from "../types";

const HistoryPage: FC = () => {
  const [histories, setHistories] = useState<History[]>([]);

  const loadHistories = async () => {
    try {
      const historyArr: History[] = await client.getProducerHistory();
      setHistories(historyArr);
    } catch (error) {
      client.displayError(error);
    }
  };

  useEffect(() => {
    loadHistories();
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
        History
      </Typography>
      {histories === undefined ? (
        <CircularProgress />
      ) : (
        <div>
          {histories.map((history, index) => (
            <Typography key={index} align="left" variant="h6">
              {history.title} - {history.url}
            </Typography>
          ))}
        </div>
      )}
      <div />
    </div>
  );
};

export default HistoryPage;

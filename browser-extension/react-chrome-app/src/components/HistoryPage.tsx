import { CircularProgress, Typography } from "@material-ui/core";
import { FC, useEffect, useState } from "react";
import client from "../api/client";
import { History } from "../types";
import axios, { AxiosError } from "axios";

const HistoryPage: FC = () => {
  const [histories, setHistories] = useState<History[]>();

  // HELP
  const loadHistories = async () => {
    // try {
    //   const historyArr: History[] = await client.getHistory();
    //   historyArr.forEach((history: History) => {
    //     console.log(history);
    //   });
    // } catch (error) {
    //   if (axios.isAxiosError(error)) {
    //     const axiosError = error as AxiosError;
    //     alert(`${axiosError.status}:  ${axiosError.message}`);
    //   } else {
    //     alert(`Error ${error}`);
    //   }
    // }

    setTimeout(
      () =>
        setHistories([
          {
            title: "Google",
            url: "https://google.com",
            timeSpent: "",
            visitTime: "",
          },
          {
            title: "Reddit",
            url: "https://reddit.com",
            timeSpent: "",
            visitTime: "f",
          },
        ]),
      1000
    );
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
          {histories.map((history) => (
            <Typography key={history.visitTime} align="left" variant="h6">
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

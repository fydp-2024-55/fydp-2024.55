import { CircularProgress, Typography } from "@material-ui/core";
import { FC, useEffect, useState } from "react";
import { History } from "../types";

const HistoryPage: FC = () => {
  const [histories, setHistories] = useState<History[]>();

  const loadHistories = async () => {
    // Todo: Replace timeout with api call
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

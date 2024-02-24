import { CircularProgress, Typography } from "@material-ui/core";
import { FC, useContext, useEffect, useState } from "react";
import backendService from "../../services/backend-service";
import { History } from "../../types";
import AppContext from "../contexts/AppContext";

const HistoryScreen: FC = () => {
  const { setAuthState } = useContext(AppContext)!;

  const [histories, setHistories] = useState<History[]>([]);

  const loadHistories = async () => {
    try {
      const historyArr: History[] = await backendService.getProducerHistory();
      setHistories(historyArr);
    } catch (error) {
      backendService.handleError(error, setAuthState);
    }
  };

  useEffect(() => {
    loadHistories();
  }, [loadHistories]);

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

export default HistoryScreen;

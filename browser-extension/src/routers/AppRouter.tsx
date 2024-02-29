import { FC, useContext } from "react";
import AppContext from "../components/contexts/AppContext";
import BottomBar from "../components/navigation/BottomBar";

import TopBar from "../components/navigation/TopBar";
import { AuthenticatedRouter } from "./AuthenticatedRouter";
import { UnauthenticatedRouter } from "./UnauthenticatedRouter";
import { CircularProgress } from "@material-ui/core";

const AppRouter: FC = () => {
  const { authState } = useContext(AppContext)!;

  switch (authState) {
    case "authenticated":
      return (
        <>
          <div
            style={{
              height: 80,
              background: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TopBar />
          </div>
          <div
            style={{
              height: 340,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AuthenticatedRouter />
          </div>
          <div style={{ height: 80 }}>
            <BottomBar />
          </div>
        </>
      );

    case "unauthenticated":
      return <UnauthenticatedRouter />;

    default:
      return <CircularProgress />;
  }
};

export default AppRouter;

import { FC, useContext } from "react";
import AppContext from "../components/contexts/AppContext";
import BottomBar from "../components/navigation/BottomBar";

import { CircularProgress } from "@material-ui/core";
import TopBar from "../components/navigation/TopBar";
import Toast from "../components/shared/Toast";
import { AuthenticatedRouter } from "./AuthenticatedRouter";
import { UnauthenticatedRouter } from "./UnauthenticatedRouter";

const AppRouter: FC = () => {
  const { authState } = useContext(AppContext)!;

  switch (authState) {
    case "authenticated":
      return (
        <>
          <div
            style={{
              height: 60,
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
              height: 380,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AuthenticatedRouter />
          </div>
          <div style={{ height: 60 }}>
            <BottomBar />
          </div>
          <Toast />
        </>
      );

    case "unauthenticated":
      return <UnauthenticatedRouter />;

    default:
      return <CircularProgress />;
  }
};

export default AppRouter;

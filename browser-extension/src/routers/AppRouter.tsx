import { CircularProgress } from "@mui/material";
import { FC, useContext } from "react";
import { AuthState } from "../types";
import AppContext from "../components/contexts/AppContext";
import BottomNav from "../components/navigation/BottomNav";

import LogoutButton from "../components/navigation/LogoutButton";
import { AuthenticatedRouter } from "./AuthenticatedRouter";
import { UnauthenticatedRouter } from "./UnauthenticatedRouter";

const AppRouter: FC = () => {
  const { authState } = useContext(AppContext)!;

  switch (authState) {
    case AuthState.Authenticated:
      return (
        <div
          style={{
            height: "100%",
            width: "100%",
            paddingTop: 20,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflowY: "hidden",
            position: "relative",
          }}
        >
          <LogoutButton />
          <AuthenticatedRouter />
          <BottomNav />
        </div>
      );

    case AuthState.Unauthenticated:
      return <UnauthenticatedRouter />;

    default:
      return <CircularProgress />;
  }
};

export default AppRouter;

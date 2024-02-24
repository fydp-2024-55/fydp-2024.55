import { Button } from "@material-ui/core";
import { FC, useContext } from "react";
import apiClient from "../services/api-client";
import { AuthState } from "../types";
import AppContext from "./AppContext";

const LogoutButton: FC = () => {
  const { setAuthState } = useContext(AppContext)!;

  const logOut = async () => {
    try {
      await apiClient.logOut();
      setAuthState(AuthState.Unauthenticated);
    } catch (error) {
      apiClient.handleError(error, setAuthState);
    }
  };

  return (
    <Button
      variant="contained"
      size="small"
      style={{ position: "absolute", left: 0, top: 0, margin: 6 }}
      onClick={logOut}
    >
      Sign out
    </Button>
  );
};

export default LogoutButton;

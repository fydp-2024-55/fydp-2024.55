import { Button } from "@material-ui/core";
import { FC, useContext } from "react";
import client from "../api/client";
import { Page } from "../types";
import AppContext from "./AppContext";

const LogoutButton: FC = () => {
  const { setToken, setPage } = useContext(AppContext)!;

  const logOut = async () => {
    try {
      await client.logOut();
      setPage(Page.Login);
      setToken(null);
    } catch (error) {
      client.displayError(error);
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

import { Button } from "@material-ui/core";
import axios, { AxiosError } from "axios";
import { FC } from "react";
import client from "../api/client";

interface Props {
  onLogout: () => void;
}

const LogoutButton: FC<Props> = ({ onLogout }) => {
  const logOut = async () => {
    try {
      await client.logOut(); // TODO: find out why
      onLogout();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        alert(`${axiosError.status}:  ${axiosError.message}`);
      } else {
        alert(`Error ${error}`);
      }
    }
  };

  return (
    <Button
      variant="contained"
      size="small"
      style={{ position: "absolute", left: 0, top: 0, margin: 6 }}
      onClick={logOut}
    >
      LOGOUT
    </Button>
  );
};

export default LogoutButton;

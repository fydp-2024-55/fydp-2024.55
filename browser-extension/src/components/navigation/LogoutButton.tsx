import { Button } from "@material-ui/core";
import { FC, useContext } from "react";
import backendService from "../../services/backend-service";
import AppContext from "../contexts/AppContext";

const LogoutButton: FC = () => {
  const { setAuthState } = useContext(AppContext)!;

  const logOut = async () => {
    try {
      await backendService.logOut();
      setAuthState("unauthenticated");
    } catch (error) {
      backendService.handleError(error, setAuthState);
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

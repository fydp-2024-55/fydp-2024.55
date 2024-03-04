import { Button, Card, Typography } from "@material-ui/core";
import { Logout } from "@mui/icons-material";
import { FC, useContext } from "react";
import Logo from "../../images/logo.png";
import backendService from "../../services/backend-service";
import AppContext from "../contexts/AppContext";

const LogoutButton: FC = () => {
  const { setAuthState, screen } = useContext(AppContext)!;

  const logOut = async () => {
    try {
      await backendService.logOut();
      setAuthState("unauthenticated");
    } catch (error) {
      backendService.handleError(error, setAuthState);
    }
  };

  return (
    <Card
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
      }}
    >
      <img src={Logo} alt="Logo" height={40} width={40} />

      <Typography variant="h4">
        {screen.substring(0, 1).toUpperCase() + screen.substring(1)}
      </Typography>

      <Button onClick={logOut}>
        <Logout style={{ height: 40, width: 40 }} />
      </Button>
    </Card>
  );
};

export default LogoutButton;

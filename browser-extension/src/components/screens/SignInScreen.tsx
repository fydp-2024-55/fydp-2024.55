import { Button, TextField, Typography } from "@material-ui/core";
import { FC, useContext, useState } from "react";
import Logo from "../../images/logo.png";
import backendService from "../../services/backend-service";
import AuthContext from "../contexts/AppContext";

const SignInScreen: FC = () => {
  const { setAuthState, setScreen } = useContext(AuthContext)!;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const logIn = async () => {
    try {
      await backendService.logIn(email, password);
      setAuthState("authenticated");
    } catch (error) {
      backendService.handleError(error, setAuthState);
    }
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
      }}
    >
      <img src={Logo} alt="Logo" height={100} width={100}></img>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          onChange={(event) => setEmail(event.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <Button color="primary" variant="contained" onClick={logIn}>
          Sign in
        </Button>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Typography variant="body1">Don't have an account?</Typography>
          <Button
            variant="text"
            color="primary"
            onClick={() => setScreen("sign-up")}
          >
            <Typography variant="body1">Sign up!</Typography>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignInScreen;

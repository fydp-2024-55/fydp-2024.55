import { Button, TextField, Typography } from "@material-ui/core";
import { Alert } from "@mui/material";
import { FC, useContext, useState } from "react";
import Logo from "../../images/logo.png";
import backendService from "../../services/backend-service";
import AuthContext from "../contexts/AppContext";

const SignUpScreen: FC = () => {
  const { setAuthState, setScreen } = useContext(AuthContext)!;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmedPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const register = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      await backendService.register(email, password);
      await backendService.logIn(email, password);
      await backendService.createWallet();
      setAuthState("authenticated");
    } catch (error) {
      setErrorMessage("Error: sign up failed");
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
        {errorMessage !== "" && <Alert severity="error">{errorMessage}</Alert>}

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
        <TextField
          label="Confirm Password"
          type="password"
          variant="outlined"
          onChange={(event) => setConfirmedPassword(event.target.value)}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <Button color="primary" variant="contained" onClick={register}>
          Sign up
        </Button>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Typography variant="body1">Already have an account?</Typography>
          <Button
            variant="text"
            color="primary"
            onClick={() => setScreen("sign-in")}
          >
            <Typography variant="body1">Sign in!</Typography>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;

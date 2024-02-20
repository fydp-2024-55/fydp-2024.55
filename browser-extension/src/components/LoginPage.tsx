import { Button, TextField, Typography } from "@material-ui/core";
import { FC, useContext, useState } from "react";
import client from "../utils/api-client";
import { AuthState, Page } from "../types";
import AuthContext from "./AppContext";

const LoginPage: FC = () => {
  const { setAuthState, setPage } = useContext(AuthContext)!;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const logIn = async () => {
    try {
      await client.logIn(email, password);
      setAuthState(AuthState.Authenticated);
    } catch (error) {
      client.handleError(error, setAuthState);
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
      <Typography variant="h1">Sign In</Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <TextField
          label="Email"
          type="email"
          variant="filled"
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="filled"
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
            onClick={() => setPage(Page.Registration)}
          >
            <Typography variant="body1">Sign up!</Typography>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

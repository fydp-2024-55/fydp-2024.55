import { Button, TextField, Typography } from "@material-ui/core";
import axios, { AxiosError } from "axios";
import { FC, useState } from "react";
import client from "../api/client";

interface Props {
  onLogIn: () => void;
}

const LoginPage: FC<Props> = ({ onLogIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const logIn = async () => {
    try {
      await client.logIn({ email, password });
      onLogIn();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        alert(`${axiosError.status}:  ${axiosError.message}`);
      } else {
        alert(`Error ${error}`);
      }
    }
  };

  const register = async () => {
    try {
      await client.register({ email, password });
      await logIn();
      onLogIn();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        alert(`HTTP ${axiosError.status}:  ${axiosError.message}`);
        console.log(axiosError.response?.data);
      } else {
        alert(`Error ${error}`);
        console.log(error);
      }
    }
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
      }}
    >
      <Typography variant="h1">Login</Typography>
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
          Log In
        </Button>
        <Button variant="contained" onClick={register}>
          Create Account
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;

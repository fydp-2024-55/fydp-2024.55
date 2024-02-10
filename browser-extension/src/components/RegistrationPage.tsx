import { Button, TextField, Typography } from "@material-ui/core";
import { FC, useContext, useState } from "react";
import client from "../api/client";
import { Page } from "../types";
import AuthContext from "./AppContext";

const RegistrationPage: FC = () => {
  const { setToken, setPage } = useContext(AuthContext)!;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ethAddress, setEthAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [name, setName] = useState("");

  const register = async () => {
    try {
      await client.register(email, password, ethAddress);
      const bearerToken = await client.logIn(email, password);
      await client.createProducer({
        name,
        eth_address: ethAddress,
        gender: null,
        ethnicity: null,
        date_of_birth: null,
        country: null,
        income: null,
        marital_status: null,
        parental_status: null,
      });
      setPage(Page.Profile);
      setToken(bearerToken.access_token);
    } catch (error) {
      client.displayError(error);
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
      <Typography variant="h1">Sign Up</Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <TextField
          label="Name"
          type="test"
          variant="filled"
          onChange={(event) => setName(event.target.value)}
        />
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
        <TextField
          label="ETH Address"
          type="text"
          variant="filled"
          onChange={(event) => setEthAddress(event.target.value)}
        />
        <TextField
          label="Private Key"
          type="password"
          variant="filled"
          onChange={(event) => setPrivateKey(event.target.value)}
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
            onClick={() => setPage(Page.Login)}
          >
            <Typography variant="body1">Sign in!</Typography>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;

import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import PageTemplate from "../components/PageTemplate";

import { GlobalContext } from "../App";

const Profile: React.FC = () => {
  const { account, setAccount } = useContext(GlobalContext);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [email, setEmail] = useState<string | undefined>(account.email);
  const [newPassword, setNewPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = () => {
    // Update the user's data: email, password
    setAccount({ ...account, email });
    setEditMode(false);
  };

  return (
    <PageTemplate>
      <Box sx={{ boxShadow: 2, p: 4, minWidth: "40vw" }}>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography sx={{ m: 2 }}>
            <Box fontWeight="fontWeightMedium" display="inline">
              Wallet Address:
            </Box>{" "}
            {account.ethAddress}
          </Typography>
          <Typography sx={{ m: 2 }}>
            <Box fontWeight="fontWeightMedium" display="inline">
              Email:
            </Box>{" "}
            {email}
          </Typography>
          {editMode ? (
            <>
              <TextField
                id="password-input"
                label="New Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setNewPassword(event.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ m: 2, width: "30vw" }}
              />
              <Button
                variant="contained"
                sx={{ m: 3, width: 200, alignSelf: "center" }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </>
          ) : (
            <>
              <Typography sx={{ m: 2 }}>
                <Box fontWeight="fontWeightMedium" display="inline">
                  Password:
                </Box>{" "}
                ●●●●●●●●●●●●●
              </Typography>
              <Button
                variant="contained"
                sx={{ m: 3, width: 200, alignSelf: "center" }}
                onClick={() => {
                  setEditMode(true);
                }}
              >
                Edit
              </Button>
            </>
          )}
        </Box>
      </Box>
    </PageTemplate>
  );
};

export default Profile;

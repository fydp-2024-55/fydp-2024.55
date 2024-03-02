import { FC, useContext, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import AppContext from "../contexts/AppContext";
import backendService from "../services/backend-service";
import PageTemplate from "../components/PageTemplate";

const Profile: FC = () => {
  const { account } = useContext(AppContext);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      await backendService.updateUser(account?.email, newPassword);
      setEditMode(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PageTemplate>
      <Box sx={{ boxShadow: 2, p: 4, minWidth: "40vw", marginTop: -6 }}>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography sx={{ m: 1 }}>
            <Box fontWeight="fontWeightMedium" display="inline">
              Email:
            </Box>{" "}
            {account?.email}
          </Typography>
          {editMode ? (
            <>
              <TextField
                id="password-input"
                label="New Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                onChange={(event) => {
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
                sx={{ m: 1, width: "30vw" }}
              />
              <Box display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  sx={{ m: 3, width: 150 }}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  sx={{ m: 3, width: 150 }}
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography sx={{ m: 1 }}>
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

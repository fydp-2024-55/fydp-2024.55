import { FC, useContext, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import AppContext from "../contexts/AppContext";
import backendService from "../services/backend-service";
import PageTemplate from "../components/PageTemplate";

const Profile: FC = () => {
  const { account } = useContext(AppContext);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [newEmail, setNewEmail] = useState<string>("");
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
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item xs={12} sm={8} md={6}>
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              height: "50vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Profile
              </Typography>
              <Box
                width="80%"
                height="80%"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                mb={3}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <Typography variant="h6" gutterBottom>
                    Email
                  </Typography>
                  {editMode ? (
                    <TextField
                      id="email-input"
                      label="New Email"
                      variant="outlined"
                      type="text"
                      value={newEmail}
                      onChange={(event) => {
                        setNewEmail(event.target.value);
                      }}
                      sx={{ ml: 1, width: "250px" }}
                    />
                  ) : (
                    <Typography variant="body1">{account?.email}</Typography>
                  )}
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6" gutterBottom>
                    Password
                  </Typography>
                  {editMode ? (
                    <TextField
                      id="password-input"
                      label="New Password"
                      variant="outlined"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
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
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ ml: 1, width: "250px" }}
                    />
                  ) : (
                    <Typography variant="body1" gutterBottom>
                      ●●●●●●●●●●●●●
                    </Typography>
                  )}
                </Box>
              </Box>
              {editMode ? (
                <Box mt={4} display="flex" justifyContent="center">
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{ mr: 1 }}
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ ml: 1 }}
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => setEditMode(true)}
                  sx={{ mt: 4 }}
                >
                  Edit
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </PageTemplate>
  );
};

export default Profile;

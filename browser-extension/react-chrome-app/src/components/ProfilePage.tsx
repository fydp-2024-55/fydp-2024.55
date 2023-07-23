import {
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@material-ui/core";
import { FC, useEffect, useState } from "react";

const ProfilePage: FC = () => {
  const [profile, setProfile] = useState<{ [key: string]: string | number }>();

  const loadProfile = async () => {
    // Todo: Replace timeout with api call
    setTimeout(
      () =>
        setProfile({
          name: "Dre",
          gender: "M",
          ethnicity: "B",
          dateOfBirth: "1999-01-01",
          city: "Santa Clara",
          state: "CA",
          country: "US",
          income: 450000,
          maritalStatus: "S",
          parentalStatus: "N",
        }),
      1000
    );
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h4">Profile</Typography>
      {profile === undefined ? (
        <CircularProgress />
      ) : (
        <>
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            {Object.keys(profile).map((key) => (
              <TextField
                key={key}
                style={{ margin: 10 }}
                label={key}
                defaultValue={profile[key]}
                variant="standard"
              />
            ))}
          </div>
          <Button variant="contained">Save</Button>
        </>
      )}
      <div />
    </div>
  );
};

export default ProfilePage;

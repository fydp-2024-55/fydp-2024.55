import {
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@material-ui/core";
import { FC, useContext, useEffect, useState } from "react";
import backendService from "../services/backend-service";
import { Producer } from "../types";
import AppContext from "./AppContext";

const ProfilePage: FC = () => {
  const { setAuthState } = useContext(AppContext)!;

  const [profile, setProfile] = useState<Producer>();
  const [updateProfile, setUpdateProfile] = useState<Producer>();

  const loadProfile = async () => {
    try {
      const producer: Producer = await backendService.getProducer();
      setProfile(producer);
      setUpdateProfile(producer);
    } catch (error) {
      backendService.handleError(error, setAuthState);
    }
  };

  const updateProducer = async () => {
    try {
      if (updateProfile) {
        const updatedProfile = await backendService.updateProducer(
          updateProfile
        );
        setProfile(updatedProfile);
        alert("Saved");
      }
    } catch (error) {
      backendService.handleError(error, setAuthState);
    }
  };

  const onEdit = <T extends keyof Producer>(field: T, value: Producer[T]) => {
    let temp: Producer | undefined = updateProfile;
    if (temp) {
      temp[field] = value;
      setUpdateProfile(temp);
    }
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
            {Object.keys(profile)
              .filter((key) => !["user_id"].includes(key))
              .map((key) => (
                <TextField
                  key={key}
                  style={{ margin: 10 }}
                  label={key}
                  defaultValue={profile[key as keyof Producer]}
                  variant="standard"
                  onChange={(event) =>
                    onEdit(key as keyof Producer, event?.target.value)
                  }
                />
              ))}
          </div>
          <Button variant="contained" onClick={updateProducer}>
            Save
          </Button>
        </>
      )}
      <div />
    </div>
  );
};

export default ProfilePage;

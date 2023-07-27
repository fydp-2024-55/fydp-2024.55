import {
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@material-ui/core";
import { FC, useEffect, useState } from "react";
import client from "../api/client";
import { Producer } from "../types";
import axios, { AxiosError } from "axios";

const ProfilePage: FC = () => {
  const [profile, setProfile] = useState<Producer>();
  const [updateProfile, setUpdateProfile] = useState<Producer>();

  const loadProfile = async () => {
    try {
      const producer: Producer = await client.getProducer();
      setProfile(producer);
      setUpdateProfile(producer);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        alert(`${axiosError.status}:  ${axiosError.message}`);
      } else {
        alert(`Error ${error}`);
      }
    }
  };

  const updateProducer = async () => {
    try {
      if (updateProfile) {
        await client.updateProducer(updateProfile);
        // const producer: Producer = await client.getProducer(); // put back later
        setProfile(updateProfile);
        console.log("saved");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        alert(`${axiosError.status}:  ${axiosError.message}`);
      } else {
        alert(`Error ${error}`);
      }
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
              .filter((key) => ["user_id", "id"].includes(key) === false)
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

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
  const [profile, setProfile] = useState<{ [key: string]: string | number }>();
  const [updateProfile, setUpdateProfile] = useState<{
    [key: string]: string | number;
  }>();

  const loadProfile = async () => {
    try {
      const producer: Producer = await client.getProducer();
      setProfile({
        name: producer.name,
        gender: producer.gender,
        ethnicity: producer.ethnicity,
        dateOfBirth: producer.date_of_birth, // change to camel case
        city: producer.city,
        state: producer.state,
        country: producer.country,
        income: producer.income,
        maritalStatus: producer.marital_status, // change to camel case is not displaying
        parentalStatus: producer.parental_status, // change to camel case is not displaying
      });
      setUpdateProfile(profile);
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
      await client.updateProducer();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        alert(`${axiosError.status}:  ${axiosError.message}`);
      } else {
        alert(`Error ${error}`);
      }
    }
  };

  const onEdit = (key: string, value: string | number) => {
    setUpdateProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
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
                onChange={(event) => onEdit(key, event?.target.value)}
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

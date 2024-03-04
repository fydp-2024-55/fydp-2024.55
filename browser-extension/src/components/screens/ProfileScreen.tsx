import { Button, CircularProgress, TextField } from "@material-ui/core";
import { FC, useContext, useEffect, useState } from "react";
import backendService from "../../services/backend-service";
import { Producer } from "../../types";
import AppContext from "../contexts/AppContext";

const ProfileScreen: FC = () => {
  const { setAuthState } = useContext(AppContext)!;

  const [profile, setProfile] = useState<Producer>();
  const [shouldCreate, setShouldCreate] = useState(false);

  const load = async () => {
    try {
      const producer = await backendService.getProducer();
      setProfile(producer);
    } catch (error) {
      if (backendService.isNotFoundError(error)) {
        setProfile({
          gender: null,
          ethnicity: null,
          dateOfBirth: null,
          country: null,
          income: null,
          maritalStatus: null,
          parentalStatus: null,
        });
        setShouldCreate(true);
      } else {
        backendService.handleError(error, setAuthState);
      }
    }
  };

  // TODO: Use filter options

  const undo = async () => {
    await load();
  };

  const save = async () => {
    try {
      if (profile) {
        let fetchedProfile: Producer;
        if (shouldCreate) {
          fetchedProfile = await backendService.createProducer(profile);
          setShouldCreate(false);
        } else {
          fetchedProfile = await backendService.updateProducer(profile);
        }
        setProfile(fetchedProfile);
        alert("Saved");
      }
    } catch (error) {
      backendService.handleError(error, setAuthState);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  if (!profile) {
    return <CircularProgress />;
  }

  const isValid = Object.keys(profile).every(
    (key) => profile[key as keyof Producer] !== null
  );

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "auto",
      }}
    >
      {Object.keys(profile) // TODO: Use appropriate input form
        .map((key) => (
          <TextField
            key={key}
            label={key}
            style={{ width: "85%", margin: "20px 0px" }}
            variant="outlined"
            value={profile[key as keyof Producer]}
            onChange={(event) =>
              setProfile({
                ...profile,
                [key as keyof Producer]: event.target.value,
              })
            }
          />
        ))}

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          margin: "20px 0",
          gap: 20,
        }}
      >
        <Button
          variant="contained"
          onClick={() => undo()}
          color="default"
          disabled={!isValid}
        >
          Undo
        </Button>
        <Button
          variant="contained"
          onClick={() => save()}
          color="primary"
          disabled={!isValid}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default ProfileScreen;

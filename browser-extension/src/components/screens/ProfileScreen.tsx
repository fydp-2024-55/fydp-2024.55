import { Button, CircularProgress, TextField } from "@material-ui/core";
import { FC, useContext, useEffect, useState } from "react";
import backendService from "../../services/backend-service";
import { Producer } from "../../types";
import AppContext from "../contexts/AppContext";

const ProfileScreen: FC = () => {
  const { setAuthState } = useContext(AppContext)!;

  const [profile, setProfile] = useState<Producer>();
  const [editedProfile, setEditedProfile] = useState<Producer>();

  const loadProfile = async () => {
    try {
      const producer: Producer = await backendService.getProducer();
      setProfile(producer);
      setEditedProfile(producer);
    } catch (error) {
      backendService.handleError(error, setAuthState);
    }
  };

  const updateProducer = async () => {
    try {
      if (editedProfile) {
        const fetchedProfile = await backendService.updateProducer(
          editedProfile
        );
        setProfile(fetchedProfile);
        alert("Saved");
      }
    } catch (error) {
      backendService.handleError(error, setAuthState);
    }
  };

  const onEdit = <T extends keyof Producer>(field: T, value: Producer[T]) => {
    let temp: Producer | undefined = editedProfile;
    if (temp) {
      temp[field] = value;
      setEditedProfile(temp);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {}, [profile]);

  if (editedProfile === undefined || profile === undefined) {
    return <CircularProgress />;
  }

  return (
    <div
      style={{
        height: "100%",
        width: "90%",
        display: "flex",
        flexDirection: "column",
        overflow: "scroll",
      }}
    >
      {Object.keys(editedProfile) // TODO: Use appropriate input form
        .map((key) => (
          <TextField
            key={key}
            style={{ margin: 20 }}
            label={key}
            defaultValue={editedProfile[key as keyof Producer]}
            variant="outlined"
            onChange={(event) =>
              onEdit(key as keyof Producer, event?.target.value)
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
          onClick={() => setEditedProfile(profile)}
          color="default"
        >
          Undo
        </Button>
        <Button
          variant="contained"
          onClick={() => updateProducer()}
          color="primary"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default ProfileScreen;

import {
  Button,
  CircularProgress,
  MenuItem,
  TextField,
} from "@material-ui/core";
import { FC, useContext, useEffect, useState } from "react";
import backendService from "../../services/backend-service";
import { Producer, ProducerOptions } from "../../types";
import AppContext from "../contexts/AppContext";

const ProfileScreen: FC = () => {
  const { setAuthState } = useContext(AppContext)!;

  const [profile, setProfile] = useState<Producer>();
  const [shouldCreate, setShouldCreate] = useState(false);
  const [options, setOptions] = useState<ProducerOptions>();

  const load = async () => {
    try {
      const options = await backendService.getProfileOptions();
      setOptions(options);

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

  if (!profile || !options) {
    return <CircularProgress />;
  }

  const isValid = Object.keys(profile).every(
    (key) => profile[key as keyof Producer] !== null
  );

  const renderOptions = (
    label: string,
    producerKey: keyof Producer,
    optionsKey: keyof ProducerOptions
  ) => (
    <TextField
      label={label}
      style={{ width: "85%", margin: "20px 0px" }}
      variant="outlined"
      fullWidth
      value={profile[producerKey]}
      onChange={(event) =>
        setProfile({ ...profile, [producerKey]: event.target.value as string })
      }
      select
    >
      {options[optionsKey].map((option) => (
        <MenuItem value={option}>{option}</MenuItem>
      ))}
    </TextField>
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
      {renderOptions("Gender", "gender", "genders")}
      {renderOptions("Ethnicity", "ethnicity", "ethnicities")}
      {renderOptions("Country", "country", "countries")}
      <TextField
        label="Date of Birth"
        style={{ width: "85%", margin: "20px 0px" }}
        variant="outlined"
        type="date"
        value={profile.dateOfBirth}
        onChange={(event) =>
          setProfile({
            ...profile,
            dateOfBirth: event.target.value,
          })
        }
      />
      <TextField
        label="Income"
        style={{ width: "85%", margin: "20px 0px" }}
        variant="outlined"
        type="number"
        value={profile.income}
        onChange={(event) =>
          setProfile({
            ...profile,
            income: parseInt(event.target.value),
          })
        }
      />
      {renderOptions("Marital Status", "maritalStatus", "maritalStatuses")}
      {renderOptions("Parental Status", "parentalStatus", "parentalStatuses")}

      {/* {Object.keys(profile)
        .filter((key) => !["gender"].includes(key)) // TODO: Use appropriate input form
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
        ))} */}

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

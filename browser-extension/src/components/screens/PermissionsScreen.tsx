import {
  Button,
  CircularProgress,
  Switch,
  Typography,
} from "@material-ui/core";
import { FC, useContext, useEffect, useState } from "react";
import { Permissions } from "../../types";
import backendService from "../../services/backend-service";
import AppContext from "../contexts/AppContext";

const PermissionsScreen: FC = () => {
  const { setAuthState, setScreen } = useContext(AppContext)!;

  const [permissions, setPermissions] = useState<Permissions | null>();

  const load = async () => {
    try {
      const fetchedPermissions = await backendService.getPermissions();
      setPermissions(fetchedPermissions);
    } catch (error) {
      if (backendService.isNotFoundError(error)) {
        setPermissions(null);
      } else {
        backendService.handleError(error, setAuthState);
      }
    }
  };

  const undo = async () => {
    await load();
  };

  const save = async () => {
    try {
      if (permissions) {
        const fetchedPermissions = await backendService.updatePermissions(
          permissions
        );
        setPermissions(fetchedPermissions);
        alert("Saved");
      }
    } catch (error) {
      backendService.handleError(error, setAuthState);
    }
  };

  const redirect = async () => {
    setScreen("profile");
  };

  const getLabel = (key: string) => {
    if (key === "social") {
      key = "social media";
    }
    return `Collect ${key} search history`;
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  if (permissions === undefined) {
    return <CircularProgress />;
  }

  if (permissions === null) {
    return (
      <Button variant="contained" onClick={() => redirect()} color="primary">
        Create a profile
      </Button>
    );
  }

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
      {Object.keys(permissions)
        .sort()
        .map((key: string) => (
          <div
            key={key}
            style={{
              width: "85%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "20px 0px",
            }}
          >
            <Typography variant="body1">{getLabel(key)}</Typography>

            <Switch
              checked={permissions[key]}
              onChange={() =>
                setPermissions({
                  ...permissions,
                  [key]: !permissions[key],
                })
              }
              color="primary"
            />
          </div>
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
        <Button variant="contained" onClick={() => undo()} color="default">
          Undo
        </Button>
        <Button variant="contained" onClick={() => save()} color="primary">
          Save
        </Button>
      </div>
    </div>
  );
};

export default PermissionsScreen;

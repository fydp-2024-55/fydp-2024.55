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

const getLabel = (key: string) => {
  if (key === "social") {
    key = "social media";
  }

  return `Collect ${key} search history`;
};

const PermissionsScreen: FC = () => {
  const { setAuthState } = useContext(AppContext)!;

  const [permissions, setPermissions] = useState<Permissions>();
  const [editedPermissions, setEditedPermissions] = useState<Permissions>();

  const loadPermissions = async () => {
    const fetchedPermissions = await backendService.getPermissions();
    setPermissions(fetchedPermissions);
    setEditedPermissions(fetchedPermissions);
  };

  const updatePermissions = async () => {
    try {
      if (editedPermissions) {
        const fetchedPermissions = await backendService.updatePermissions(
          editedPermissions
        );
        setPermissions(fetchedPermissions);
        alert("Saved");
      }
    } catch (error) {
      backendService.handleError(error, setAuthState);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  useEffect(() => {}, [editedPermissions]);

  if (editedPermissions === undefined) {
    return <CircularProgress />;
  }

  return (
    <div
      style={{
        height: "100%",
        width: "90%",
        display: "flex",
        flexDirection: "column",
        overflowY: "scroll",
      }}
    >
      {Object.keys(editedPermissions).map((key) => (
        <div
          key={key}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: 20,
          }}
        >
          <Typography variant="body1">{getLabel(key)}</Typography>

          <Switch
            defaultChecked={editedPermissions[key]}
            onChange={() =>
              setEditedPermissions({
                ...editedPermissions,
                [key]: !editedPermissions[key],
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
        <Button
          variant="contained"
          onClick={() => setEditedPermissions(permissions)}
          color="default"
        >
          Undo
        </Button>
        <Button
          variant="contained"
          onClick={() => updatePermissions()}
          color="primary"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default PermissionsScreen;

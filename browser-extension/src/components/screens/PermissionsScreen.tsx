import {
  Button,
  CircularProgress,
  Switch,
  Typography,
} from "@material-ui/core";
import { FC, useEffect, useState } from "react";
import { Permissions } from "../../types";

const PermissionsScreen: FC = () => {
  const [permissions, setPermissions] = useState<Permissions>();
  const [editedPermissions, setEditedPermissions] = useState<Permissions>();

  const loadPermissions = async () => {
    // Todo: Replace timeout with api call
    setTimeout(() => {
      const fetchedPermissions = {
        "Collect shopping search history": true,
        "Collect entertainment search history": true,
        "Collect travel search history": false,
        "Collect social media search history": false,
        "Collect sports search history": true,
        "Collect animals search history": true,
        "Collect music search history": true,
        "Collect cuisine search history": false,
        "Collect beauty search history": true,
      };
      setPermissions(fetchedPermissions);
      setEditedPermissions(fetchedPermissions);
    }, 0);
  };

  const updatedPermissions = async () => {
    // TODO
  };

  useEffect(() => {
    loadPermissions();
  }, []);

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
          <Typography variant="body1">{key}</Typography>

          <Switch
            value={editedPermissions[key]}
            defaultChecked={editedPermissions[key]}
            onChange={(event) =>
              setPermissions({
                ...editedPermissions,
                [key]: !event.target.checked,
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
          onClick={() => updatedPermissions()}
          color="primary"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default PermissionsScreen;

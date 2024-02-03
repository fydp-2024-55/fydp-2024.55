import { CircularProgress, Typography } from "@material-ui/core";
import { Switch } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Permissions } from "../types";

const PermissionsPage: FC = () => {
  const [permissions, setPermissions] = useState<Permissions>();

  const loadPermissions = async () => {
    // Todo: Replace timeout with api call
    setTimeout(
      () =>
        setPermissions({
          "Collect shopping search history": true,
          "Collect entertainment search history": true,
          "Collect travel search history": true,
          "Collect social media search history": true,
        }),
      1000
    );
  };

  useEffect(() => {
    loadPermissions();
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
      <Typography align="left" variant="h4">
        Permissions
      </Typography>
      {permissions === undefined ? (
        <CircularProgress />
      ) : (
        Object.keys(permissions).map((key) => (
          <div
            key={key}
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "80%",
            }}
          >
            <Typography variant="body1">{key}</Typography>
            <Switch
              value={permissions[key]}
              defaultChecked={permissions[key]}
              onChange={(event) =>
                setPermissions({
                  ...permissions,
                  [key]: !event.target.checked,
                })
              }
            />
          </div>
        ))
      )}
      <div />
    </div>
  );
};

export default PermissionsPage;

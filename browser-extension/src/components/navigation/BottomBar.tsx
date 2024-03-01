import {
  BottomNavigation,
  BottomNavigationAction,
  Card,
} from "@material-ui/core";
import { Person, ToggleOff, Wallet } from "@mui/icons-material";
import { FC, useContext } from "react";
import AppContext from "../contexts/AppContext";

const BottomNav: FC = () => {
  const { screen, setScreen } = useContext(AppContext)!;

  return (
    <Card style={{ height: "100%", width: "100%" }}>
      <BottomNavigation
        style={{ height: "100%" }}
        value={screen}
        onChange={(_, value) => setScreen(value)}
      >
        <BottomNavigationAction
          label="profile"
          value="profile"
          icon={<Person fontSize="large" />}
        />
        <BottomNavigationAction
          label="wallet"
          value="wallet"
          icon={<Wallet fontSize="large" />}
        />
        <BottomNavigationAction
          label="permissions"
          value="permissions"
          icon={<ToggleOff fontSize="large" />}
        />
      </BottomNavigation>
    </Card>
  );
};

export default BottomNav;

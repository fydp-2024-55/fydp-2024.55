import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import {
  History,
  Person,
  ToggleOff,
  Visibility,
  Wallet,
} from "@mui/icons-material";
import { FC, useContext } from "react";
import AppContext from "../contexts/AppContext";

const BottomNav: FC = () => {
  const { page, setPage } = useContext(AppContext)!;

  return (
    <BottomNavigation
      style={{ marginBottom: 0 }}
      showLabels
      value={page}
      onChange={(_, value) => setPage(value)}
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
      <BottomNavigationAction
        label="history"
        value="history"
        icon={<History fontSize="large" />}
      />
      <BottomNavigationAction
        label="subscribers"
        value="subscribers"
        icon={<Visibility fontSize="large" />}
      />
    </BottomNavigation>
  );
};

export default BottomNav;

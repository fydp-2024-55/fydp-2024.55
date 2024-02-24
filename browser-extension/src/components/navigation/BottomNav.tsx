import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import {
  History,
  Person,
  ToggleOff,
  Visibility,
  Wallet,
} from "@mui/icons-material";
import { FC, useContext } from "react";
import { Page } from "../../types";
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
        label={Page.Profile}
        value={Page.Profile}
        icon={<Person fontSize="large" />}
      />
      <BottomNavigationAction
        label={Page.Wallet}
        value={Page.Wallet}
        icon={<Wallet fontSize="large" />}
      />
      <BottomNavigationAction
        label={Page.Permissions}
        value={Page.Permissions}
        icon={<ToggleOff fontSize="large" />}
      />
      <BottomNavigationAction
        label={Page.History}
        value={Page.History}
        icon={<History fontSize="large" />}
      />
      <BottomNavigationAction
        label={Page.Subscribers}
        value={Page.Subscribers}
        icon={<Visibility fontSize="large" />}
      />
    </BottomNavigation>
  );
};

export default BottomNav;

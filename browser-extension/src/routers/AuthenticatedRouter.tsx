import { FC, useContext, useEffect } from "react";
import AppContext from "../components/contexts/AppContext";
import PermissionsScreen from "../components/screens/PermissionsScreen";
import ProfileScreen from "../components/screens/ProfileScreen";
import WalletScreen from "../components/screens/WalletScreen";
import { Screen } from "../types";

const AuthenticatedPages: Screen[] = ["profile", "wallet", "permissions"];

export const AuthenticatedRouter: FC = () => {
  const { screen, setScreen } = useContext(AppContext)!;

  useEffect(() => {
    if (!AuthenticatedPages.includes(screen)) {
      setScreen(AuthenticatedPages[0]);
    }
  }, [screen, setScreen]);

  switch (screen) {
    case "profile":
      return <ProfileScreen />;

    case "wallet":
      return <WalletScreen />;

    case "permissions":
      return <PermissionsScreen />;

    default:
      return <ProfileScreen />;
  }
};

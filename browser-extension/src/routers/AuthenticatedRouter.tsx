import { FC, useContext, useEffect } from "react";
import AppContext from "../components/contexts/AppContext";
import HistoryScreen from "../components/screens/HistoryScreen";
import PermissionsScreen from "../components/screens/PermissionsScreen";
import ProfileScreen from "../components/screens/ProfileScreen";
import SubscribersScreen from "../components/screens/SubscribersScreen";
import WalletScreen from "../components/screens/WalletScreen";
import { Page } from "../types";

const AuthenticatedPages: Page[] = [
  "profile",
  "wallet",
  "permissions",
  "history",
  "subscribers",
];

export const AuthenticatedRouter: FC = () => {
  const { page, setPage } = useContext(AppContext)!;

  useEffect(() => {
    if (!AuthenticatedPages.includes(page)) {
      setPage(AuthenticatedPages[0]);
    }
  }, [page, setPage]);

  switch (page) {
    case "profile":
      return <ProfileScreen />;

    case "wallet":
      return <WalletScreen />;

    case "permissions":
      return <PermissionsScreen />;

    case "history":
      return <HistoryScreen />;

    case "subscribers":
      return <SubscribersScreen />;

    default:
      return <ProfileScreen />;
  }
};

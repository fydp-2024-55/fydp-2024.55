import { FC, useContext, useEffect } from "react";
import AppContext from "../components/contexts/AppContext";
import HistoryPage from "../components/screens/HistoryPage";
import PermissionsPage from "../components/screens/PermissionsPage";
import ProfilePage from "../components/screens/ProfilePage";
import SubscribersPage from "../components/screens/SubscribersPage";
import WalletPage from "../components/screens/WalletPage";
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
      return <ProfilePage />;

    case "wallet":
      return <WalletPage />;

    case "permissions":
      return <PermissionsPage />;

    case "history":
      return <HistoryPage />;

    case "subscribers":
      return <SubscribersPage />;

    default:
      return <ProfilePage />;
  }
};

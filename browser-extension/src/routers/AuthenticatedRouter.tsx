import { FC, useContext, useEffect } from "react";
import AppContext from "../components/contexts/AppContext";
import HistoryPage from "../components/screens/HistoryPage";
import PermissionsPage from "../components/screens/PermissionsPage";
import ProfilePage from "../components/screens/ProfilePage";
import SubscribersPage from "../components/screens/SubscribersPage";
import WalletPage from "../components/screens/WalletPage";
import { Page } from "../types";

const AuthenticatedPages = [
  Page.Profile,
  Page.Wallet,
  Page.Permissions,
  Page.History,
  Page.Subscribers,
];

export const AuthenticatedRouter: FC = () => {
  const { page, setPage } = useContext(AppContext)!;

  useEffect(() => {
    if (!AuthenticatedPages.includes(page)) {
      setPage(AuthenticatedPages[0]);
    }
  }, [page, setPage]);

  switch (page) {
    case Page.Profile:
      return <ProfilePage />;

    case Page.Wallet:
      return <WalletPage />;

    case Page.Permissions:
      return <PermissionsPage />;

    case Page.History:
      return <HistoryPage />;

    case Page.Subscribers:
      return <SubscribersPage />;

    default:
      return <ProfilePage />;
  }
};

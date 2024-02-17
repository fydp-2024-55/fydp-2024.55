import { CircularProgress } from "@mui/material";
import { FC, useContext, useEffect } from "react";
import { AuthState, Page } from "../types";
import AppContext from "./AppContext";
import BottomNav from "./BottomNav";
import HistoryPage from "./HistoryPage";
import LoginPage from "./LoginPage";
import LogoutButton from "./LogoutButton";
import PermissionsPage from "./PermissionsPage";
import ProfilePage from "./ProfilePage";
import RegistrationPage from "./RegistrationPage";
import SubscribersPage from "./SubscribersPage";
import WalletPage from "./WalletPage";

const AuthenticatedPages = [
  Page.Profile,
  Page.Wallet,
  Page.Permissions,
  Page.History,
  Page.Subscribers,
];

const AuthenticatedRouter: FC = () => {
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

const UnauthenticatedPages = [Page.Login, Page.Registration];

const UnauthenticatedRouter: FC = () => {
  const { page, setPage } = useContext(AppContext)!;

  useEffect(() => {
    if (!UnauthenticatedPages.includes(page)) {
      setPage(UnauthenticatedPages[0]);
    }
  }, [page, setPage]);

  switch (page) {
    case Page.Login:
      return <LoginPage />;

    case Page.Registration:
      return <RegistrationPage />;

    default:
      return <LoginPage />;
  }
};

const AppRouter: FC = () => {
  const { authState } = useContext(AppContext)!;

  switch (authState) {
    case AuthState.Authenticated:
      return (
        <div
          style={{
            height: "100%",
            width: "100%",
            paddingTop: 20,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflowY: "hidden",
            position: "relative",
          }}
        >
          <LogoutButton />
          <AuthenticatedRouter />
          <BottomNav />
        </div>
      );

    case AuthState.Unauthenticated:
      return <UnauthenticatedRouter />;

    default:
      return <CircularProgress />;
  }
};

export default AppRouter;

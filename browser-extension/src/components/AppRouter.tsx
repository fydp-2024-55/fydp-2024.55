import { FC, ReactElement, useContext } from "react";
import { Page } from "../types";
import HistoryPage from "./HistoryPage";
import PermissionsPage from "./PermissionsPage";
import ProfilePage from "./ProfilePage";
import SubscribersPage from "./SubscribersPage";
import WalletPage from "./WalletPage";
import AppContext from "./AppContext";
import LoginPage from "./LoginPage";
import RegistrationPage from "./RegistrationPage";
import LogOutButton from "./LogOutButton";
import BottomNav from "./BottomNav";

const AppRouter: FC = () => {
  const { token, page } = useContext(AppContext)!;

  let pageContent: ReactElement;

  if (token) {
    switch (page) {
      case Page.Profile:
        pageContent = <ProfilePage />;
        break;

      case Page.Wallet:
        pageContent = <WalletPage />;
        break;

      case Page.Permissions:
        pageContent = <PermissionsPage />;
        break;

      case Page.History:
        pageContent = <HistoryPage />;
        break;

      case Page.Subscribers:
        pageContent = <SubscribersPage />;
        break;

      default:
        throw new Error(`Invalid page: ${page}`);
    }

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
        <LogOutButton />
        {pageContent}
        <BottomNav />
      </div>
    );
  }

  switch (page) {
    case Page.Login:
      return <LoginPage />;

    case Page.Registration:
      return <RegistrationPage />;

    default:
      throw new Error(`Invalid page: ${page}`);
  }
};

export default AppRouter;

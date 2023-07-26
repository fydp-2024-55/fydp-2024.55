import { FC } from "react";
import { Page } from "../types";
import HistoryPage from "./HistoryPage";
import PermissionsPage from "./PermissionsPage";
import ProfilePage from "./ProfilePage";
import SubscribersPage from "./SubscribersPage";
import WalletPage from "./WalletPage";

interface Props {
  page: Page;
}

const PageContent: FC<Props> = ({ page }) => {
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
      throw new Error(`Invalid page: ${page}`);
  }
};

export default PageContent;

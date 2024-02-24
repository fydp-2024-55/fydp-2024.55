import { FC, useContext, useEffect } from "react";
import AppContext from "../components/contexts/AppContext";
import LoginPage from "../components/screens/LoginPage";
import RegistrationPage from "../components/screens/RegistrationPage";
import { Page } from "../types";

const UnauthenticatedPages: Page[] = ["sign-in", "sign-up"];

export const UnauthenticatedRouter: FC = () => {
  const { page, setPage } = useContext(AppContext)!;

  useEffect(() => {
    if (!UnauthenticatedPages.includes(page)) {
      setPage(UnauthenticatedPages[0]);
    }
  }, [page, setPage]);

  switch (page) {
    case "sign-in":
      return <LoginPage />;

    case "sign-up":
      return <RegistrationPage />;

    default:
      return <LoginPage />;
  }
};

import { FC, useContext, useEffect } from "react";
import AppContext from "../components/contexts/AppContext";
import SignInScreen from "../components/screens/SignInScreen";
import SignUpScreen from "../components/screens/SignUpScreen";
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
      return <SignInScreen />;

    case "sign-up":
      return <SignUpScreen />;

    default:
      return <SignInScreen />;
  }
};

import { FC, useContext, useEffect } from "react";
import AppContext from "../components/contexts/AppContext";
import SignInScreen from "../components/screens/SignInScreen";
import SignUpScreen from "../components/screens/SignUpScreen";
import { Screen } from "../types";

const UnauthenticatedPages: Screen[] = ["sign-in", "sign-up"];

export const UnauthenticatedRouter: FC = () => {
  const { screen, setScreen } = useContext(AppContext)!;

  useEffect(() => {
    if (!UnauthenticatedPages.includes(screen)) {
      setScreen(UnauthenticatedPages[0]);
    }
  }, [screen, setScreen]);

  switch (screen) {
    case "sign-in":
      return <SignInScreen />;

    case "sign-up":
      return <SignUpScreen />;

    default:
      return <SignInScreen />;
  }
};

import { createContext, FC, ReactNode, useEffect, useState } from "react";
import backendService from "../../services/backend-service";
import storageService from "../../services/storage-service";
import { AuthState, AuthTokenKey, Screen } from "../../types";

interface AppContextType {
  authState: AuthState;
  setAuthState: (authState: AuthState) => void;
  screen: Screen;
  setScreen: (screen: Screen) => void;
}

const AppContext = createContext<AppContextType | null>(null);

interface Props {
  children: ReactNode;
}

export const AppContextProvider: FC<Props> = ({ children }) => {
  const [screen, setScreen] = useState<Screen>("sign-in");
  const [authState, setAuthState] = useState<AuthState>("unknown");

  useEffect(() => {
    const token = storageService.getItem(AuthTokenKey);
    if (token) {
      backendService.setToken(token);
      setAuthState("authenticated");
    } else {
      setAuthState("unauthenticated");
    }
  }, []);

  return (
    <AppContext.Provider value={{ authState, setAuthState, screen, setScreen }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;

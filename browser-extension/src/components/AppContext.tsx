import { createContext, FC, ReactNode, useEffect, useState } from "react";
import persistentStorage from "../utils/persistentStorage";
import client from "../utils/client";
import { AuthState, AuthTokenKey, Page } from "../types";

interface AppContextType {
  authState: AuthState;
  setAuthState: (authState: AuthState) => void;
  page: Page;
  setPage: (page: Page) => void;
}

const AppContext = createContext<AppContextType | null>(null);

interface Props {
  children: ReactNode;
}

export const AppContextProvider: FC<Props> = ({ children }) => {
  const [page, setPage] = useState(Page.Login);
  const [authState, setAuthState] = useState(AuthState.Unknown);

  useEffect(() => {
    const token = persistentStorage.getItem(AuthTokenKey);
    if (token) {
      client.api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setAuthState(AuthState.Authenticated);
    } else {
      setAuthState(AuthState.Unauthenticated);
    }
  }, []);

  return (
    <AppContext.Provider value={{ authState, setAuthState, page, setPage }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;

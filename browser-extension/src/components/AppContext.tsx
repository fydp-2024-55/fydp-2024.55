import { createContext, FC, ReactNode, useEffect, useState } from "react";
import persistentStorage from "../utils/persistent-storage";
import apiClient from "../utils/api-client";
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
      apiClient.setToken(token);
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

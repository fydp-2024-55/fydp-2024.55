import { createContext, FC, ReactNode, useEffect, useState } from "react";

import backendService from "../services/backend-service";
import { AuthTokenKey, Consumer } from "../types";

interface AppContextType {
  isAuthenticated?: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  account?: Consumer;
  setAccount: (consumer: Consumer) => void;
}

const AppContext = createContext<AppContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  setAccount: () => {},
});

export const AppContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
  const [account, setAccount] = useState<Consumer | undefined>();

  useEffect(() => {
    const token = localStorage.getItem(AuthTokenKey);
    if (token) {
      backendService.setToken(token);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, account, setAccount }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;

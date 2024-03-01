import { createContext, FC, ReactNode, useEffect, useState } from "react";

import { AuthTokenKey, Consumer } from "../types";
import backendService from "../services/backend-service";

interface AppContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  isWalletSetup: boolean;
  setIsWalletSetup: (isWalletSetup: boolean) => void;
  account?: Consumer;
  setAccount: (consumer: Consumer) => void;
}

const AppContext = createContext<AppContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  isWalletSetup: false,
  setIsWalletSetup: () => {},
  setAccount: () => {},
});

export const AppContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isWalletSetup, setIsWalletSetup] = useState<boolean>(false);
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
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isWalletSetup,
        setIsWalletSetup,
        account,
        setAccount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;

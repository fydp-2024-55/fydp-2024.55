import { createContext, FC, ReactNode, useState } from "react";
import { Page } from "../types";

interface AppContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  page: Page;
  setPage: (page: Page) => void;
}

const AppContext = createContext<AppContextType | null>(null);

interface Props {
  children: ReactNode;
}

export const AppContextProvider: FC<Props> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [page, setPage] = useState(Page.Login);

  return (
    <AppContext.Provider value={{ token, setToken, page, setPage }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;

import React, { createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Visibility, ShoppingCart, Person, Logout } from "@mui/icons-material";

import { Page, Consumer } from "./types";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Purchase from "./pages/Purchase";
import Subscriptions from "./pages/Subscriptions";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";
import { DrawerItem } from "./components/PermanentDrawer";

const topDrawerItems: DrawerItem[] = [
  {
    text: Page.Subscriptions,
    element: <Visibility />,
    href: "/",
  },
  {
    text: Page.Purchase,
    element: <ShoppingCart />,
    href: "/purchase",
  },
];
const bottomDrawerItems: DrawerItem[] = [
  {
    text: Page.Profile,
    element: <Person />,
    href: "/profile",
  },
  {
    text: "Logout",
    element: <Logout />,
    href: "/signin",
    onClick: () => {
      console.log("Logging out");
    },
  },
];

const mockAccount: Consumer = {
  name: "William Park",
  email: "william@gmail.com",
  ethAddress: "0x1234567890",
};

interface GlobalContextInterface {
  account: Consumer;
  setAccount: React.Dispatch<React.SetStateAction<Consumer>>;
}
export const GlobalContext = createContext<GlobalContextInterface>({
  account: mockAccount,
  setAccount: () => {},
});

const App: React.FC = () => {
  const [account, setAccount] = React.useState<Consumer>(mockAccount);

  return (
    <GlobalContext.Provider value={{ account, setAccount }}>
      <Router>
        <Routes>
          <Route
            element={
              <Layout
                title="FYDP"
                topDrawerItems={topDrawerItems}
                bottomDrawerItems={bottomDrawerItems}
              />
            }
          >
            <Route path="/" element={<Subscriptions />} />
            <Route path="/purchase" element={<Purchase />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </GlobalContext.Provider>
  );
};

export default App;

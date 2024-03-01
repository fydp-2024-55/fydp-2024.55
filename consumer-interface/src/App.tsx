import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AppContext from "./contexts/AppContext";
import { Consumer } from "./types";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
// import Purchase from "./pages/Purchase";
import Subscriptions from "./pages/Subscriptions";
import Profile from "./pages/Profile";

const mockAccount: Consumer = {
  email: "william@gmail.com",
  ethAddress: "0x1234567890",
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [account, setAccount] = React.useState<Consumer>(mockAccount);

  return (
    <AppContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, account, setAccount }}
    >
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Subscriptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/purchase"
            element={
              <ProtectedRoute>
                <div>Purchase</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
};

export default App;

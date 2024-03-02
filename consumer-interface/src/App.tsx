import { FC } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AppContextProvider } from "./contexts/AppContext";
import ProtectedRoute from "./routers/ProtectedRoute";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Subscriptions from "./pages/Subscriptions";
import WalletSetup from "./pages/WalletSetup";
import Purchase from "./pages/Purchase";
import Profile from "./pages/Profile";

const App: FC = () => {
  return (
    <AppContextProvider>
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
          <Route path="/wallet-setup" element={<WalletSetup />} />
          <Route
            path="/purchase"
            element={
              <ProtectedRoute>
                <Purchase />
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
    </AppContextProvider>
  );
};

export default App;

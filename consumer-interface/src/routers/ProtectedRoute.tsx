import { FC, ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";

import AppContext from "../contexts/AppContext";
import Layout from "../components/Layout";

export const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useContext(AppContext)!;

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }
  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;

import { FC, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { Visibility, ShoppingCart, Person, Logout } from "@mui/icons-material";

import { Page } from "../types";
import backendService from "../services/backend-service";
import PermanentDrawer, { DrawerItem } from "./PermanentDrawer";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

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
        backendService.logOut();
        navigate("/signin");
      },
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <PermanentDrawer
        title="ByteBucks"
        topDrawerItems={topDrawerItems}
        bottomDrawerItems={bottomDrawerItems}
      />
      {children}
    </Box>
  );
};

export default Layout;

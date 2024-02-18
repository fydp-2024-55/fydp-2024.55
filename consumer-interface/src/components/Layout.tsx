import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import PermanentDrawer, { PermanentDrawerProps } from "./PermanentDrawer";

const Layout: React.FC<PermanentDrawerProps> = (props) => {
  return (
    <Box sx={{ display: "flex" }}>
      <PermanentDrawer {...props} />
      <Outlet />
    </Box>
  );
};

export default Layout;

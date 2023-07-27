import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  CssBaseline,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

const drawerWidth = 240;

export interface DrawerItem {
  text: string;
  element: JSX.Element;
  href?: string;
  onClick?: () => void;
}

export interface PermanentDrawerProps {
  title: string;
  topDrawerItems: DrawerItem[];
  bottomDrawerItems: DrawerItem[];
}

const DrawerItemComponent: React.FC<DrawerItem> = ({
  text,
  element,
  href,
  onClick,
}) => {
  const navigate = useNavigate();

  return (
    <ListItem
      key={text}
      disablePadding
      onClick={() => {
        if (onClick) {
          onClick();
        }
        if (href) {
          navigate(href);
        }
      }}
    >
      <ListItemButton>
        <ListItemIcon>{element}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
};

const PermanentDrawer: React.FC<PermanentDrawerProps> = ({
  title,
  topDrawerItems,
  bottomDrawerItems,
}) => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100vh",
          }}
        >
          <Box>
            <Toolbar sx={{ m: 1 }}>
              <Link
                to="/"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                <Typography variant="h5" align="center" sx={{ my: 2 }}>
                  {title}
                </Typography>
              </Link>
            </Toolbar>
            <Divider />
            <List>
              {topDrawerItems.map((item) => (
                <DrawerItemComponent key={item.text} {...item} />
              ))}
            </List>
          </Box>
          <Box>
            <Divider />
            <List>
              {bottomDrawerItems.map((item) => (
                <DrawerItemComponent key={item.text} {...item} />
              ))}
            </List>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default PermanentDrawer;

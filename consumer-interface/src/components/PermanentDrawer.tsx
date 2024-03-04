import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  CssBaseline,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import ByteBucksLogo from "../images/bytebucks-logo.png";

const drawerWidth = 200;

export interface DrawerItem {
  text: string;
  element: JSX.Element;
  href?: string;
  onClick?: () => void;
}

export interface PermanentDrawerProps {
  topDrawerItems: DrawerItem[];
  bottomDrawerItems: DrawerItem[];
}

const DrawerItemComponent: FC<DrawerItem> = ({
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
  topDrawerItems,
  bottomDrawerItems,
}) => {
  return (
    <Box>
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
            backgroundColor: "#f5f5f5",
          }}
        >
          <Box>
            <Link
              to="/"
              style={{ color: "inherit", textDecoration: "inherit" }}
            >
              <img src={ByteBucksLogo} alt="ByteBucks" width="100%" />
            </Link>
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

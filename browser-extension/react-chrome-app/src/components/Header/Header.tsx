import React from "react";
import "./Header.css";
import Nav from "react-bootstrap/Nav";
import { Tab, Tabs } from "@material-ui/core";

interface HeaderProps {
  changePage: (p: string) => void;
  page: string;
}

const Header: React.FC<HeaderProps> = ({ changePage, page }) => {
  return (
    <Tabs
      style={{ width: 450 }}
      centered
      value={page}
      onChange={(_, value) => changePage(value)}
    >
      <Tab value="user" label="Profile" />
      <Tab value="data" label="Setting" />
      <Tab value="wallet" label="Wallet" />
    </Tabs>
  );
};

export default Header;

import { useState } from "react";
import BottomNav from "./components/BottomNav";
import LoginPage from "./components/LoginPage";
import PageContent from "./components/PageContent";
import { Page } from "./types";
import LogoutButton from "./components/LogoutButton";

const App = () => {
  const [page, setPage] = useState(Page.Profile);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <div
      style={{
        height: 550,
        width: 450,
        background: "azure",
        display: "flex",
        flexDirection: "column",
        borderWidth: 5,
        borderColor: "black",
        borderStyle: "solid",
        alignItems: "center",
      }}
    >
      {!isLoggedIn ? (
        <LoginPage onLogIn={() => setIsLoggedIn(true)} />
      ) : (
        <div
          style={{
            height: "100%",
            width: "100%",
            paddingTop: 20,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflowY: "hidden",
            position: "relative",
          }}
        >
          <LogoutButton onLogout={() => setIsLoggedIn(false)} />
          <PageContent page={page} />
          <BottomNav page={page} setPage={setPage} />
        </div>
      )}
    </div>
  );
};

export default App;

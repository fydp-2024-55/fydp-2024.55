import Header from "./components/Header/Header";
import UserPage from "./components/UserPage/UserPage";
import DataPage from "./components/DataPage/DataPage";
import Login from "./components/LoginPage/LoginPage";
import { useState, useEffect } from "react";
import "./App.css";
import data from "./sample.json";
import WalletPage from "./components/WalletPage/WalletPage";

const App = () => {
  useEffect(() => {
    loadUser();
  }, []); // Pass an empty array to only call the function once on mount.

  const [page, setPage] = useState("user");
  const [dataOpt, setDataOpt] = useState(data.data_options);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const changePage = (p: string) => {
    setPage(p);
  };

  const loginUser = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
  };

  const updateValue = (key: string) => {
    setDataOpt((prevState) => ({
      ...prevState,
      [key]: !prevState[key as keyof typeof prevState],
    }));
    console.log(dataOpt);
  };

  function loadUser() {}

  return (
    <div className="browserContainer">
      {!(username !== "" && password !== "") ? (
        <Login loginUser={loginUser} />
      ) : (
        <>
          <div className="row">
            {page === "user" && (
              <UserPage
                username={data.username}
                phone={data.phone}
                first_name={data.first_name}
                last_name={data.last_name}
                email={data.email}
              />
            )}
            {page === "data" && (
              <DataPage updateValue={updateValue} options={dataOpt} />
            )}
            {page === "wallet" && <WalletPage balance={data.wallet} />}
          </div>
          <Header changePage={changePage} />
        </>
      )}
    </div>
  );
};

export default App;

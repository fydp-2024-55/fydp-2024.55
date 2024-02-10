import { AppContextProvider } from "./components/AppContext";
import AppRouter from "./components/AppRouter";

const App = () => {
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
      <AppContextProvider>
        <AppRouter />
      </AppContextProvider>
    </div>
  );
};

export default App;

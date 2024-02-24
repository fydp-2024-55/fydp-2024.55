import { AppContextProvider } from "./components/contexts/AppContext";
import AppRouter from "./routers/AppRouter";

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

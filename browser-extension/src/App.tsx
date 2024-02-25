import { AppContextProvider } from "./components/contexts/AppContext";
import AppRouter from "./routers/AppRouter";

const App = () => {
  return (
    <AppContextProvider>
      <AppRouter />
    </AppContextProvider>
  );
};

export default App;

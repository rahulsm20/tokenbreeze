import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Payments from "./pages/Payments";
import { ConnectKitProvider } from "connectkit";
import { useTheme } from "./components/theme-provider";

function App() {
  const { connectTheme } = useTheme();
  return (
    <ConnectKitProvider theme={connectTheme}>
      <Routes>
        <Route path="/prices" element={<Home />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="*" element={<Navigate to={"/prices"} />} />
      </Routes>
    </ConnectKitProvider>
  );
}

export default App;

import { ConnectKitProvider } from "connectkit";
import { Navigate, Route, Routes } from "react-router-dom";
import { useTheme } from "./components/theme-provider";
import Home from "./pages/Home";
import Landing from "./pages/Landing";

function App() {
  const { connectTheme } = useTheme();
  return (
    <ConnectKitProvider theme={connectTheme}>
      <Routes>
        <Route path="/prices" element={<Home />} />
        {/* <Route path="/payments" element={<Payments />} /> */}
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Navigate to={"/prices"} />} />
      </Routes>
    </ConnectKitProvider>
  );
}

export default App;

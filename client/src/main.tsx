import { ApolloProvider } from "@apollo/client";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { WagmiProvider } from "wagmi";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { config } from "./components/wallet/index.ts";
import { client } from "./graphql/client.ts";
import "./index.css";
import store from "./store/index.ts";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <Provider store={store}>
              <App />
            </Provider>
            <Toaster />
          </QueryClientProvider>
        </WagmiProvider>
      </ThemeProvider>
    </BrowserRouter>
  </ApolloProvider>
);

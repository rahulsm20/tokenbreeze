// import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { getDefaultConfig } from "connectkit";
import { arbitrum, base, mainnet, optimism, polygon } from "viem/chains";
import { createConfig } from "wagmi";

export const config = createConfig(
  getDefaultConfig({
    appName: "TokenBreeze",
    walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_ID || "",
    chains: [mainnet, polygon, optimism, arbitrum, base],
    appDescription: "TokenBreeze is a decentralized exchange aggregator.",
    appIcon: "/waves.svg",
  })
);

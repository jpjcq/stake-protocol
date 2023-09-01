import React from "react";
import ReactDOM from "react-dom/client";
import ThemeProvider, { GlobalStyles } from "./theme/index.tsx";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import "@rainbow-me/rainbowkit/styles.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/index.tsx";
import ReactModal from "react-modal";

const { chains, publicClient } = configureChains(
  [bscTestnet],
  [
    alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_ID }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Stake Protocol",
  projectId: "STAKE_ID",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

ReactModal.setAppElement("#root");

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <ThemeProvider>
          <GlobalStyles />
          <RouterProvider router={router} />
        </ThemeProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);

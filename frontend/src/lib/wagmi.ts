import { http, createConfig } from "wagmi";
import { injected } from "@wagmi/core";
import { metaMask } from "@wagmi/connectors";
import { QueryClient } from "@tanstack/react-query";
import type { Chain } from "wagmi/chains";
import { MICROMINT_L3 } from "./config";

export const micromintChain: Chain = {
  id: MICROMINT_L3.id,
  name: MICROMINT_L3.name,
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [MICROMINT_L3.rpcUrl] },
    public: { http: [MICROMINT_L3.rpcUrl] },
  },
};

export const wagmiConfig = createConfig({
  // Add connectors so `useConnect()` in the UI can find the injected connector (MetaMask)
  connectors: [metaMask(), injected()],
  chains: [micromintChain],
  transports: {
    [micromintChain.id]: http(MICROMINT_L3.rpcUrl),
  },
});

export const queryClient = new QueryClient();

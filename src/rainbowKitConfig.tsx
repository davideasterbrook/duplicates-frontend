"use client"

import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { anvil, mainnet, sepolia } from "wagmi/chains"

// Validate required environment variables
if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is required. Please add it to your .env.local file.');
}

// Use explicit chain arrays with proper typing
const developmentChains = [anvil, mainnet, sepolia] as const;
const productionChains = [mainnet] as const;

export default getDefaultConfig({
    chains: process.env.NODE_ENV === 'development' ? developmentChains : productionChains,
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    appName: "Duplicates Web",
    ssr: false,
    multiInjectedProviderDiscovery: true,
});

// Custom theme matching the site design
export const customTheme = {
  accentColor: '#a855f7', // Purple-500 to match site
  accentColorForeground: '#ffffff',
  borderRadius: 'medium' as const,
  fontStack: 'system' as const,
  overlayBlur: 'small' as const,
}
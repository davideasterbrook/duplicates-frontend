"use client"

import { type ReactNode, useState, useMemo, useEffect } from "react"
import { customTheme } from "@/rainbowKitConfig"
import { RainbowKitProvider, darkTheme, getDefaultConfig } from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { anvil, mainnet, sepolia } from "wagmi/chains"
import "@rainbow-me/rainbowkit/styles.css"

export function Providers(props: {children: ReactNode}) {
    const [queryClient] = useState(() => new QueryClient())
    const [mounted, setMounted] = useState(false)
    
    useEffect(() => {
        setMounted(true)
    }, [])

    
    // Create config only on client side to prevent SSR issues
    const config = useMemo(() => {
        if (!mounted || !process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
            return null;
        }
        
        const developmentChains = [anvil, mainnet, sepolia] as const;
        const productionChains = [mainnet] as const;
        
        const appUrl = process.env.NODE_ENV === 'development' 
            ? "http://localhost:3000" 
            : "https://duplicates.knownblock.com";
            
        return getDefaultConfig({
            chains: process.env.NODE_ENV === 'development' ? developmentChains : productionChains,
            projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
            appName: "Duplicates NFT",
            appDescription: "NFT minting and management platform for creating duplicates of existing NFTs",
            appUrl: appUrl,
            appIcon: `${appUrl}/favicon.svg`, 
            ssr: false,
        });
    }, [mounted]);

    // Don't render until mounted and config is ready
    if (!mounted || !config) {
        return <div>{props.children}</div>
    }

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    theme={darkTheme(customTheme)}
                    modalSize="compact"
                    showRecentTransactions={false}
                >
                    {props.children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
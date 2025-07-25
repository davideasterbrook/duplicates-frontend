"use client"

import { useEffect, useState } from "react";
import MintingForm from "@/components/MintingForm";
import MintedTokens from "@/components/MintedTokens";
import Inspiration from "@/components/Inspiration";
import Header from "@/components/Header";
import { InspirationNft } from "@/data/inspirationNfts";

type TabType = 'mint' | 'minted' | 'inspiration';

export default function HomeContent() {
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('mint');
    const [selectedInspirationNft, setSelectedInspirationNft] = useState<{
        contractAddress: string;
        tokenId: string;
        nft: InspirationNft;
    } | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleInspirationSelect = (contractAddress: string, tokenId: string, nft: InspirationNft) => {
        setSelectedInspirationNft({ contractAddress, tokenId, nft });
        setActiveTab('mint');
    };

    const handleDuplicateSelect = (contractAddress: string, tokenId: string) => {
        setSelectedInspirationNft({ contractAddress, tokenId, nft: null as any });
        setActiveTab('mint');
    };

    if (!mounted) {
        return null; // or a loading spinner
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
            <Header activeTab={activeTab} onTabChange={setActiveTab} />
            <main className="flex-1">
                {activeTab === 'mint' && (
                    <MintingForm 
                        prefilledContract={selectedInspirationNft?.contractAddress}
                        prefilledTokenId={selectedInspirationNft?.tokenId}
                        inspirationNft={selectedInspirationNft?.nft}
                    />
                )}
                {activeTab === 'minted' && <MintedTokens onNavigateToMint={handleDuplicateSelect} />}
                {activeTab === 'inspiration' && <Inspiration onSelectNft={handleInspirationSelect} />}
            </main>
        </div>
    )
}

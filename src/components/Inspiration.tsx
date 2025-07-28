"use client"

import { useState } from "react";
import { inspirationCollections, InspirationCollection, InspirationNft } from "@/data/inspirationNfts";
import { ImageWithFallback } from "@/components/UI/ImageWithFallback";

interface InspirationProps {
  onSelectNft?: (contractAddress: string, tokenId: string, nft: InspirationNft) => void;
}

export default function Inspiration({ onSelectNft }: InspirationProps) {
  const [selectedCollection, setSelectedCollection] = useState<InspirationCollection | null>(null);
  const [selectedNft, setSelectedNft] = useState<InspirationNft | null>(null);

  const handleNftClick = (nft: InspirationNft, collection: InspirationCollection) => {
    setSelectedNft(nft);
    if (onSelectNft) {
      onSelectNft(collection.contractAddress, nft.tokenId, nft);
    }
  };

  const handleBackToCollections = () => {
    setSelectedCollection(null);
    setSelectedNft(null);
  };

  const handleBackToNfts = () => {
    setSelectedNft(null);
  };

  if (selectedNft && selectedCollection) {
    // NFT Detail View
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto p-6 pt-12">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={handleBackToNfts}
              className="flex items-center text-gray-400 hover:text-white transition-colors mr-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Collection
            </button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {selectedNft.name}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* NFT Image */}
            <div className="space-y-6">
              <div className="relative w-full h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
                <ImageWithFallback
                  src={selectedNft.image}
                  alt={selectedNft.name}
                  className="w-full h-full"
                  preserveAspectRatio={true}
                  priority={true}
                />
              </div>
            </div>

            {/* NFT Details */}
            <div className="space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-4">{selectedNft.name}</h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-purple-400">Collection:</span>
                    <span className="text-gray-300 ml-2">{selectedCollection.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-purple-400">Token ID:</span>
                    <span className="text-gray-300 ml-2">{selectedNft.tokenId}</span>
                  </div>
                  <div>
                    <span className="font-medium text-purple-400">Contract:</span>
                    <span className="text-gray-300 ml-2 font-mono text-sm">
                      {selectedCollection.contractAddress.slice(0, 6)}...{selectedCollection.contractAddress.slice(-4)}
                    </span>
                  </div>
                  {selectedNft.rarity && (
                    <div>
                      <span className="font-medium text-purple-400">Rarity:</span>
                      <span className="text-gray-300 ml-2">{selectedNft.rarity}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-purple-400">Description:</span>
                    <p className="text-gray-300 mt-1">{selectedNft.staticMetadata.description}</p>
                  </div>
                </div>
              </div>

              {/* Attributes */}
              {selectedNft.staticMetadata.attributes && selectedNft.staticMetadata.attributes.length > 0 && (
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                  <h3 className="font-bold text-white mb-4 text-lg">Attributes</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedNft.staticMetadata.attributes.map((attr, index) => (
                      <div 
                        key={index}
                        className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-3 rounded-lg border border-purple-500/30"
                      >
                        <div className="text-purple-300 text-sm font-medium">{attr.trait_type}</div>
                        <div className="text-white font-bold">{attr.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={() => onSelectNft?.(selectedCollection.contractAddress, selectedNft.tokenId, selectedNft)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-purple-500/25"
                >
                  Use for Dupe Mint
                </button>
                
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href={`https://etherscan.io/address/${selectedCollection.contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Etherscan
                  </a>
                  <a
                    href={`https://opensea.io/assets/ethereum/${selectedCollection.contractAddress}/${selectedNft.tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    OpenSea
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCollection) {
    // Collection NFTs View
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto p-6 pt-12">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={handleBackToCollections}
              className="flex items-center text-gray-400 hover:text-white transition-colors mr-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Collections
            </button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {selectedCollection.name}
              </h1>
              <p className="text-gray-400 mt-2">{selectedCollection.description}</p>
            </div>
          </div>

          {/* Collection Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700">
              <div className="text-sm text-gray-400">Total Supply</div>
              <div className="text-lg font-bold text-white">{selectedCollection.totalSupply}</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700">
              <div className="text-sm text-gray-400">Blockchain</div>
              <div className="text-lg font-bold text-white capitalize">{selectedCollection.chain}</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700">
              <div className="text-sm text-gray-400">Contract</div>
              <div className="text-lg font-bold text-white font-mono text-sm">
                {selectedCollection.contractAddress.slice(0, 6)}...{selectedCollection.contractAddress.slice(-4)}
              </div>
            </div>
          </div>

          {/* NFTs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {selectedCollection.nfts.map((nft) => (
              <div
                key={nft.tokenId}
                onClick={() => handleNftClick(nft, selectedCollection)}
                className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group hover:scale-105"
              >
                <div className="relative w-full h-48 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg overflow-hidden mb-4">
                  <ImageWithFallback
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-full"
                    preserveAspectRatio={true}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2 truncate">{nft.name}</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Token ID</span>
                      <span className="text-gray-300">#{nft.tokenId}</span>
                    </div>
                    {nft.rarity && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Rarity</span>
                        <span className="text-purple-400">{nft.rarity}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Collections Overview
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-7xl mx-auto p-6 pt-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
            NFT Inspiration
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover the most valuable and iconic NFTs from top collections. 
            Click on any collection to explore their featured pieces and use them as inspiration for your Dupe mints.
          </p>
        </div>


        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {inspirationCollections.map((collection) => (
              <div
                key={collection.contractAddress}
                onClick={() => setSelectedCollection(collection)}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10"
              >
                {/* Collection Preview Images */}
                <div className="grid grid-cols-3 gap-2 mb-6 h-32">
                  {collection.nfts.slice(0, 3).map((nft, _index) => (
                    <div key={nft.tokenId} className="relative bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={nft.image}
                        alt={nft.name}
                        className="w-full h-full object-cover"
                        preserveAspectRatio={false}
                      />
                    </div>
                  ))}
                </div>

                {/* Collection Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                      {collection.name}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3">
                      {collection.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Supply</div>
                      <div className="text-sm font-bold text-white">{collection.totalSupply}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Chain</div>
                      <div className="text-sm font-bold text-white capitalize">{collection.chain}</div>
                    </div>
                  </div>

                  {/* Featured NFTs Count */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{collection.nfts.length} featured NFTs</span>
                    <span className="flex items-center text-purple-400 group-hover:text-purple-300">
                      Explore
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl border border-purple-500/20">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Create Your Dupe?</h2>
          <p className="text-gray-400 mb-6">
            Found an NFT that inspires you? Head over to the Mint tab to create your own Dupe version!
          </p>
          <div className="text-sm text-gray-500">
            💡 Tip: Click on any NFT to automatically fill the mint form with its contract address and token ID.
          </div>
        </div>
      </div>
    </div>
  );
}
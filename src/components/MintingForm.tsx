"use client"

import { useState, useEffect, useCallback } from "react";
import { useAccount, useConfig } from "wagmi";
import { readContract, writeContract, waitForTransactionReceipt } from "@wagmi/core";
import InputField from "@/components/UI/InputField";
import ErrorPopup from "@/components/UI/ErrorPopup";
import { erc721Abi } from "@/app/constants";
import { duplicatesAbi } from "@/app/duplicatesAbi";
import { 
  fetchFromIpfs, 
  extractImageFromMetadata, 
  sanitizeImageUrl, 
  // isBase64Image 
} from "@/utils/ipfs";
import { 
  AppError, 
  parseContractError, 
  parseIpfsError, 
  logError, 
  isValidEthereumAddress,
  isValidTokenId, 
  createUserError 
} from "@/utils/errorHandling";
import { ImageWithFallback } from "@/components/UI/ImageWithFallback";
import { useNftMinterContract } from "@/hooks/useContract";
import { InspirationNft, getAllInspirationNfts } from "@/data/inspirationNfts";

interface NFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  image_url?: string;
  imageUrl?: string;
  animation_url?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

// Helper function to get block explorer URL based on chain
function getExplorerUrl(chainId?: number): string | null {
  switch (chainId) {
    case 1: return 'https://etherscan.io/';
    case 11155111: return 'https://sepolia.etherscan.io/';
    case 31337: return null; // Local chain has no block explorer
    default: return 'https://etherscan.io/';
  }
}

interface MintingFormProps {
  prefilledContract?: string;
  prefilledTokenId?: string;
  inspirationNft?: InspirationNft;
}

export default function MintingForm({ prefilledContract, prefilledTokenId, inspirationNft }: MintingFormProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const account = useAccount();
  const { isConnected, address: userAddress, status } = account;
  const config = useConfig();
  
  // Duplicates contract configuration (YOUR contract that will mint copies)
  const { 
    contractAddress: duplicatesContractAddress, 
    isReady: duplicatesContractReady, 
    error: duplicatesContractError,
    chainConfig 
  } = useNftMinterContract();
  
  // Form state - SOURCE NFT to copy
  const [sourceContractAddress, setSourceContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  
  // NFT state
  const [nftMetadata, setNftMetadata] = useState<NFTMetadata | null>(null);
  const [nftImageUrl, setNftImageUrl] = useState("");
  const [isLoadingNft, setIsLoadingNft] = useState(false);
  
  // Minting state
  const [isMinting, setIsMinting] = useState(false);
  const [mintTxHash, setMintTxHash] = useState<string | null>(null);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [mintingCost, setMintingCost] = useState<bigint | null>(null);
  
  // Error state
  const [error, setError] = useState<AppError | null>(null);
  const [inlineError, setInlineError] = useState<string | null>(null);
  
  // Use inspiration NFTs directly for rotation when disconnected
  const inspirationNfts = getAllInspirationNfts();
  const [currentNftIndex, setCurrentNftIndex] = useState(0);
  const [nextNftIndex, setNextNftIndex] = useState(1);
  const [isCurrentImageLoaded, setIsCurrentImageLoaded] = useState(false);
  const [isNextImageLoaded, setIsNextImageLoaded] = useState(false);
  const [showingCurrent, setShowingCurrent] = useState(true);
  
  // Generate random order for inspiration NFTs
  const [randomOrder, setRandomOrder] = useState<number[]>([]);
  
  useEffect(() => {
    if (inspirationNfts.length > 0) {
      // Create shuffled array of indices
      const indices = Array.from({ length: inspirationNfts.length }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      setRandomOrder(indices);
      setCurrentNftIndex(0);
      setNextNftIndex(1);
    }
  }, [inspirationNfts.length]);
  
  // Rotate through inspiration NFTs in random order with smooth transitions
  useEffect(() => {
    if (!isConnected && randomOrder.length > 0) {
      const interval = setInterval(() => {
        // Only transition if next image is loaded
        if (isNextImageLoaded) {
          setShowingCurrent(false);
          
          // After a brief transition, update indices
          setTimeout(() => {
            setCurrentNftIndex(nextNftIndex);
            setNextNftIndex((nextNftIndex + 1) % randomOrder.length);
            setIsCurrentImageLoaded(isNextImageLoaded);
            setIsNextImageLoaded(false);
            setShowingCurrent(true);
          }, 150); // Short transition time
        }
      }, 4000); // 4 seconds per NFT
      
      return () => clearInterval(interval);
    }
  }, [isConnected, randomOrder.length, nextNftIndex, isNextImageLoaded]);

  const currentInspirationNft = randomOrder.length > 0 ? inspirationNfts[randomOrder[currentNftIndex]] || null : null;
  const nextInspirationNft = randomOrder.length > 0 ? inspirationNfts[randomOrder[nextNftIndex]] || null : null;
  
  // Set prefilled values from inspiration
  useEffect(() => {
    if (prefilledContract && prefilledTokenId) {
      setSourceContractAddress(prefilledContract);
      setTokenId(prefilledTokenId);
      
      // If we have inspiration NFT metadata, use it
      if (inspirationNft) {
        setNftMetadata({
          name: inspirationNft.name,
          description: inspirationNft.staticMetadata.description,
          image: inspirationNft.image,
          attributes: inspirationNft.staticMetadata.attributes
        });
        setNftImageUrl(inspirationNft.image);
      }
    }
  }, [prefilledContract, prefilledTokenId, inspirationNft]);
  
  // Clear NFT data when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      setNftMetadata(null);
      setNftImageUrl("");
      // Don't clear prefilled values if they exist
      if (!prefilledContract) {
        setSourceContractAddress("");
      }
      if (!prefilledTokenId) {
        setTokenId("");
      }
      setMintingCost(null);
    }
  }, [isConnected, prefilledContract, prefilledTokenId]);

  // Fetch minting cost when contract is ready
  useEffect(() => {
    const fetchMintingCost = async () => {
      if (duplicatesContractReady && duplicatesContractAddress) {
        try {
          const cost = await readContract(config, {
            abi: duplicatesAbi,
            address: duplicatesContractAddress,
            functionName: "minting_cost",
            args: [],
          });
          setMintingCost(cost);
        } catch {
          setMintingCost(null);
        }
      } else {
        setMintingCost(null);
      }
    };

    fetchMintingCost();
  }, [duplicatesContractReady, duplicatesContractAddress, config]);
  
  // Validate inputs for SOURCE NFT (to copy from)
  const isValidInputs = useCallback((showInline = false) => {
    if (!sourceContractAddress.trim()) {
      const errorMsg = "Please enter a source contract address";
      if (showInline) {
        setInlineError(errorMsg);
      } else {
        setError(createUserError(errorMsg));
      }
      return false;
    }
    
    if (!isValidEthereumAddress(sourceContractAddress.trim())) {
      const errorMsg = "Please enter a valid Ethereum contract address";
      if (showInline) {
        setInlineError(errorMsg);
      } else {
        setError(createUserError(errorMsg));
      }
      return false;
    }
    
    if (!tokenId.trim()) {
      const errorMsg = "Please enter a token ID";
      if (showInline) {
        setInlineError(errorMsg);
      } else {
        setError(createUserError(errorMsg));
      }
      return false;
    }
    
    if (!isValidTokenId(tokenId.trim())) {
      const errorMsg = "Please enter a valid token ID (non-negative integer)";
      if (showInline) {
        setInlineError(errorMsg);
      } else {
        setError(createUserError(errorMsg));
      }
      return false;
    }
    
    return true;
  }, [sourceContractAddress, tokenId]);
  
  // Check if contract supports tokenURI function
  const validateTokenUriSupport = useCallback(async (contractAddress: string, tokenId: string): Promise<boolean> => {
    try {
      // Try to call tokenURI function - this will fail if the function doesn't exist or token doesn't exist
      await readContract(config, {
        abi: erc721Abi,
        address: contractAddress as `0x${string}`,
        functionName: "tokenURI",
        args: [BigInt(tokenId)],
      });
      return true;
    } catch (error: unknown) {
      // Check if it's a "function does not exist" error vs "token doesn't exist" error
      const errorMessage = error instanceof Error ? error.message : '';
      if (errorMessage.includes('function selector was not recognized') ||
          errorMessage.includes('function does not exist') ||
          errorMessage.includes('execution reverted: ERC721: invalid token ID') ||
          errorMessage.includes('ERC721NonexistentToken') ||
          errorMessage.includes('token does not exist')) {
        
        // More specific error messages
        if (errorMessage.includes('function selector was not recognized') ||
            errorMessage.includes('function does not exist')) {
          setInlineError("This contract does not support the tokenURI function. It may not be a standard ERC721 NFT contract.");
        } else {
          setInlineError("Token ID does not exist in this contract. Please check the token ID and try again.");
        }
        return false;
      }
      
      // For other errors (network issues, etc), we'll let the main fetch handle them
      return true;
    }
  }, [config]);
  
  // Fetch NFT metadata from SOURCE contract (to copy)
  const fetchNftMetadata = useCallback(async () => {
    if (!isValidInputs()) return;
    
    setIsLoadingNft(true);
    setNftMetadata(null);
    setNftImageUrl("");
    setInlineError(null);
    
    const contractAddress = sourceContractAddress.trim();
    const tokenIdValue = tokenId.trim();
    
    try {
      // First validate that the contract supports tokenURI
      const isValidContract = await validateTokenUriSupport(contractAddress, tokenIdValue);
      if (!isValidContract) {
        setIsLoadingNft(false);
        return;
      }
      
      
      // Call tokenURI function on SOURCE contract
      const tokenUri = await readContract(config, {
        abi: erc721Abi,
        address: contractAddress as `0x${string}`,
        functionName: "tokenURI",
        args: [BigInt(tokenIdValue)],
      });
      
      
      if (!tokenUri || typeof tokenUri !== 'string') {
        setInlineError("Token URI is empty or invalid. This NFT may not have proper metadata.");
        return;
      }
      
      let metadata: NFTMetadata;
      
      // Handle base64 encoded JSON
      if (tokenUri.startsWith('data:application/json;base64,')) {
        const base64Data = tokenUri.replace('data:application/json;base64,', '');
        const decodedData = atob(base64Data);
        metadata = JSON.parse(decodedData);
      }
      // Handle direct JSON string (rare but possible)
      else if (tokenUri.startsWith('{')) {
        metadata = JSON.parse(tokenUri);
      }
      // Handle IPFS or HTTP URLs
      else {
        metadata = await fetchFromIpfs(tokenUri);
      }
      
      if (!metadata || typeof metadata !== 'object') {
        setInlineError("Invalid metadata format. This NFT's metadata cannot be processed.");
        return;
      }
      
      setNftMetadata(metadata);
      
      // Extract and process image URL
      const imageUrl = extractImageFromMetadata(metadata as Record<string, unknown>);
      if (imageUrl) {
        const sanitizedUrl = sanitizeImageUrl(imageUrl);
        setNftImageUrl(sanitizedUrl);
      }
      
    } catch (error: unknown) {
      // Handle errors with inline messages instead of popups
      const errorMessage = error instanceof Error ? error.message : '';
      if (errorMessage.includes('execution reverted') || 
          errorMessage.includes('tokenURI') ||
          errorMessage.includes('invalid address')) {
        setInlineError("Failed to fetch NFT data. The contract may not be a valid ERC721 NFT or the token ID may not exist.");
      } else if (errorMessage.includes('network') || 
                 errorMessage.includes('fetch') || 
                 errorMessage.includes('timeout')) {
        setInlineError("Network error while fetching NFT metadata. Please check your connection and try again.");
      } else if (errorMessage.includes('JSON')) {
        setInlineError("Failed to parse NFT metadata. The metadata format may be corrupted.");
      } else {
        setInlineError("Unable to fetch NFT metadata. Please verify the contract address and token ID.");
      }
      
      // Still log errors for debugging
      const appError = errorMessage.includes('execution reverted') ? parseContractError(error) : parseIpfsError(error);
      logError(appError);
      
    } finally {
      setIsLoadingNft(false);
    }
  }, [sourceContractAddress, tokenId, config, isValidInputs, validateTokenUriSupport]);
  
  // Clear inline errors when inputs change
  useEffect(() => {
    setInlineError(null);
  }, [sourceContractAddress, tokenId]);
  
  // Auto-fetch when both inputs are provided and valid
  useEffect(() => {
    if (isConnected && sourceContractAddress.trim() && tokenId.trim()) {
      // Debounce the fetch
      const timeoutId = setTimeout(() => {
        if (isValidEthereumAddress(sourceContractAddress.trim()) && isValidTokenId(tokenId.trim())) {
          fetchNftMetadata();
        }
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [sourceContractAddress, tokenId, isConnected, fetchNftMetadata]);
  
  // Handle mint button click - actual minting implementation
  const handleMint = useCallback(async () => {
    if (!isValidInputs(true)) return;
    if (!duplicatesContractReady || !duplicatesContractAddress) {
      setInlineError(duplicatesContractError?.userMessage || "Duplicates contract not available");
      return;
    }
    if (!nftMetadata) {
      setInlineError("Please load NFT metadata first");
      return;
    }
    if (!userAddress) {
      setInlineError("No wallet address available");
      return;
    }
    
    // Additional validation: ensure userAddress is not zero address
    if (userAddress === '0x0000000000000000000000000000000000000000') {
      setInlineError("Invalid wallet address detected. Please reconnect your wallet.");
      return;
    }

    setIsMinting(true);
    setError(null);
    setInlineError(null);
    setMintTxHash(null);
    setMintSuccess(false);

    try {
      // Prepare mint parameters
      const sourceContract = sourceContractAddress.trim() as `0x${string}`;
      const sourceTokenId = BigInt(tokenId.trim());
      
      if (mintingCost === null) {
        setInlineError("Unable to determine minting cost. Please try refreshing.");
        return;
      }




       if (!userAddress || userAddress === '0x0000000000000000000000000000000000000000') {
        throw new Error('Wallet address is null or zero - wallet connection failed');
      }
      const txHash = await writeContract(config, {
        abi: duplicatesAbi,
        address: duplicatesContractAddress,
        functionName: "mint",
        args: [sourceContract as `0x${string}`, sourceTokenId],
        value: mintingCost,
      });

      setMintTxHash(txHash);

      // Wait for transaction confirmation
      await waitForTransactionReceipt(config, {
        hash: txHash,
      });

      setMintSuccess(true);
      

    } catch (error: unknown) {
      // Handle different types of errors with inline messages
      const errorMessage = error instanceof Error ? error.message : '';
      if (errorMessage.includes('User rejected')) {
        setInlineError("Transaction was cancelled by user");
      } else if (errorMessage.includes('insufficient funds')) {
        setInlineError("Insufficient funds to pay for gas and minting cost");
      } else if (errorMessage.includes('execution reverted')) {
        if (errorMessage.includes('mint to the zero address')) {
          setInlineError("Minting failed: Contract received zero address. Try disconnecting and reconnecting your wallet.");
        } else {
          setInlineError("Transaction failed. The contract may have specific requirements or the NFT might not be mintable.");
        }
      } else if (errorMessage.includes('connector not found') || errorMessage.includes('wagmi')) {
        setInlineError("Wallet connection issue. Please refresh the page and reconnect your wallet.");
      } else if (errorMessage.includes('Cannot convert undefined to a BigInt') || errorMessage.includes('BigInt')) {
        setInlineError("Transaction failed to submit properly. Check your wallet connection and try again.");
      } else {
        setInlineError("Minting failed. Please try again or check your wallet connection.");
      }
      
      // Still log errors for debugging
      const appError = parseContractError(error);
      logError(appError);
      
    } finally {
      setIsMinting(false);
    }
  }, [
    sourceContractAddress, 
    tokenId, 
    nftMetadata, 
    isValidInputs, 
    duplicatesContractReady, 
    duplicatesContractAddress, 
    duplicatesContractError, 
    config,
    userAddress,
    mintingCost
  ]);

  // Hydration effect - wait for wallet status to be determined
  useEffect(() => {
    // Wait for wagmi to determine connection status
    if (status === 'disconnected' || status === 'connected') {
      setIsHydrated(true);
    }
  }, [status]);

  // Show loading state until wallet status is determined
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-7xl mx-auto p-6 pt-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Duplicates NFT
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            NFT Collection too expensive? Just duplicate them!
          </p>
          <p className="text-l text-gray-500 max-w-3xl mx-auto">
            Transform any ERC-721 NFT into your own Duplicate. {isConnected ? "" : "Browse featured NFTs below or connect your wallet to get started."}
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* NFT Preview Section */}
          <div className="xl:col-span-2 space-y-6">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                {isConnected ? "NFT Preview" : "Featured NFTs"}
              </h2>
              <p className="text-gray-400 text-lg">
                {isConnected ? "Preview the NFT you want to dupe" : "Explore popular NFTs from top collections"}
              </p>
            </div>
          
          <div className="relative w-full h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
            {!isConnected ? (
              // Show rotating inspiration NFTs when wallet not connected
              <div className="w-full h-full">
                {currentInspirationNft ? (
                  <div className="relative w-full h-full">
                    {/* Current image */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-150 ${showingCurrent ? 'opacity-100' : 'opacity-0'}`}>
                      <ImageWithFallback
                        src={currentInspirationNft.image}
                        alt={currentInspirationNft.name}
                        className="max-w-full max-h-full"
                        preserveAspectRatio={true}
                        priority={true}
                        onLoad={() => setIsCurrentImageLoaded(true)}
                      />
                      {isCurrentImageLoaded && (
                        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm border border-gray-600">
                          {currentInspirationNft.name}
                        </div>
                      )}
                    </div>
                    
                    {/* Preload next image */}
                    {nextInspirationNft && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none">
                        <ImageWithFallback
                          src={nextInspirationNft.image}
                          alt={nextInspirationNft.name}
                          className="max-w-full max-h-full"
                          preserveAspectRatio={true}
                          onLoad={() => setIsNextImageLoaded(true)}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p>No inspiration NFTs available</p>
                      <p className="text-sm mt-2">Check the Inspiration tab for NFT examples</p>
                      <p className="text-xs mt-1">Connect your wallet to start minting</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Show NFT image when wallet connected - Always consistent container
              <div className="w-full h-full">
                {isLoadingNft ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-400">Loading NFT...</p>
                  </div>
                ) : nftImageUrl ? (
                  <div className="relative w-full h-full flex items-center justify-center transition-opacity duration-300">
                    <ImageWithFallback
                      src={nftImageUrl}
                      alt={nftMetadata?.name || "NFT"}
                      className="max-w-full max-h-full"
                      preserveAspectRatio={true}
                    />
                    {nftMetadata?.name && (
                      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm border border-gray-600 transition-opacity duration-300">
                        {nftMetadata.name}
                      </div>
                    )}
                  </div>
                ) : sourceContractAddress.trim() && tokenId.trim() ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="relative mb-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                      <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border border-blue-500/30"></div>
                    </div>
                    <p className="text-gray-400">Fetching NFT image...</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"></div>
                        <svg className="relative w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-400">Enter source contract address and token ID</p>
                      <p className="text-gray-500 text-sm mt-2">to preview NFT to dupe</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* NFT Metadata Display - Always Present Container */}
          {!isConnected && (
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 h-80 overflow-hidden">
              {currentInspirationNft && isCurrentImageLoaded && showingCurrent ? (
                <div className="h-full overflow-y-auto transition-opacity duration-150">
                  <h3 className="font-bold text-white mb-4 text-lg">Featured NFT Metadata</h3>
                  <p className="text-gray-300 mb-2">
                    <span className="font-medium text-purple-400">Name:</span> {currentInspirationNft.name}
                  </p>
                  <p className="text-gray-300 mb-2">
                    <span className="font-medium text-purple-400">Token ID:</span> #{currentInspirationNft.tokenId}
                  </p>
                  <p className="text-gray-300 mb-3">
                    <span className="font-medium text-purple-400">Description:</span> {currentInspirationNft.staticMetadata.description}
                  </p>
                  {currentInspirationNft.staticMetadata.attributes && currentInspirationNft.staticMetadata.attributes.length > 0 && (
                    <div>
                      <span className="font-medium text-purple-400 block mb-2">Attributes:</span>
                      <div className="flex flex-wrap gap-2">
                        {currentInspirationNft.staticMetadata.attributes.map((attr, index) => (
                          <span 
                            key={index}
                            className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 px-3 py-1.5 rounded-lg text-xs font-medium border border-purple-500/30"
                          >
                            {attr.trait_type}: {attr.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                      <div className="absolute inset-0 animate-ping rounded-full h-8 w-8 border border-purple-500/30"></div>
                    </div>
                    <p className="text-gray-400 mt-3 text-sm">Loading NFT metadata...</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Connected State - Always Present Container */}
          {isConnected && (
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 min-h-80">
              {isLoadingNft ? (
                <div className="flex flex-col items-center justify-center h-full min-h-64">
                  <div className="relative mb-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <div className="absolute inset-0 animate-ping rounded-full h-8 w-8 border border-blue-500/30"></div>
                  </div>
                  <p className="text-gray-400 text-sm">Loading NFT metadata...</p>
                </div>
              ) : nftMetadata ? (
                <div className="transition-opacity duration-300">
                  <h3 className="font-bold text-white mb-4 text-lg">Source NFT Metadata</h3>
                  {nftMetadata.name && (
                    <p className="text-gray-300 mb-2">
                      <span className="font-medium text-purple-400">Name:</span> {nftMetadata.name}
                    </p>
                  )}
                  {nftMetadata.description && (
                    <p className="text-gray-300 mb-3">
                      <span className="font-medium text-purple-400">Description:</span> {nftMetadata.description}
                    </p>
                  )}
                  {nftMetadata.attributes && nftMetadata.attributes.length > 0 && (
                    <div>
                      <span className="font-medium text-purple-400 block mb-2">Attributes:</span>
                      <div className="flex flex-wrap gap-2">
                        {nftMetadata.attributes.map((attr, index) => (
                          <span 
                            key={index}
                            className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 px-3 py-1.5 rounded-lg text-xs font-medium border border-purple-500/30"
                          >
                            {attr.trait_type}: {attr.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : sourceContractAddress.trim() && tokenId.trim() && !error ? (
                <div className="flex items-center justify-center h-full min-h-64">
                  <div className="text-center">
                    <div className="relative inline-flex">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <div className="absolute inset-0 animate-ping rounded-full h-8 w-8 border border-blue-500/30"></div>
                    </div>
                    <p className="text-gray-400 mt-3 text-sm">Fetching NFT details...</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-64">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-400 text-sm">Enter contract address and token ID</p>
                    <p className="text-gray-500 text-xs mt-1">to preview NFT metadata</p>
                  </div>
                </div>
              )}
            </div>
          )}
          </div>
          
          {/* Minter Section */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Duplicator
              </h2>
              <p className="text-gray-400 text-lg">Enter NFT details to create your duplicate</p>
            </div>
            
            {/* Connection Status */}
            {!isConnected ? (
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-yellow-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-yellow-200">
                    Please connect your wallet to use the Duplicates functionality.
                  </p>
                </div>
              </div>
            ) : duplicatesContractError ? (
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-red-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-red-300 font-medium">Duplicates contract not deployed</p>
                    <p className="text-red-200 text-sm mt-1">{duplicatesContractError.userMessage}</p>
                    {chainConfig && (
                      <p className="text-red-400 text-sm mt-1">Current network: {chainConfig.name}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Minting Cost Display */}
            {isConnected && duplicatesContractReady && mintingCost !== null && (
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className="text-blue-200 font-medium">Minting Cost</span>
                  </div>
                  <span className="text-blue-100 font-bold">
                    {mintingCost === BigInt(0) ? 'FREE' : `${(Number(mintingCost) / 1e18).toFixed(4)} ETH`}
                  </span>
                </div>
              </div>
            )}
            
            {/* Input Fields - Always visible when connected */}
            {isConnected && (
              <>
                <div className="space-y-4">
                  <InputField
                    label="Source Contract Address"
                    placeholder="0x... (NFT contract to duplicate from)"
                    value={sourceContractAddress}
                    onChange={setSourceContractAddress}
                  />
                  
                  <InputField
                    label="Token ID"
                    placeholder="1 (Token to duplicate)"
                    value={tokenId}
                    onChange={setTokenId}
                    type="number"
                  />
                </div>

                {/* Inline Error Display */}
                {inlineError && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-red-200 text-sm">
                          {inlineError}
                        </p>
                      </div>
                      <button
                        onClick={() => setInlineError(null)}
                        className="text-red-400 hover:text-red-300 transition-colors ml-2"
                      >
                        <span className="sr-only">Dismiss</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={handleMint}
                  disabled={!duplicatesContractReady || !duplicatesContractAddress || !sourceContractAddress.trim() || !tokenId.trim() || isLoadingNft || isMinting || !nftMetadata}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
                >
                  {isMinting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {mintTxHash ? 'Confirming...' : 'Minting...'}
                    </div>
                  ) : isLoadingNft ? 'Loading NFT...' : 
                   !duplicatesContractReady ? 'Duplicates Contract Not Deployed' : 
                   !sourceContractAddress.trim() || !tokenId.trim() ? 'Enter Contract Address & Token ID' :
                   !nftMetadata ? 'Load NFT Metadata First' :
                   'Mint Duplicate'}
                </button>

                {/* Transaction Status */}
                {mintTxHash && (
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center">
                      {mintSuccess ? (
                        <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                      )}
                      <div className="flex-1">
                        <p className="text-blue-200 font-medium">
                          {mintSuccess ? 'Transaction Confirmed!' : 'Transaction Pending...'}
                        </p>
                        <p className="text-blue-300 text-sm truncate">
                          Hash: {mintTxHash.slice(0, 10)}...{mintTxHash.slice(-8)}
                        </p>
                      </div>
                      {getExplorerUrl(chainConfig?.chainId) && (
                        <a 
                          href={`${getExplorerUrl(chainConfig?.chainId)}tx/${mintTxHash}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm underline ml-2"
                        >
                          View on Explorer
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Error Popup - Only for critical system errors */}
      <ErrorPopup
        isOpen={!!error && !inlineError}
        message={error?.userMessage || ""}
        onClose={() => setError(null)}
        title="System Error"
      />
    </div>
  );
}
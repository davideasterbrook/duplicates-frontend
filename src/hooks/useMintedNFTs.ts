"use client"

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAccount, useConfig } from "wagmi";
import { readContract } from "@wagmi/core";
import { erc721Abi } from "@/app/constants";
import { useNftMinterContract } from "@/hooks/useContract";
import { 
  fetchFromIpfs, 
  extractImageFromMetadata, 
  sanitizeImageUrl 
} from "@/utils/ipfs";
import { 
  AppError, 
  parseContractError, 
  parseIpfsError, 
  createUserError 
} from "@/utils/errorHandling";

export interface MintedNFT {
  tokenId: string;
  owner: string;
  tokenUri?: string;
  metadata?: {
    name?: string;
    description?: string;
    image?: string;
    external_url?: string;
    animation_url?: string;
    attributes?: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
  imageUrl?: string;
  metadataError?: boolean;
  imageError?: boolean;
}

export interface UseMintedNFTsResult {
  // User's NFTs
  userNFTs: MintedNFT[];
  userLoading: boolean;
  userError: AppError | null;
  userLoadingProgress: { loaded: number; total: number };
  
  // All NFTs with pagination
  allNFTs: MintedNFT[];
  allLoading: boolean;
  allError: AppError | null;
  totalSupply: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  allLoadingProgress: { loaded: number; total: number };
  
  // Actions
  loadUserNFTs: () => Promise<void>;
  loadAllNFTs: (page?: number) => Promise<void>;
  nextPage: () => void;
  previousPage: () => void;
  refresh: () => Promise<void>;
}

const DEFAULT_PAGE_SIZE = 50;
const METADATA_BATCH_SIZE = 5; // Process metadata in smaller batches to reduce load
const METADATA_BATCH_DELAY = 100; // 100ms delay between batches

export function useMintedNFTs(): UseMintedNFTsResult {
  const { address, isConnected } = useAccount();
  const config = useConfig();
  
  const { 
    contractAddress, 
    isReady: contractReady, 
    error: contractError
  } = useNftMinterContract();
  
  // State
  const [userNFTs, setUserNFTs] = useState<MintedNFT[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState<AppError | null>(null);
  const [userLoadingProgress, setUserLoadingProgress] = useState({ loaded: 0, total: 0 });
  
  const [allNFTs, setAllNFTs] = useState<MintedNFT[]>([]);
  const [allLoading, setAllLoading] = useState(false);
  const [allError, setAllError] = useState<AppError | null>(null);
  const [totalSupply, setTotalSupply] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [allLoadingProgress, setAllLoadingProgress] = useState({ loaded: 0, total: 0 });
  
  // Get total supply
  const fetchTotalSupply = useCallback(async (): Promise<number> => {
    if (!contractReady || !contractAddress || !config) return 0;
    
    try {
      const supply = await readContract(config, {
        abi: erc721Abi,
        address: contractAddress,
        functionName: "totalSupply"
      });
      return Number(supply);
    } catch (error) {
      console.warn("Could not fetch total supply:", error);
      return 0;
    }
  }, [contractReady, contractAddress, config]);

  // Fetch metadata for a token
  const fetchTokenMetadata = useCallback(async (tokenId: string, owner: string): Promise<MintedNFT> => {
    if (!contractReady || !contractAddress || !config) {
      return { tokenId, owner };
    }

    try {
      const tokenUri = await readContract(config, {
        abi: erc721Abi,
        address: contractAddress,
        functionName: "tokenURI",
        args: [BigInt(tokenId)]
      });

      let metadata;
      let imageUrl;

      if (tokenUri && typeof tokenUri === 'string') {
        try {
          // Handle base64 encoded JSON
          if (tokenUri.startsWith('data:application/json;base64,')) {
            const base64Data = tokenUri.replace('data:application/json;base64,', '');
            const decodedData = atob(base64Data);
            metadata = JSON.parse(decodedData);
          }
          // Handle direct JSON string
          else if (tokenUri.startsWith('{')) {
            metadata = JSON.parse(tokenUri);
          }
          // Handle IPFS or HTTP URLs
          else {
            metadata = await fetchFromIpfs(tokenUri);
          }

          if (metadata) {
            const rawImageUrl = extractImageFromMetadata(metadata);
            if (rawImageUrl) {
              imageUrl = sanitizeImageUrl(rawImageUrl);
            }
          }
        } catch (metadataError) {
          // Only log if it's not a cached failure to reduce noise
          if (!(metadataError instanceof Error) || !metadataError.message?.includes('Cached failure')) {
            console.warn(`Failed to fetch metadata for token ${tokenId}:`, metadataError);
          }
          
          // Return partial NFT with error flag
          return {
            tokenId,
            owner,
            tokenUri: tokenUri as string,
            metadata: {
              name: `NFT #${tokenId}`,
              description: 'Metadata unavailable'
            },
            metadataError: true
          };
        }
      }

      return {
        tokenId,
        owner,
        tokenUri: tokenUri as string,
        metadata,
        imageUrl,
        metadataError: false,
        imageError: !imageUrl && metadata && extractImageFromMetadata(metadata)
      };
    } catch (error) {
      console.warn(`Failed to fetch data for token ${tokenId}:`, error);
      return { tokenId, owner };
    }
  }, [contractReady, contractAddress, config]);

  // Load user's NFTs by checking ownership of all tokens
  const loadUserNFTs = useCallback(async () => {
    if (!contractReady || !contractAddress || !config || !address) {
      setUserError(contractError || createUserError("Contract or wallet not available"));
      return;
    }

    setUserLoading(true);
    setUserError(null);
    setUserNFTs([]); // Clear existing NFTs for fresh progressive load
    setUserLoadingProgress({ loaded: 0, total: 0 });

    try {
      // Get total supply first
      const supply = await fetchTotalSupply();
      setTotalSupply(supply);

      if (supply === 0) {
        setUserNFTs([]);
        setUserLoadingProgress({ loaded: 0, total: 0 });
        setUserLoading(false);
        return;
      }

      // Check ownership for each token ID
      const userTokens: Array<{ tokenId: string; owner: string }> = [];
      
      // Process tokens in batches for better performance
      const batchSize = 20;
      for (let i = 0; i < supply; i += batchSize) {
        const batch = [];
        const endIndex = Math.min(i + batchSize, supply);
        
        // Create batch of ownerOf calls
        for (let tokenId = i; tokenId < endIndex; tokenId++) {
          batch.push(
            readContract(config, {
              abi: erc721Abi,
              address: contractAddress,
              functionName: "ownerOf",
              args: [BigInt(tokenId)]
            }).then(owner => ({ tokenId: tokenId.toString(), owner: owner as string }))
            .catch(() => null) // Token might be burned
          );
        }

        // Execute batch
        const batchResults = await Promise.all(batch);
        
        // Filter for user's tokens
        for (const result of batchResults) {
          if (result && result.owner.toLowerCase() === address.toLowerCase()) {
            userTokens.push(result);
          }
        }
      }

      // Set total for progress tracking
      setUserLoadingProgress({ loaded: 0, total: userTokens.length });

      // Fetch metadata for user's tokens progressively
      const allNfts: MintedNFT[] = [];
      
      for (let i = 0; i < userTokens.length; i += METADATA_BATCH_SIZE) {
        const batch = userTokens.slice(i, i + METADATA_BATCH_SIZE);
        const batchResults = await Promise.all(
          batch.map(token => fetchTokenMetadata(token.tokenId, token.owner))
        );
        
        // Add the new batch to the existing array
        allNfts.push(...batchResults);
        
        // Update state with progressive results
        const sortedNfts = [...allNfts].sort((a, b) => parseInt(b.tokenId) - parseInt(a.tokenId));
        setUserNFTs(sortedNfts);
        setUserLoadingProgress({ loaded: allNfts.length, total: userTokens.length });
        
        // Add delay between batches to prevent overwhelming the network
        if (i + METADATA_BATCH_SIZE < userTokens.length) {
          await new Promise(resolve => setTimeout(resolve, METADATA_BATCH_DELAY));
        }
      }
      
    } catch (error: any) {
      console.error('Error fetching user NFTs:', error);
      const appError = error?.message?.includes('contract') 
        ? parseContractError(error)
        : parseIpfsError(error);
      setUserError(appError);
    } finally {
      setUserLoading(false);
      setUserLoadingProgress(prev => ({ ...prev, loaded: prev.total })); // Ensure loaded matches total when done
    }
  }, [contractReady, contractAddress, config, address, contractError, fetchTotalSupply, fetchTokenMetadata]);

  // Load all NFTs with pagination
  const loadAllNFTs = useCallback(async (page: number = 0) => {
    if (!contractReady || !contractAddress || !config) {
      setAllError(contractError || createUserError("Contract not available"));
      return;
    }

    setAllLoading(true);
    setAllError(null);
    setCurrentPage(page);

    try {
      // Get total supply first
      const supply = await fetchTotalSupply();
      setTotalSupply(supply);

      if (supply === 0) {
        setAllNFTs([]);
        setAllLoading(false);
        return;
      }

      // Calculate token range for this page (newest first)
      const startToken = page * pageSize;
      const endToken = Math.min(startToken + pageSize, supply);

      if (startToken >= supply) {
        setAllNFTs([]);
        setAllLoading(false);
        return;
      }

      // Generate token IDs for this page (newest first: totalSupply-1, totalSupply-2, etc.)
      const pageTokenIds: number[] = [];
      for (let i = 0; i < (endToken - startToken); i++) {
        const tokenId = supply - 1 - startToken - i; // Newest first
        if (tokenId >= 0) {
          pageTokenIds.push(tokenId);
        }
      }

      // Get owners for this page of tokens
      const tokenPromises = pageTokenIds.map(async (tokenId) => {
        try {
          const owner = await readContract(config, {
            abi: erc721Abi,
            address: contractAddress,
            functionName: "ownerOf",
            args: [BigInt(tokenId)]
          });
          
          return { tokenId: tokenId.toString(), owner: owner as string };
        } catch (ownerError) {
          console.warn(`Could not get owner for token ${tokenId}:`, ownerError);
          return null;
        }
      });

      const pageTokens = (await Promise.all(tokenPromises))
        .filter((token): token is { tokenId: string; owner: string } => token !== null);

      // Fetch metadata for this page in batches
      const nftsWithMetadata: MintedNFT[] = [];
      
      for (let i = 0; i < pageTokens.length; i += METADATA_BATCH_SIZE) {
        const batch = pageTokens.slice(i, i + METADATA_BATCH_SIZE);
        const batchResults = await Promise.all(
          batch.map(token => fetchTokenMetadata(token.tokenId, token.owner))
        );
        nftsWithMetadata.push(...batchResults);
        
        // Add delay between batches
        if (i + METADATA_BATCH_SIZE < pageTokens.length) {
          await new Promise(resolve => setTimeout(resolve, METADATA_BATCH_DELAY));
        }
      }

      setAllNFTs(nftsWithMetadata);
      
    } catch (error: any) {
      console.error('Error fetching all NFTs:', error);
      const appError = error?.message?.includes('contract') 
        ? parseContractError(error)
        : parseIpfsError(error);
      setAllError(appError);
    } finally {
      setAllLoading(false);
    }
  }, [contractReady, contractAddress, config, contractError, fetchTotalSupply, pageSize, fetchTokenMetadata]);

  // Pagination helpers
  const hasNextPage = useMemo(() => {
    return (currentPage + 1) * pageSize < totalSupply;
  }, [currentPage, pageSize, totalSupply]);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      loadAllNFTs(currentPage + 1);
    }
  }, [hasNextPage, loadAllNFTs, currentPage]);

  const previousPage = useCallback(() => {
    if (currentPage > 0) {
      loadAllNFTs(currentPage - 1);
    }
  }, [currentPage, loadAllNFTs]);

  // Refresh both user and all NFTs
  const refresh = useCallback(async () => {
    await Promise.all([
      loadUserNFTs(),
      loadAllNFTs(0) // Reset to first page
    ]);
  }, [loadUserNFTs, loadAllNFTs]);

  // Auto-load when ready and connected
  useEffect(() => {
    if (isConnected && contractReady && address) {
      loadUserNFTs();
    }
  }, [isConnected, contractReady, address, loadUserNFTs]);

  useEffect(() => {
    if (contractReady) {
      loadAllNFTs(0);
    }
  }, [contractReady, loadAllNFTs]);

  return {
    userNFTs,
    userLoading,
    userError,
    userLoadingProgress,
    allNFTs,
    allLoading,
    allError,
    totalSupply,
    currentPage,
    pageSize,
    hasNextPage,
    allLoadingProgress,
    loadUserNFTs,
    loadAllNFTs,
    nextPage,
    previousPage,
    refresh
  };
}
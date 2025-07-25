/**
 * Custom hook for managing contract addresses based on connected chain
 * Provides type-safe access to contract configurations with error handling
 */

import { useChainId } from 'wagmi';
import { useMemo } from 'react';
import { 
  getContractConfig, 
  getChainConfig, 
  isChainSupported, 
  isValidContractAddress,
  getDeploymentInfo,
  type ContractConfig,
  type ChainConfig 
} from '@/config/contracts';
import { AppError, createUserError } from '@/utils/errorHandling';

export interface UseContractResult {
  // Contract information
  contractAddress: `0x${string}` | null;
  contractConfig: ContractConfig | null;
  chainConfig: ChainConfig | null;
  
  // Status flags
  isSupported: boolean;
  isConfigured: boolean;
  isReady: boolean;
  
  // Error handling
  error: AppError | null;
  
  // Future-proof: deployment info for event filtering
  deploymentInfo: {
    address: `0x${string}`;
    fromBlock: number;
    name?: string;
  } | null;
}

/**
 * Hook to get contract configuration for the current chain
 * Handles all contract-related logic with proper error states
 */
export function useContract(contractType: 'nftMinter' = 'nftMinter'): UseContractResult {
  const chainId = useChainId();
  
  const result = useMemo((): UseContractResult => {
    // Check if chain is supported
    if (!isChainSupported(chainId)) {
      return {
        contractAddress: null,
        contractConfig: null,
        chainConfig: null,
        isSupported: false,
        isConfigured: false,
        isReady: false,
        error: createUserError(
          `Unsupported network. Please switch to a supported network (Mainnet, Sepolia, or Local).`
        ),
        deploymentInfo: null
      };
    }
    
    const chainConfig = getChainConfig(chainId);
    const contractConfig = getContractConfig(chainId, contractType);
    
    // Chain is supported but no contract config found
    if (!contractConfig) {
      return {
        contractAddress: null,
        contractConfig: null,
        chainConfig,
        isSupported: true,
        isConfigured: false,
        isReady: false,
        error: createUserError(
          `No ${contractType} contract deployed on ${chainConfig?.name || 'this network'}.`
        ),
        deploymentInfo: null
      };
    }
    
    // Contract config exists but address is invalid/placeholder
    if (!isValidContractAddress(contractConfig.address)) {
      return {
        contractAddress: null,
        contractConfig,
        chainConfig,
        isSupported: true,
        isConfigured: false,
        isReady: false,
        error: createUserError(
          `Contract address not configured for ${chainConfig?.name || 'this network'}. Please contact support.`
        ),
        deploymentInfo: null
      };
    }
    
    // Everything is ready
    const deploymentInfo = getDeploymentInfo(chainId, contractType);
    
    return {
      contractAddress: contractConfig.address,
      contractConfig,
      chainConfig,
      isSupported: true,
      isConfigured: true,
      isReady: true,
      error: null,
      deploymentInfo: deploymentInfo ? {
        address: deploymentInfo.address,
        fromBlock: deploymentInfo.fromBlock,
        name: deploymentInfo.name
      } : null
    };
  }, [chainId, contractType]);
  
  return result;
}

/**
 * Hook specifically for the NFT minter contract
 * Convenience wrapper around useContract
 */
export function useNftMinterContract(): UseContractResult {
  return useContract('nftMinter');
}

/**
 * Hook to get all contract deployment info for the current chain
 * Useful for future features like displaying all contracts or multi-contract operations
 */
export function useChainContracts() {
  const chainId = useChainId();
  
  return useMemo(() => {
    if (!isChainSupported(chainId)) {
      return {
        contracts: {},
        chainConfig: null,
        isSupported: false
      };
    }
    
    const chainConfig = getChainConfig(chainId);
    const contracts = chainConfig?.contracts || {};
    
    // Filter out contracts with invalid addresses
    const validContracts = Object.entries(contracts).reduce((acc, [key, config]) => {
      if (config && isValidContractAddress(config.address)) {
        acc[key] = config;
      }
      return acc;
    }, {} as Record<string, ContractConfig>);
    
    return {
      contracts: validContracts,
      chainConfig,
      isSupported: true
    };
  }, [chainId]);
} 
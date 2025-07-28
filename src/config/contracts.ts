/**
 * Contract deployment configuration
 * Maps chain IDs to deployed contract addresses
 */

import { Address } from 'viem';

export interface ContractConfig {
  address: Address;
  deployedBlock?: number; // For efficient event filtering in the future
  name?: string; // Human readable name
}

export interface ChainConfig {
  chainId: number;
  name: string;
  contracts: {
    nftMinter?: ContractConfig;
    // Add other contract types here as needed
  };
}

/**
 * Supported chain configurations
 * Add new chains and their contract deployments here
 */
export const CHAIN_CONFIGS: Record<number, ChainConfig> = {
  // Ethereum Mainnet
  1: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    contracts: {
      nftMinter: {
        address: '0xe14942066fE9d1cbFa8a343C7A8B7d38F6B9B0f5',
        deployedBlock: 23017016,
        name: 'NFT Minter - Mainnet'
      }
    }
  },
  
  // Sepolia Testnet
  11155111: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    contracts: {
      nftMinter: {
        address: '0xe14942066fE9d1cbFa8a343C7A8B7d38F6B9B0f5',
        deployedBlock: 8839485,
        name: 'NFT Minter - Sepolia'
      }
    }
  },
  
  // Local Development (Anvil/Hardhat)
  31337: {
    chainId: 31337,
    name: 'Local Network',
    contracts: {
      nftMinter: {
        address: '0xEf1ABFcD0413CA9eFcfFAC2079257A1572058Ade',
        deployedBlock: 0, // Local development - block number not needed
        name: 'NFT Minter - Local'
      }
    }
  }
};

/**
 * Get chain configuration by chain ID
 */
export function getChainConfig(chainId: number): ChainConfig | null {
  return CHAIN_CONFIGS[chainId] || null;
}

/**
 * Get contract configuration for a specific chain and contract type
 */
export function getContractConfig(
  chainId: number, 
  contractType: keyof ChainConfig['contracts']
): ContractConfig | null {
  const chainConfig = getChainConfig(chainId);
  if (!chainConfig) return null;
  
  return chainConfig.contracts[contractType] || null;
}

/**
 * Get all supported chain IDs
 */
export function getSupportedChainIds(): number[] {
  return Object.keys(CHAIN_CONFIGS).map(Number);
}

/**
 * Check if a chain is supported
 */
export function isChainSupported(chainId: number): boolean {
  return chainId in CHAIN_CONFIGS;
}

/**
 * Validate contract address format
 */
export function isValidContractAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  
  // Check if it's a valid Ethereum address format
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  if (!ethAddressRegex.test(address)) return false;
  
  // Check if it's not a zero address
  if (address === '0x0000000000000000000000000000000000000000') return false;
  
  // Check if it's not a placeholder
  if (address === '0x') return false;
  
  return true;
}

/**
 * Get deployment information for event filtering
 * Useful for fetching all minted tokens efficiently
 */
export function getDeploymentInfo(chainId: number, contractType: keyof ChainConfig['contracts']) {
  const contractConfig = getContractConfig(chainId, contractType);
  if (!contractConfig) return null;
  
  return {
    address: contractConfig.address,
    fromBlock: contractConfig.deployedBlock || 0,
    name: contractConfig.name
  };
} 
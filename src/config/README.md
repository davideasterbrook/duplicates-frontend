# Contract Configuration

This directory contains the configuration for deployed contracts across different blockchain networks.

## Files

- `contracts.ts` - Main configuration file mapping contract addresses to chain IDs

## How to Configure Contract Addresses

### 1. Update Contract Addresses

Edit `src/config/contracts.ts` and replace the placeholder addresses with your actual deployed contract addresses:

```typescript
export const CHAIN_CONFIGS: Record<number, ChainConfig> = {
  // Ethereum Mainnet
  1: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    contracts: {
      nftMinter: {
        address: '0x1234567890123456789012345678901234567890', // ✅ Replace with actual address
        deployedBlock: 18500000, // ✅ Add actual deployment block
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
        address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', // ✅ Replace with actual address
        deployedBlock: 4500000, // ✅ Add actual deployment block
        name: 'NFT Minter - Sepolia'
      }
    }
  },
  
  // Local Development
  31337: {
    chainId: 31337,
    name: 'Local Network',
    contracts: {
      nftMinter: {
        address: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // ✅ Typical Hardhat address
        deployedBlock: 0,
        name: 'NFT Minter - Local'
      }
    }
  }
};
```

### 2. Deployment Block Numbers

Add the deployment block number for each contract. This is used for:
- Efficient event filtering when fetching all minted tokens
- Reducing RPC calls by only scanning from deployment block onwards

### 3. Adding New Networks

To add support for a new network:

```typescript
// Add new network to CHAIN_CONFIGS
123456: {
  chainId: 123456,
  name: 'New Network',
  contracts: {
    nftMinter: {
      address: '0x...', // Your contract address
      deployedBlock: 1000000, // Deployment block
      name: 'NFT Minter - New Network'
    }
  }
}
```

## Security Best Practices

### ✅ Do:
- Always verify contract addresses before deploying
- Use checksummed addresses (mixed case)
- Test on testnets before mainnet
- Add deployment block numbers for efficiency
- Keep this file in version control

### ❌ Don't:
- Leave placeholder addresses (`0x`) in production
- Use the same address across different networks
- Forget to update after redeployments
- Add private keys or sensitive data

## Validation

The system automatically validates:
- Address format (0x + 40 hex characters)
- No zero addresses
- No placeholder addresses
- Network support before operations

## Future Features

This configuration supports upcoming features:
- **All Minted Tokens Page**: Uses `deployedBlock` for efficient event filtering
- **Multi-contract Support**: Easy to add new contract types
- **Cross-chain Operations**: Network-aware contract interactions

## Troubleshooting

### "Unsupported network" Error
- Check if your network's chain ID is in `CHAIN_CONFIGS`
- Verify your wallet is connected to a supported network

### "Contract not configured" Error  
- Ensure the contract address is not `0x` placeholder
- Verify the address is a valid Ethereum address
- Check that the contract is deployed on the current network

### "Contract not deployed" Error
- Add the contract configuration for the current network
- Deploy your contract to the network first 
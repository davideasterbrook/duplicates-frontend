# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Install dependencies**: `pnpm install`
- **Start development server**: `pnpm run dev` (uses Next.js with Turbopack)
- **Build for production**: `pnpm run build`
- **Start production server**: `pnpm run start`
- **Lint code**: `pnpm run lint`
- **Run unit tests**: `pnpm run test:unit` (Vitest)
- **Start local blockchain**: `pnpm run anvil` (Foundry/Anvil)

## Architecture Overview

This is a Next.js 15 Web3 application for NFT minting and management, built with TypeScript and React 19. The project follows a multi-chain Web3 architecture using modern tools.

### Core Tech Stack
- **Frontend**: Next.js 15 with React 19, TailwindCSS 4
- **Web3**: RainbowKit, Wagmi, Viem, Ethers.js
- **Testing**: Vitest (unit), Playwright (E2E), Synpress (wallet integration)
- **Blockchain**: Foundry/Anvil for local development

### Project Structure
- **src/app/**: Next.js App Router pages and API routes
- **src/components/**: Reusable React components organized by feature
- **src/config/**: Contract configurations and chain-specific settings
- **src/hooks/**: Custom React hooks for Web3 interactions
- **src/utils/**: Utility functions and shared logic
- **test/**: E2E and wallet setup tests

### Key Components
- **HomeContent**: Main application with tab-based navigation (mint/minted)
- **MintingForm**: Handles NFT minting operations
- **MintedTokens**: Displays user's minted NFT collection
- **Header**: Navigation and wallet connection

### Web3 Configuration
- **Chains**: Supports Anvil (local), Ethereum Mainnet, and Sepolia testnet
- **Wallet Connection**: RainbowKit with multi-provider support
- **Contract ABI**: Located in `src/app/duplicatesAbi.ts` (NFT contract with minting functionality)
- **Chain Config**: Multi-chain contract addresses in `src/config/contracts.ts`

### Environment Setup
Requires `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in `.env.local` from WalletConnect Cloud.

### Local Development
1. Run `pnpm run anvil` for local blockchain
2. Configure wallet with Anvil chain (RPC: http://localhost:8545, Chain ID: 31337)
3. Import Anvil account private keys for testing

### Testing Strategy
- Unit tests with Vitest and jsdom environment
- E2E tests with Playwright (configured for localhost:3000)
- Wallet integration tests with Synpress
- Tests exclude the `/test` directory from TypeScript compilation

### Contract Integration
The application integrates with a "Duplicates" NFT contract that allows minting NFTs by referencing external contract addresses and token IDs. Contract configuration supports multiple chains with placeholder addresses for mainnet/testnet deployment.

## Smart Contract Development

The NFT contract is located in `../duplicates_nft_contract` and uses:
- **Language**: Vyper 0.4.3
- **Framework**: Moccasin (Python-based)
- **Libraries**: Snekmate (OpenZeppelin equivalent for Vyper)
- **Testing**: Titanoboa and pytest

### Contract Commands (from ../duplicates_nft_contract)
- **Deploy contract**: `moccasin run script/deploy_duplicates.py --network anvil`
- **Run tests**: `pytest tests/`
- **Compile contract**: `moccasin compile`

### Contract Features
- **Dynamic Pricing**: First 100 tokens free, then exponential pricing by 1000-token tiers (0.0005 ETH base, doubles each tier)
- **Price Cap**: Owner-configurable maximum price (default 0.1 ETH)
- **Metadata Proxy**: Dynamically fetches tokenURI from original contracts
- **Copy Mechanism**: Stores mapping of token_id → (original_contract, original_token_id)

### Contract Architecture
- Inherits from Snekmate's ERC721 and Ownable modules
- Uses `token_metadata` struct to track original NFT references
- Implements ERC721Metadata to proxy tokenURI calls to original contracts
- Includes permit functionality for gasless approvals

### Network Configuration
- **Anvil Local**: Chain ID 31337, deployed at `0x5427d4E232b2520550889c19799cA4adF59076bA`
- **Mainnet Fork**: Supports BAYC, Pudgy Penguins, Doodles for testing
- **Dependencies**: Known NFT contract addresses for testing/forking
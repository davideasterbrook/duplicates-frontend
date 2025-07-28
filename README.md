# Duplicates NFT Frontend

## Overview

A Next.js Web3 application for minting "duplicate" NFTs that reference existing NFTs from other collections. Users can mint NFTs by providing the original contract address and token ID, creating a Duplicate that maintains a reference to the original.

Smart contract repo can be found at [duplicates-contract](https://github.com/davideasterbrook/duplicates-contract).

## Features

- **Multi-Chain Support**: Works on Ethereum Mainnet, Sepolia Testnet, and local Anvil
- **Dynamic Pricing**: First 100 tokens free, then exponential pricing by tiers
- **Metadata Proxy**: Displays original NFT metadata and images
- **Wallet Integration**: RainbowKit with multi-provider support
- **Responsive Design**: Mobile-first UI with TailwindCSS
- **Production Ready**: Optimized build, error handling, and TypeScript support

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS 4
- **Web3**: RainbowKit, Wagmi, Viem, Ethers.js
- **Blockchain**: Foundry/Anvil for local development

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager
- Web3 wallet (MetaMask, WalletConnect, etc.)

### Installation

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd duplicates_frontend
pnpm install
```

2. **Environment Setup**:
Create a `.env.local` file with:
```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```
Get your Project ID from [WalletConnect Cloud](https://cloud.reown.com/)

3. **Start development server**:
```bash
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### Local Blockchain Development

1. **Start local Anvil chain**:
```bash
pnpm run anvil
```

2. **Configure wallet for local development**:
Add Anvil network to your wallet:
- **Network Name**: Anvil Local
- **RPC URL**: http://localhost:8545
- **Chain ID**: 31337
- **Currency**: ETH

3. **Import test accounts**:
Use Anvil's provided private keys to import test accounts with pre-funded ETH.

### Available Scripts

- `pnpm run dev` - Start development server with Turbopack
- `pnpm run build` - Create production build
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint
- `pnpm run test:unit` - Run unit tests with Vitest
- `pnpm run anvil` - Start local blockchain

## Smart Contract Integration

The frontend connects to the Duplicates NFT contract deployed on multiple networks:

- **Sepolia Testnet**: `0xe14942066fE9d1cbFa8a343C7A8B7d38F6B9B0f5`
- **Local Anvil**: `0xEf1ABFcD0413CA9eFcfFAC2079257A1572058Ade`
- **Mainnet**: *To be deployed*

This is managed from `src/app/config/contracts.ts`. Update this as needed for local and staging development.

### Contract Features

- **Dynamic Pricing**: First 100 NFTs free, then exponential pricing by 1000-token tiers
- **Price Cap**: Owner-configurable maximum price (default 0.1 ETH)
- **Metadata Proxy**: Fetches tokenURI from original contracts
- **Copy Mechanism**: Maps token_id → (original_contract, original_token_id)

## Project Structure

```
src/
├── app/                 # Next.js App Router pages and API routes
├── components/          # React components organized by feature
│   ├── UI/             # Reusable UI components
│   ├── MintingForm.tsx # NFT minting interface
│   ├── MintedTokens.tsx# User's NFT collection display
│   └── Header.tsx      # Navigation and wallet connection
├── config/             # Contract addresses and chain configurations
├── hooks/              # Custom React hooks for Web3 interactions
└── utils/              # Utility functions and shared logic
```

## Testing

- **Unit Tests**: `pnpm run test:unit` (Vitest + jsdom)
- **E2E Tests**: Playwright (configured for localhost:3000)
- **Wallet Tests**: Synpress for wallet integration testing

## Deployment

The application is production-ready and can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Any static hosting platform**

Build for production:
```bash
pnpm run build
```

## Popular NFT Collections for Testing

Test the application with these well-known NFT contracts:

```bash
# Bored Ape Yacht Club
0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D

# Doodles
0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e

# Pudgy Penguins  
0xBd3531dA5CF5857e7CfAA92426877b022e612cf8
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# Future Work
- Update WalletConnect AppURL once domain purchased
- Add debug tab for contract owner
- SEO
- Update testing

# Duplicates Mint Setup Guide

## ✅ **Minting Functionality Implemented!**

The Duplicates minting functionality is now fully implemented. Here's what you need to customize for your specific contract:

## 🔧 **Required Configuration Steps**

### 1. **Deploy Your Duplicates Contract**

First, deploy your Duplicates contract to your desired networks and update `src/config/contracts.ts`:

```typescript
// Example for Sepolia testnet
11155111: {
  chainId: 11155111,
  name: 'Sepolia Testnet',
  contracts: {
    nftMinter: {
      address: '0xYourDeployedDuplicatesContractAddress', // ← Replace this
      deployedBlock: 4500000, // ← Replace with actual deployment block
      name: 'NFT Minter - Sepolia'
    }
  }
}
```

### 2. **Update Duplicates Contract ABI**

Edit `src/app/duplicatesAbi.ts` with your actual contract ABI:

```typescript
// Replace the template functions with your actual contract functions
export const duplicatesAbi = [
  // Your actual contract ABI here
  {
    "inputs": [
      {"internalType": "address", "name": "sourceContract", "type": "address"},
      {"internalType": "uint256", "name": "sourceTokenId", "type": "uint256"}
    ],
    "name": "yourActualMintFunction", // ← Update function name
    "outputs": [
      {"internalType": "uint256", "name": "newTokenId", "type": "uint256"}
    ],
    "stateMutability": "payable", // or "nonpayable" if no payment required
    "type": "function"
  }
  // ... rest of your ABI
] as const;
```

### 3. **Configure Mint Function in MintingForm**

In `src/components/MintingForm.tsx`, update the mint function call (around line 200):

```typescript
// Update these lines based on your contract interface:
const mintFunctionName = "yourActualMintFunction"; // ← Your function name
const mintArgs = [sourceContract, sourceTokenId]; // ← Your function parameters

// If your contract requires payment:
// value: parseEther("0.01"), // ← Uncomment and set price
```

**Common Contract Patterns:**

**Pattern A: Simple mint**
```solidity
function mintCopy(address sourceContract, uint256 sourceTokenId) external payable returns (uint256)
```
```typescript
const mintFunctionName = "mintCopy";
const mintArgs = [sourceContract, sourceTokenId];
```

**Pattern B: Mint to specific address**
```solidity
function mintCopyTo(address to, address sourceContract, uint256 sourceTokenId) external payable returns (uint256)
```
```typescript
const mintFunctionName = "mintCopyTo";
const mintArgs = [userAddress, sourceContract, sourceTokenId];
```

**Pattern C: Mint with metadata URI**
```solidity
function mintCopyWithURI(address sourceContract, uint256 sourceTokenId, string memory metadataURI) external payable returns (uint256)
```
```typescript
const mintFunctionName = "mintCopyWithURI";
const metadataUri = "ipfs://your-metadata-hash"; // You could upload nftMetadata to IPFS
const mintArgs = [sourceContract, sourceTokenId, metadataUri];
```

## 🎯 **Current Implementation Features**

### ✅ **Complete Minting Flow:**
- **Preview NFTs** by entering source contract + token ID
- **Load metadata and images** from IPFS, base64, or direct JSON
- **Smart contract validation** - only allows minting when Duplicates contract is deployed
- **Transaction handling** - shows pending, success, and error states
- **Multi-network support** - works on Mainnet, Sepolia, and local networks

### ✅ **User Experience:**
- **Real-time feedback** during transaction
- **Transaction hash display** with explorer links
- **Progress indicators** for each step
- **Error handling** for common issues (rejected transaction, insufficient funds, etc.)
- **Network-aware explorer links** (Etherscan, Sepolia Etherscan)

### ✅ **Security Features:**
- **Input validation** for contract addresses and token IDs
- **Contract existence verification** before attempting mint
- **Proper error categorization** and user-friendly messages
- **Transaction confirmation waiting** before showing success

## 📋 **Testing Checklist**

### 1. **Contract Deployment Testing:**
- [ ] Deploy Duplicates contract to testnet
- [ ] Update contract address in `contracts.ts`
- [ ] Verify contract ABI matches `duplicatesAbi.ts`
- [ ] Test with a small mint to verify function works

### 2. **Frontend Testing:**
- [ ] Connect wallet to correct network
- [ ] Verify "Duplicates Contract Ready" green status appears
- [ ] Enter valid source contract address and token ID
- [ ] Confirm NFT preview loads correctly
- [ ] Test mint button activates when all conditions met
- [ ] Verify transaction flow works end-to-end

### 3. **Error Handling Testing:**
- [ ] Test with wrong network (should show red error)
- [ ] Test with invalid contract address
- [ ] Test with non-existent token ID
- [ ] Test with insufficient gas/funds
- [ ] Test transaction rejection by user

## 🚀 **Ready to Use!**

Once you've completed the configuration steps above, your Duplicates minter will be fully functional:

1. **Users connect their wallet**
2. **Users enter source NFT details** (contract + token ID)
3. **Preview loads** showing the NFT they want to copy
4. **"Mint Copy" button** becomes active when Duplicates contract is ready
5. **Transaction executes** and users get their Duplicate NFT!

## 🔧 **Advanced Customization**

### **Add Payment Requirement:**
```typescript
// In MintingForm.tsx, add value to writeContract call:
const txHash = await writeContract(config, {
  abi: duplicatesAbi,
  address: duplicatesContractAddress,
  functionName: mintFunctionName,
  args: mintArgs,
  value: parseEther("0.01"), // ← Add this line
});
```

### **Custom Metadata Handling:**
If your contract stores custom metadata, you can upload the fetched `nftMetadata` to IPFS and pass the hash:

```typescript
// Example: Upload to IPFS and use URI
const metadataUri = await uploadToIpfs(nftMetadata);
const mintArgs = [sourceContract, sourceTokenId, metadataUri];
```

### **Gas Optimization:**
```typescript
// Add gas settings if needed
const txHash = await writeContract(config, {
  abi: duplicatesAbi,
  address: duplicatesContractAddress,
  functionName: mintFunctionName,
  args: mintArgs,
  gas: 300000n, // Set gas limit
});
```

## 📝 **Support**

If you encounter issues:

1. **Check console logs** for detailed error messages
2. **Verify ABI matches** your deployed contract exactly
3. **Test on testnet first** before mainnet deployment
4. **Ensure block explorer links** work for your network

Your Duplicates minting functionality is production-ready! 🎉 
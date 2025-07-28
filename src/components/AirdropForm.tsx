"use client"

import InputField from "@/components/UI/InputField";
import { useState, useMemo, useEffect } from "react";
import { useChainId, useConfig, useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContracts } from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { chainsToTSender, erc20Abi, tsenderAbi } from "@/app/constants";
import { calculateTotal } from "@/utils";

export default function AirdropForm() {
    const [tokenAddress, setTokenAddress] = useState("");
    const [recipients, setRecipients] = useState("");
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");
    const total: number = useMemo(() => calculateTotal(amount), [amount]);
    const {data:hash, isPending, writeContractAsync} = useWriteContract()
    useWaitForTransactionReceipt({
        confirmations: 1,
        hash,
    })

    const account = useAccount();
    const config = useConfig();
    const chainId = useChainId();

    const { data: tokenData } = useReadContracts({
        contracts: [
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "decimals",
            },
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "name",
            },
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "balanceOf",
                args: [account.address],
            },
        ],
    })

    // Load form data from localStorage on component mount
    useEffect(() => {
        const savedTokenAddress = localStorage.getItem('airdrop-token-address');
        const savedRecipients = localStorage.getItem('airdrop-recipients');
        const savedAmount = localStorage.getItem('airdrop-amount');

        if (savedTokenAddress) setTokenAddress(savedTokenAddress);
        if (savedRecipients) setRecipients(savedRecipients);
        if (savedAmount) setAmount(savedAmount);
    }, []);

    // Save form data to localStorage whenever inputs change
    useEffect(() => {
        localStorage.setItem('airdrop-token-address', tokenAddress);
    }, [tokenAddress]);

    useEffect(() => {
        localStorage.setItem('airdrop-recipients', recipients);
    }, [recipients]);

    useEffect(() => {
        localStorage.setItem('airdrop-amount', amount);
    }, [amount]);

    async function getApprovedAmount(tSenderAddress: string | null): Promise<number> {
        if (!tSenderAddress) {
            setError("No address found, please use a supported chain");
            return 0;
        }

        const response = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: "allowance",
            args: [account.address, tSenderAddress as `0x${string}`],
        });
        
        return response as number;
    }


    async function handleSubmit() {
        setError(""); // Clear previous errors

        // 1a.If already approved, move to step 2
        // 1b. Approve tsender contract
        // 2. Call the airdrop function of tsend contract
        // 3. Wait for transaction to be mined

        const tSenderAddress = chainsToTSender[chainId].tsender; // might need to  be ["tsender"]
        const approvedAmount = await getApprovedAmount(tSenderAddress);

        if (approvedAmount < total) {
            const approvalHash = await writeContractAsync({
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "approve",
                args: [tSenderAddress as `0x${string}`, BigInt(total)],
            });
            await waitForTransactionReceipt(config, {
                hash: approvalHash,
            });

        } 
        await writeContractAsync({
                abi: tsenderAbi,
                address: tSenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress,
                    // Comma or new line separated
                    recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                    amount.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                    BigInt(total),
                ],
            });

        
        
    }

    return (
        <div>
            <InputField
                label="Token Address"
                placeholder="0x"
                value={tokenAddress}
                onChange={setTokenAddress}
            />
            <InputField
                label="Recipients"
                placeholder="0x123, 0x456, 0x789"
                value={recipients}
                onChange={setRecipients}
                large={true}
            />
            <InputField
                label="Amount"
                placeholder="100, 200, 300"
                value={amount}
                onChange={setAmount}
                large={true}
            />
            
            {/* Error Display */}
            {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}
            
            {/* Transaction Details Box */}
            {(
                <div className="mt-6 p-4 border border-gray-300 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Transaction Details</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Token Name:</span>
                            <span className="font-medium">{(tokenData?.[1]?.result as string) || "Requires Token Address"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Amount (Wei):</span>
                            <span className="font-medium font-mono">{total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Amount (Tokens):</span>
                            <span className="font-medium">
                                {(total / Math.pow(10, (tokenData?.[0]?.result as number) || 18)).toFixed(2)} {(tokenData?.[1]?.result as string)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Number of Recipients:</span>
                            <span className="font-medium">
                                {recipients.split(/[,\n]+/).filter(addr => addr.trim() !== '').length}
                            </span>
                        </div>
                    </div>
                </div>
            )}
            <button 
                onClick={handleSubmit} 
                disabled={isPending}
                className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 ${isPending ? 'opacity-75' : ''}`}
            >
                {isPending && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                            fill="none"
                        />
                        <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {isPending ? 'Processing...' : 'Submit'}
            </button>
        </div>
    )
}
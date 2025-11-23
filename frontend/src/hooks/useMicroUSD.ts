import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS } from "../lib/config";
import { microUsdAbi } from "../lib/abi/microUsdAbi";
import { paymentHubAbi } from "../lib/abi/paymentHubAbi";

export function useMicroUsd() {
  const { address } = useAccount();
  const { data: balance, refetch: refetchBalance } = useReadContract({
    abi: microUsdAbi,
    address: CONTRACTS.microUSD as `0x${string}`,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { writeContractAsync, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  async function approveHub(amount: bigint) {
    if (!address) throw new Error("No wallet");
    await writeContractAsync({
      abi: microUsdAbi,
      address: CONTRACTS.microUSD as `0x${string}`,
      functionName: "approve",
      args: [CONTRACTS.paymentHub, amount],
    });
    await refetchBalance();
  }

  return {
    address,
    balance: balance ?? 0n,
    approveHub,
    isPending,
    isConfirming,
    isConfirmed,
    refetchBalance,
  };
}

export function useDeposit() {
  const { writeContractAsync, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  async function deposit(amount: bigint) {
    await writeContractAsync({
      abi: paymentHubAbi,
      address: CONTRACTS.paymentHub as `0x${string}`,
      functionName: "deposit",
      args: [amount],
    });
  }

  return { deposit, isPending, isConfirming, isConfirmed };
}

import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { CONTRACTS } from "../lib/config";
import { paymentHubAbi } from "../lib/abi/paymentHubAbi";

export function usePaymentHub() {
  const { address } = useAccount();

  const { data: accountView, refetch } = useReadContract({
    abi: paymentHubAbi,
    address: CONTRACTS.paymentHub as `0x${string}`,
    functionName: "getAccountView",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const [userBalance = 0n, merchantEarnings = 0n] = (accountView as
    | [bigint, bigint]
    | undefined) ?? [0n, 0n];

  const { writeContractAsync, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  async function pay(merchant: `0x${string}`, amount: bigint) {
    await writeContractAsync({
      abi: paymentHubAbi,
      address: CONTRACTS.paymentHub as `0x${string}`,
      functionName: "pay",
      args: [merchant, amount],
    });
    await refetch();
  }

  async function withdraw(amount: bigint) {
    await writeContractAsync({
      abi: paymentHubAbi,
      address: CONTRACTS.paymentHub as `0x${string}`,
      functionName: "withdraw",
      args: [amount],
    });
    await refetch();
  }

  return {
    address,
    userBalance,
    merchantEarnings,
    pay,
    withdraw,
    isPending,
    isConfirming,
    isConfirmed,
    refetch,
  };
}

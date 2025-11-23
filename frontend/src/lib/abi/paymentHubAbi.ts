export const paymentHubAbi = [
  // balances
  {
    type: "function",
    name: "balances",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  // merchantEarnings
  {
    type: "function",
    name: "merchantEarnings",
    stateMutability: "view",
    inputs: [{ name: "merchant", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  // getAccountView
  {
    type: "function",
    name: "getAccountView",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [
      { name: "userBalance", type: "uint256" },
      { name: "earnings", type: "uint256" },
    ],
  },
  // deposit
  {
    type: "function",
    name: "deposit",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  // pay
  {
    type: "function",
    name: "pay",
    stateMutability: "nonpayable",
    inputs: [
      { name: "merchant", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  // withdraw
  {
    type: "function",
    name: "withdraw",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
] as const;

export const MICROMINT_L3 = {
  id: 7777777,
  name: "Micromint L3 Local",
  rpcUrl: "http://127.0.0.1:8545",
};

// Contracts can be provided via Vite env vars (VITE_MICROUSD, VITE_PAYMENTHUB)
// or patched into this file after running the deploy script.
const envMicro = (import.meta as any).env?.VITE_MICROUSD;
const envHub = (import.meta as any).env?.VITE_PAYMENTHUB;

export const CONTRACTS = {
  microUSD: envMicro ?? "0xREPLACE_WITH_MICROUSD_ADDRESS",
  paymentHub: envHub ?? "0xREPLACE_WITH_PAYMENTHUB_ADDRESS",
};

// Helper to programmatically set contract addresses at runtime (useful for tests)
export function setContracts(add: { microUSD?: string; paymentHub?: string }) {
  if (add.microUSD) CONTRACTS.microUSD = add.microUSD;
  if (add.paymentHub) CONTRACTS.paymentHub = add.paymentHub;
}

import { type FormEvent, useState } from "react";
import { usePaymentHub } from "../hooks/usePaymentHub";
import { useAccount } from "wagmi";

function formatAmount(amount: bigint, decimals = 6) {
  return Number(amount) / 10 ** decimals;
}

export function MerchantDashboard() {
  const { address } = useAccount();
  const { merchantEarnings, withdraw } = usePaymentHub();
  const [amountStr, setAmountStr] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amountStr || "0");
    if (!amt || amt <= 0) return;
    const amount = BigInt(Math.floor(amt * 1e6));
    await withdraw(amount);
    alert("Withdrawal requested from hub (L3)!");
  };

  return (
    <div className="card card-merchant">
      <div className="card-header">
        <div className="card-title">Merchant Dashboard</div>
        <span className="pill">Address: {address ? `${address.slice(0, 6)}...` : "Not connected"}</span>
      </div>

      <div className="balance-row">
        <span>Merchant Earnings:</span>
        <span>{formatAmount(merchantEarnings)} mUSD</span>
      </div>

      <form onSubmit={onSubmit}>
        <div className="input-group">
          <label className="input-label">Withdraw Amount (mUSD)</label>
          <input
            className="input-field"
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            placeholder="e.g. 0.10"
          />
        </div>

        <button className="button button-secondary" type="submit" disabled={!address}>
          Withdraw to Wallet (L3)
        </button>
      </form>

      <div className="tx-list">
        <div className="tx-item">
          <span>Note:</span>
          <span>In production this routes via L3→L2 bridge.</span>
        </div>
      </div>
    </div>
  );
}

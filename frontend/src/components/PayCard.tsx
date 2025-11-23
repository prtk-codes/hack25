import { type FormEvent, useState } from "react";
import { useAccount } from "wagmi";
import { useMicroUsd, useDeposit } from "../hooks/useMicroUSD";
import { usePaymentHub } from "../hooks/usePaymentHub";

function formatAmount(amount: bigint, decimals = 6) {
  return Number(amount) / 10 ** decimals;
}

export function PayCard() {
  const { address } = useAccount();
  const { balance: tokenBalance } = useMicroUsd();
  const { userBalance } = usePaymentHub();
  const { deposit } = useDeposit();

  const [merchant, setMerchant] = useState("");
  const [amountStr, setAmountStr] = useState("0.10");

  const handleDeposit = async () => {
    const amount = BigInt(Math.floor(parseFloat("5") * 1e6)); // 5 mUSD demo
    await deposit(amount);
    alert("Deposited 5 mUSD into hub (demo)");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // we call actual pay in MerchantCard: pass via props OR re-use hook here
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Pay as User</div>
        <span className="pill">Micropay on L3</span>
      </div>

      <div className="balance-row">
        <span>Wallet mUSD:</span>
        <span>{formatAmount(tokenBalance)} mUSD</span>
      </div>
      <div className="balance-row">
        <span>Hub Balance:</span>
        <span>{formatAmount(userBalance)} mUSD</span>
      </div>

      <button className="button" style={{ marginBottom: "0.75rem" }} onClick={handleDeposit}>
        1-click deposit 5 mUSD
      </button>

      <form onSubmit={onSubmit}>
        <div className="input-group">
          <label className="input-label">Amount to Pay (mUSD)</label>
          <input
            className="input-field"
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Merchant Address</label>
          <input
            className="input-field"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            placeholder="0xMerchant..."
          />
        </div>

        <button className="button" type="submit" disabled={!address}>
          Send Micropayment
        </button>
      </form>
    </div>
  );
}

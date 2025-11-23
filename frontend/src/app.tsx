import { useState } from "react";
import { WalletConnect } from "./components/WalletConnect";
import { PayCard } from "./components/PayCard";
import { MerchantDashboard } from "./components/MerchantDashboard";

export default function App() {
  const [tab, setTab] = useState<"user" | "merchant">("user");

  return (
    <div className="app-root">
      <div className="app-shell">
        <div className="app-title">Micromint L3 – Micropayment Demo</div>
        <div className="app-subtitle">
          A neo-brutalist Layer 3 UX for tiny payments on top of Arbitrum.
        </div>

        <div className="wallet-row">
          <div className="badge">
            <span>Network:</span>
            <strong>Micromint L3</strong>
          </div>
          <WalletConnect />
        </div>

        <div className="tab-row">
          <button
            className={`tab-button ${tab === "user" ? "active" : ""}`}
            onClick={() => setTab("user")}
          >
            User – Send Micropayment
          </button>
          <button
            className={`tab-button ${tab === "merchant" ? "active" : ""}`}
            onClick={() => setTab("merchant")}
          >
            Merchant – Earnings
          </button>
        </div>

        <div className="app-layout">
          {tab === "user" ? (
            <>
              <PayCard />
              <MerchantDashboard />
            </>
          ) : (
            <>
              <MerchantDashboard />
              <PayCard />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

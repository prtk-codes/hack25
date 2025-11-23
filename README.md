# Micromint L3 – Micropayment Layer 3 on Arbitrum

Micromint L3 is a **Layer 3 blockchain (L3)** built on **Arbitrum Orbit** and settled on **Arbitrum Sepolia (L2)** — designed specifically for **micropayments** under ₹10 / $0.10.

> The goal: Make **sub-$1 payments actually viable on-chain** by pushing them to a cheap, specialized L3 while still inheriting Ethereum-level security.

Micromint L3 provides:
- ⚡ Ultra-cheap micropayments using `MicroUSD` token  
- 💳 **PaymentHub** for deposit → micropay → merchant withdrawal  
- 🧪 Neo-brutalist frontend demo built with React + Wagmi  
- 🔗 Flexible bridge design to settle merchant withdrawals on **Arbitrum L2**

---

# ✨ Features

- **L3-native micropayment system**
- Simple ERC-20 token (`MicroUSD`) with 6 decimals
- Smart contract `PaymentHub`:
  - Users deposit once, then send tiny payments quickly
  - Merchants accumulate earnings
  - Merchants withdraw earnings on L3 (and in Phase 2: to L2)
- Clean React + TypeScript UI (neo-brutalist styling)
- Full Hardhat setup + deploy scripts
- Optional L3 → L2 bridging design included

---

# 🏗 Architecture Overview

                      Ethereum L1
                          ▲
                          │
                   (Rollup settlement)
                          │
                  Arbitrum L2 (Sepolia)
                          ▲
                          │
             ┌────────────┴────────────┐
             │                         │
       Arbitrum Orbit L3: Micromint (your chain)
             │
                  ▲                     ▲
                  │                     │
                 User                  Merchant
         (sends 0.10 mUSD)        (earns & withdraws)

---

# 📦 Preview

<img width="1920" height="1080" alt="Screenshot (162)" src="https://github.com/user-attachments/assets/435e3f34-0724-4fbc-8cae-63059fc7512e" />


---

# 🧩 Smart Contracts

## `MicroUSD.sol`
- Stable-style ERC-20 token with 6 decimals  
- Mintable by owner (used as faucet on L3)  
- Used for micropayments  

## `PaymentHub.sol`
- Users deposit mUSD
- Users send micropayments to merchants  
- Merchants withdraw on L3
- Optional: `withdrawToL2()` to route funds to a bridge gateway

## `L3Gateway.sol`
- Demo “bridge entry” contract  
- Holds tokens that are being moved from L3 → L2  
- Emits `BridgeRequested` event  
- Real version uses Arbitrum Orbit message passing

---

# ⚙️ Tech Stack

- **Blockchain**: Arbitrum Orbit L3 (Micromint), Arbitrum Sepolia L2
- **Contracts**: Solidity (0.8.x), OpenZeppelin
- **Dev Tooling**: Hardhat, TypeScript, dotenv
- **Frontend**: Vite + React + TS, Wagmi + Viem
- **Styling**: Neo-brutalist custom CSS

---

# 🚀 Getting Started

## 1. Install backend dependencies

```bash
npm install
npx hardhat compile
L3_RPC_URL=https://your-micromint-l3-rpc
PRIVATE_KEY=0xyour_test_wallet_private_key
CHAIN_ID_L3=12345

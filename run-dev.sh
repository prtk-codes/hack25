#!/usr/bin/env bash
set -euo pipefail

# Simple dev helper for Micromint L3 local demo
# Assumes you already started Anvil in a separate terminal:
# anvil --chain-id 7777777 --block-time 1

echo "==> 1) Compiling contracts"
npx hardhat compile

echo "==> 2) Deploying to localL3"
npx hardhat run scripts/deploy.ts --network localL3

echo "==> 3) Starting frontend dev server"
cd frontend
npm run dev

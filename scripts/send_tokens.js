#!/usr/bin/env node
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ethers } from 'ethers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseAmountToUnits(amountStr, decimals) {
  // amountStr like "1.5" -> units as BigInt for token with `decimals`
  if (!/^[0-9]+(\.[0-9]+)?$/.test(amountStr)) throw new Error('Invalid amount format');
  const [intPart, fracPart = ''] = amountStr.split('.');
  const frac = fracPart.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(intPart) * 10n ** BigInt(decimals) + BigInt(frac);
}

async function main() {
  const RPC = process.env.L3_RPC_URL || 'http://127.0.0.1:8545';
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  if (!PRIVATE_KEY) throw new Error('PRIVATE_KEY not set in .env');

  // recipient and amount can be passed as CLI args, otherwise read from env
  const [, , argRecipient, argAmount] = process.argv;
  const RECIPIENT = argRecipient || process.env.RECIPIENT;
  const AMOUNT = argAmount || process.env.AMOUNT;
  if (!RECIPIENT || !AMOUNT) {
    console.error('Usage: node scripts/send_tokens.js <recipient> <amount>\nOr set RECIPIENT and AMOUNT in .env');
    process.exit(1);
  }

  // read deployed MicroUSD address
  const deploymentsPath = path.join(__dirname, '..', 'deployments', 'l3', 'MicroUSD.json');
  if (!fs.existsSync(deploymentsPath)) throw new Error('deployments/l3/MicroUSD.json not found — run deploy first');
  const raw = fs.readFileSync(deploymentsPath, 'utf8').trim();
  if (!raw) throw new Error('deployments/l3/MicroUSD.json is empty — ensure deploy succeeded');
  const deployed = JSON.parse(raw);
  const microAddr = deployed.address;
  if (!microAddr) throw new Error('MicroUSD address not found in deployments file');

  const provider = new ethers.JsonRpcProvider(RPC);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  console.log('Sender:', await wallet.getAddress());
  console.log('RPC:', RPC);
  console.log('MicroUSD:', microAddr);

  const artifactPath = path.join(__dirname, '..', 'artifacts', 'contracts', 'tokens', 'MicroUSD.sol', 'MicroUSD.json');
  if (!fs.existsSync(artifactPath)) throw new Error('MicroUSD artifact not found; run `npx hardhat compile`');
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  const token = new ethers.Contract(microAddr, artifact.abi, wallet);

  const decimals = 6;
  const units = parseAmountToUnits(AMOUNT, decimals);

  const sender = await wallet.getAddress();
  const beforeSender = await token.balanceOf(sender);
  const beforeRecipient = await token.balanceOf(RECIPIENT);
  console.log(`Balances before — sender: ${beforeSender.toString()} (${Number(beforeSender) / 10 ** decimals} mUSD), recipient: ${beforeRecipient.toString()}`);

  console.log(`Sending ${AMOUNT} mUSD (${units.toString()} units) to ${RECIPIENT}...`);
  const tx = await token.transfer(RECIPIENT, units);
  console.log('Tx hash:', tx.hash);
  const receipt = await tx.wait();
  console.log('Tx confirmed in block', receipt.blockNumber);

  const afterSender = await token.balanceOf(sender);
  const afterRecipient = await token.balanceOf(RECIPIENT);
  console.log(`Balances after — sender: ${afterSender.toString()} (${Number(afterSender) / 10 ** decimals} mUSD), recipient: ${afterRecipient.toString()} (${Number(afterRecipient) / 10 ** decimals} mUSD)`);
}

main().catch(err => { console.error('Error:', err); process.exit(1); });

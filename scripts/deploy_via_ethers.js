#!/usr/bin/env node
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ethers } from 'ethers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const RPC = process.env.L3_RPC_URL || 'http://127.0.0.1:8545';
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  if (!PRIVATE_KEY) {
    console.error('PRIVATE_KEY missing in .env');
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(RPC);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log('Using deployer:', await wallet.getAddress());
  console.log('Provider RPC:', RPC);

  // Load artifacts
  const microPath = path.join(__dirname, '..', 'artifacts', 'contracts', 'tokens', 'MicroUSD.sol', 'MicroUSD.json');
  const hubPath = path.join(__dirname, '..', 'artifacts', 'contracts', 'core', 'PaymentHub.sol', 'PaymentHub.json');
  const microJson = JSON.parse(fs.readFileSync(microPath, 'utf8'));
  const hubJson = JSON.parse(fs.readFileSync(hubPath, 'utf8'));

  const microFactory = new ethers.ContractFactory(microJson.abi, microJson.bytecode, wallet);
  console.log('Deploying MicroUSD...');
  const micro = await microFactory.deploy();
  await micro.waitForDeployment();
  console.log('MicroUSD deployed to:', micro.target);

  const hubFactory = new ethers.ContractFactory(hubJson.abi, hubJson.bytecode, wallet);
  console.log('Deploying PaymentHub with microUSD:', micro.target);
  const hub = await hubFactory.deploy(micro.target);
  await hub.waitForDeployment();
  console.log('PaymentHub deployed to:', hub.target);

  saveDeployment('MicroUSD', micro.target, 'localL3', 7777777);
  saveDeployment('PaymentHub', hub.target, 'localL3', 7777777);

  console.log('Deployment complete');
}

function saveDeployment(name, address, networkName, chainId) {
  const deploymentsDir = path.join(__dirname, '..', 'deployments', 'l3');
  if (!fs.existsSync(deploymentsDir)) fs.mkdirSync(deploymentsDir, { recursive: true });
  const filePath = path.join(deploymentsDir, `${name}.json`);
  const data = { name, address, network: networkName, chainId, updatedAt: new Date().toISOString() };
  const tmpPath = filePath + '.tmp';
  try {
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), { encoding: 'utf8' });
    fs.renameSync(tmpPath, filePath);
    console.log(`Saved ${name} to ${filePath}`);
  } catch (err) {
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    throw err;
  }
}

main().catch(e => { console.error('Deployment error:', e); process.exit(1); });

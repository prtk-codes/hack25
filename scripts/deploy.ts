import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("-------------------------------------------------");
  console.log("Deploying Micromint L3 contracts with account:", deployer.address);
  console.log(
    "Deployer balance:",
    ethers.formatEther(await ethers.provider.getBalance(deployer.address)),
    "ETH"
  );
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);
  console.log("-------------------------------------------------");

  // 1) Deploy MicroUSD
  const MicroUSD = await ethers.getContractFactory("MicroUSD");
  const microUSD = await MicroUSD.deploy();
  await microUSD.waitForDeployment();

  const microUSDAddress = await microUSD.getAddress();
  console.log("MicroUSD deployed to:", microUSDAddress);

  // 2) Deploy PaymentHub
  const PaymentHub = await ethers.getContractFactory("PaymentHub");
  const paymentHub = await PaymentHub.deploy(microUSDAddress);
  await paymentHub.waitForDeployment();

  const paymentHubAddress = await paymentHub.getAddress();
  console.log("PaymentHub deployed to:", paymentHubAddress);

  // 3) Save deployment info to deployments/l3 (include network and chainId)
  const net = await ethers.provider.getNetwork();
  saveDeployment("MicroUSD", microUSDAddress, net.name, net.chainId);
  saveDeployment("PaymentHub", paymentHubAddress, net.name, net.chainId);

  console.log("-------------------------------------------------");
  console.log("Deployment completed ✅");
  console.log("Remember to copy these addresses into your frontend config.");
  console.log("-------------------------------------------------");
}

// helper to write JSON deployment files
function saveDeployment(name: string, address: string, networkName?: string, chainId?: number) {
  const deploymentsDir = path.join(__dirname, "..", "deployments", "l3");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const filePath = path.join(deploymentsDir, `${name}.json`);
  const data = {
    name,
    address,
    network: networkName ?? "micromintL3",
    chainId: chainId ?? null,
    updatedAt: new Date().toISOString()
  };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Saved ${name} deployment to ${filePath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

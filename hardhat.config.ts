import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import * as dotenv from "dotenv";

dotenv.config();

const L3_RPC_URL = process.env.L3_RPC_URL || "http://127.0.0.1:8545";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const CHAIN_ID_L3 = process.env.CHAIN_ID_L3
  ? parseInt(process.env.CHAIN_ID_L3, 10)
  : 12345; // fallback, but set in .env

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: { enabled: true, runs: 200 }
        }
      },
      {
        version: "0.8.28",
        settings: {
          optimizer: { enabled: true, runs: 200 }
        }
      }
    ]
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      type: "edr-simulated",
    },
    micromintL3: {
      type: "http",
      url: L3_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: CHAIN_ID_L3,
    },
    // Local Anvil network for Micromint L3 demo
    localL3: {
      type: "http",
      url: "http://127.0.0.1:8545",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 7777777,
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

export default config;

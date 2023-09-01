import { HardhatUserConfig, task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "@typechain/hardhat";
import { mnemonic, bscscanApiKey } from "./secrets.json";

task(
  "accounts",
  "Prints the list of accounts",
  async (_, hre: HardhatRuntimeEnvironment) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
      console.log(account.address);
    }
  }
);

const config: HardhatUserConfig = {
  defaultNetwork: "mainnet",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    hardhat: {},
    testnet: {
      url: "https://endpoints.omniatech.io/v1/bsc/testnet/public",
      chainId: 97,
      gasPrice: 40000000000,
      accounts: { mnemonic: mnemonic },
    },
    mainnet: {
      url: "https://bsc.publicnode.com",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: { mnemonic: mnemonic },
    },
  },
  etherscan: {
    apiKey: bscscanApiKey,
  },
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 20000,
  },
};

export default config;

import * as dotenv from "dotenv";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-solhint";
// import "@nomiclabs/hardhat-waffle";
// import "@nomicfoundation/hardhat-toolbox";
// import "hardhat-deploy";
// import "hardhat-deploy-ethers";
// import "hardhat-gas-reporter";
// import "hardhat-spdx-license-identifier";
// import "hardhat-typechain";
// import "hardhat-watcher";
// import "solidity-coverage";
// import "@tenderly/hardhat-tenderly";

import "hardhat-deploy";
//zk package
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-verify";
import "./scripts/verifyTask";

import { HardhatUserConfig, task } from "hardhat/config";

import { removeConsoleLog } from "hardhat-preprocessor";

dotenv.config();

const accounts = {
  mnemonic:
    process.env.MNEMONIC ||
    "test test test test test test test test test test test junk",
};

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: scanApiKeyFromEnv(),
    customChains: []
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    admin: {
      default: 1,
    },
  },
  networks: {
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      // gasPrice: 200 * 1000000000,
      chainId: 1,
    },
    localhost: {
      live: false,
      saveDeployments: true,
      tags: ["local"],
    },
    hardhat: {
      chainId: 421613,
      forking: {
        enabled: process.env.FORKING === "true",
        url: "https://arb1.arbitrum.io/rpc" || `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      },
      live: false,
      saveDeployments: true,
      tags: ["test", "local"],
    },
    zkTestnet: {
      url: "https://zksync2-testnet.zksync.dev",
      ethNetwork: "goerli",
      zksync: true,
      chainId: 280,
      verifyURL: 'https://zksync2-testnet-explorer.zksync.dev/contract_verification'
    },
    zkMainnet: {
      url: "https://mainnet.era.zksync.io",
      ethNetwork: "mainnet",
      zksync: true,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 5,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasPrice: 250000000000,
      gasMultiplier: 2,
    },
    matic: {
      url: "https://rpc-mainnet.maticvigil.com",
      accounts,
      chainId: 137,
      live: true,
      saveDeployments: true,
    },
    "matic-testnet": {
      url: "https://rpc-mumbai.maticvigil.com/",
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 80001,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasMultiplier: 2,
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org",
      accounts,
      chainId: 56,
      live: true,
      saveDeployments: true,
    },
    "bsc-testnet": {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts,
      chainId: 97,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasMultiplier: 2,
    },
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      accounts,
      chainId: 43114,
      live: true,
      saveDeployments: true,
      gasPrice: 470000000000,
    },
    "avalanche-testnet": {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts,
      chainId: 43113,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasMultiplier: 2,
    },
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc",
      accounts,
      chainId: 42161,
      saveDeployments: true,
    },
    "arbitrum-testnet": {
      url: "https://goerli-rollup.arbitrum.io/rpc",
      accounts,
      chainId: 421613,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasMultiplier: 2,
    },
  },
  preprocess: {
    eachLine: removeConsoleLog(
      (bre) =>
        bre.network.name !== "hardhat" && bre.network.name !== "localhost"
    ),
  },
  zksolc: {
    version: "1.3.10",
    compilerSource: "binary",
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  // watcher: {
  //   compile: {
  //     tasks: ["compile"],
  //     files: ["./contracts"],
  //     verbose: true,
  //   },
  // },
};

function scanApiKeyFromEnv() {
  const networkName = findNetworkNameFromArgv();
  let apiKey = process.env.ETHERSCAN_API_KEY;

  switch (networkName) {
    case "mainnet":
      apiKey = process.env.ETHERSCAN_API_KEY;
      break;
    case "goerli":
      apiKey = process.env.ETHERSCAN_API_KEY;
      break;
    case "matic":
      apiKey = process.env.POLYGONSCAN_API_KEY;
      break;
    case "matic-testnet":
      apiKey = process.env.POLYGONSCAN_API_KEY;
      break;
    case "bsc":
      apiKey = process.env.BSCSCAN_API_KEY;
      break;
    case "bsc-testnet":
      apiKey = process.env.BSCSCAN_API_KEY;
      break;
  }
  return apiKey;
}

function findNetworkNameFromArgv() {
  const index = process.argv.findIndex((arg) => arg === "--network")

  if (index === -1) {
    return null;
  }

  const networkName = process.argv[index + 1];
  return networkName;
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
export default config;

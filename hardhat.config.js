require("@nomicfoundation/hardhat-toolbox");
// require("@nomiclabs/hardhat-etherscan"); deprecated use @nomicfoundation/hardhat-verify instead, don`t remove this line
require("@nomicfoundation/hardhat-verify");


const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Destructure environment variables for easy access
const {
  // Private key for deploying contracts 
  PRIVATE_KEY,
  // Testnet 
  SEPOLIA_ALCHEMY_KEY,
  BSC_TESTNET_KEY,
  AMOY_ALCHEMY_KEY,
  // Mainnet
  ETH_MAINNET_ALCHEMY_KEY,
  BSC_MAINNET_ALCHEMY_KEY,
  POLYGON_MAINNET_ALCHEMY_KEY,
  // API keys for contract verification
  POLYGONSCAN_API_KEY,
  BSCSCAN_API_KEY,
  ETHERSCAN_API_KEY
} = process.env;

// log the environment variables
// console.log("BSC_TESTNET_KEY:", BSC_TESTNET_KEY);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    // Local development network
    hardhat: {
      chainId: 1337,
    },
    // Sepolia test network
    sepolia: {
      url: SEPOLIA_ALCHEMY_KEY,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    // Amoy (Polygon) test network
    amoy: {
      url: AMOY_ALCHEMY_KEY,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    // Binance Smart Chain test network
    bscTestnet: {
      url: BSC_TESTNET_KEY,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    // Ethereum main network
    ethMainnet: {
      url: ETH_MAINNET_ALCHEMY_KEY,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    // Binance Smart Chain main network
    bscMainnet: {
      url: BSC_MAINNET_ALCHEMY_KEY,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    // Polygon main network
    polygonMainnet: {
      url: POLYGON_MAINNET_ALCHEMY_KEY,
      accounts: [`0x${PRIVATE_KEY}`],
    }
  },
  etherscan: {
    apiKey: {
      // API keys for contract verification on Etherscan and similar services
      goerli: ETHERSCAN_API_KEY, 
      polygonMumbai: POLYGONSCAN_API_KEY,
      bscTestnet: BSCSCAN_API_KEY,
      mainnet: ETHERSCAN_API_KEY,
    }
  },
};

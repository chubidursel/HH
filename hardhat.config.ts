import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades"

import dotenv from "dotenv";
dotenv.config();


const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    goerli: {                             // `${process.env.ALCHEMY_API}`
      url: `${process.env.ALCHEMY_API}`, //url: `https://goerli.infura.io/v3/${process.env.INFURA_RINKEBY}`, 
      accounts: [`${process.env.PRIVATE_KEY_2}`]
    },
    mumbai: {
      url: `${process.env.POLYGON_ALCHEMY_URL}`,
      accounts:  [`${process.env.PRIVATE_KEY_DADDY}`]
    },
    bsc: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      accounts:  [`${process.env.PRIVATE_KEY}`]
    },
    arbitrum : {
      url: `${process.env.ARBITRUM_RPC}`,
      accounts:  [`${process.env.PRIVATE_KEY}`]
    },
    sepolia : {
      url: `${process.env.ALCHEMY_SEPOLIA}`,
      accounts:  [`${process.env.PRIVATE_KEY_DADDY}`]
    },
    siberium : {
      url: 'https://rpc.test.siberium.net/',
      accounts:  [`${process.env.PRIVATE_KEY}`]
    },
    opBnb : {
      url: 'https://opbnb-testnet-rpc.bnbchain.org/',
      accounts:  [`${process.env.PRIVATE_KEY_DADDY}`]
    },
  },
    etherscan: {
      // ETH => process.env.ETHERSCAN_VERIFY
      // POLYGON => process.env.POLYGON_VERIFY
      apiKey: process.env.ETHERSCAN_VERIFY, 
      // BSC => process.env.BSC_VERIFY
     // apiKey: process.env.ARBITRUM_VERIFY,  
    },

};

export default config;

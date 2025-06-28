import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import { ethers } from "ethers";
import { QUOTER_CONTRACT_ADDRESS } from "./uniswap/constants";

export const ethProvider = new ethers.InfuraProvider(
  "mainnet",
  process.env.INFURA_API_KEY
);

export const quoterContract = new ethers.Contract(
  QUOTER_CONTRACT_ADDRESS,
  Quoter.abi,
  ethProvider
);

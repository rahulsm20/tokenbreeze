import { ethers } from "ethers";

export const ethProvider = new ethers.InfuraProvider(process.env.INFURA_URL);

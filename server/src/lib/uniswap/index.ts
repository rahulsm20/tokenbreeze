import { ethProvider } from "@/lib/eth";
import { logger } from "@/logger";
import UniswapV3Quote from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import { FeeAmount } from "@uniswap/v3-sdk";
import { ethers } from "ethers";

const FEE_TIERS = [
  FeeAmount.LOWEST,
  FeeAmount.LOW_200,
  FeeAmount.LOW_300,
  FeeAmount.LOW_400,
  FeeAmount.LOW,
  FeeAmount.MEDIUM,
  FeeAmount.HIGH,
];

export const getQuoteFromUniswap = async (tokenA: {
  id: string;
  address: string;
}) => {
  for (const fee of FEE_TIERS) {
    try {
      const QUOTER_ADDRESS = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";
      const QUOTER_ABI = UniswapV3Quote.abi;
      const quoter = new ethers.Contract(
        QUOTER_ADDRESS,
        QUOTER_ABI,
        ethProvider
      );

      const tokenIn = tokenA.address; // WETH
      const tokenOut = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC
      const tokenContract = new ethers.Contract(
        tokenIn,
        ["function decimals() view returns (uint8)"],
        ethProvider
      );
      const decimals = await tokenContract.decimals();
      const amountIn = ethers.parseUnits("1.0", decimals);
      const sqrtPriceLimitX96 = 0;

      const quote = await quoter.quoteExactInputSingle.staticCall(
        tokenIn,
        tokenOut,
        fee,
        amountIn,
        sqrtPriceLimitX96
      );
      return ethers.formatUnits(quote[0], 6); // 6 for USDC
    } catch (err) {
      logger.error("Error in getQuoteFromUniswap", err);
      console.log("Error in getQuoteFromUniswap", err);
      return null;
    }
  }
};

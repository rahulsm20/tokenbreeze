import UniswapV3Quote from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import { FeeAmount } from "@uniswap/v3-sdk";
import { ethers } from "ethers";
import { logger } from "../../logger";
import { ethProvider } from "../eth";

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
  try {
    const QUOTER_ADDRESS = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";
    const QUOTER_ABI = UniswapV3Quote.abi;
    const quoter = new ethers.Contract(QUOTER_ADDRESS, QUOTER_ABI, ethProvider);

    const tokenIn = tokenA.address; // WETH
    const tokenOut = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC
    const fee = FeeAmount.MEDIUM;
    const amountIn = ethers.parseUnits("1.0", 18); // 1 ETH
    const sqrtPriceLimitX96 = 0;

    const quote = await quoter.quoteExactInputSingle.staticCall(
      tokenIn,
      tokenOut,
      fee,
      amountIn,
      sqrtPriceLimitX96
    );
    const amountOut = ethers.formatUnits(quote[0], 6); // USDC has 6 decimals
    console.log({ amountOut, quote });
    return quote;
  } catch (err) {
    logger.error("Error in getQuoteFromUniswap", err);
    console.log("Error in getQuoteFromUniswap", err);
    return null;
  }
};

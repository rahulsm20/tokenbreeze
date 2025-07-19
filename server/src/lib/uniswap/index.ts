import { ethProvider } from "@/lib/eth";
import { logger } from "@/logger";
import UniswapV3Quote from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import { FeeAmount } from "@uniswap/v3-sdk";
import { ethers } from "ethers";

//-----------------------------------------------------------

const FEE_TIERS = [
  FeeAmount.LOW, // 500 (0.05%)
  FeeAmount.MEDIUM, // 3000 (0.3%)
  FeeAmount.HIGH, // 10000 (1%)
];

//-----------------------------------------------------------

const QUOTER_ADDRESS = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";
const QUOTER_ABI = UniswapV3Quote.abi;
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

//-----------------------------------------------------------

export const getQuoteFromUniswap = async (tokenA: {
  id: string;
  address: string;
}) => {
  const tokenIn = tokenA.address;
  const tokenOut = USDC_ADDRESS;

  try {
    const tokenContract = new ethers.Contract(
      tokenIn,
      ["function decimals() view returns (uint8)"],
      ethProvider
    );
    const decimals = await tokenContract.decimals();
    const amountIn = ethers.parseUnits("1.0", decimals);
    const sqrtPriceLimitX96 = 0;

    const quoter = new ethers.Contract(QUOTER_ADDRESS, QUOTER_ABI, ethProvider);

    for (const fee of FEE_TIERS) {
      try {
        const quote = await quoter.quoteExactInputSingle.staticCall(
          tokenIn,
          tokenOut,
          fee,
          amountIn,
          sqrtPriceLimitX96
        );

        // Return price in USDC (6 decimals)
        return parseFloat(ethers.formatUnits(quote[0], 6));
      } catch (innerErr) {
        logger.warn(`Pool not available for fee tier ${fee}`);
        continue;
      }
    }

    logger.error(`No valid pool found for ${tokenIn} → ${tokenOut}`);
    return null;
  } catch (err) {
    logger.error("Error in getQuoteFromUniswap", err);
    return null;
  }
};

//-----------------------------------------------------------

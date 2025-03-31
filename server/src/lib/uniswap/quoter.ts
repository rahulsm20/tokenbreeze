import { ethers } from "ethers";

const QUOTER_ABI = [
  {
    inputs: [
      { internalType: "address", name: "tokenIn", type: "address" },
      { internalType: "address", name: "tokenOut", type: "address" },
      { internalType: "uint24", name: "fee", type: "uint24" },
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "uint160", name: "sqrtPriceLimitX96", type: "uint160" },
    ],
    name: "quoteExactInputSingle",
    outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class UniswapV3Quoter {
  private quoter: ethers.Contract;

  constructor(
    provider: ethers.providers.JsonRpcProvider,
    quoterAddress: string
  ) {
    this.quoter = new ethers.Contract(quoterAddress, QUOTER_ABI, provider);
  }

  async getQuoteExactInputSingle(params: {
    tokenIn: string;
    tokenOut: string;
    fee: number;
    amountIn: string;
    sqrtPriceLimitX96?: string;
  }): Promise<string> {
    const { tokenIn, tokenOut, fee, amountIn, sqrtPriceLimitX96 = 0 } = params;

    try {
      const quotedAmountOut =
        await this.quoter.callStatic.quoteExactInputSingle(
          tokenIn,
          tokenOut,
          fee,
          amountIn,
          sqrtPriceLimitX96
        );

      return quotedAmountOut.toString();
    } catch (error) {
      console.error("Error getting quote:", error);
      throw error;
    }
  }
}

// Helper function to format amount with decimals
export function parseAmount(amount: number, decimals: number): string {
  return ethers.utils.parseUnits(amount.toString(), decimals).toString();
}

// Example usage
async function main() {
  // You'll need to replace these with your values
  const RPC_URL =
    "https://mainnet.infura.io/v3/584c50ccbff74cdc8770e2889c93272e";
  const QUOTER_ADDRESS = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6"; // Uniswap V3 Quoter

  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const quoter = new UniswapV3Quoter(provider, QUOTER_ADDRESS);

  // Example: Quote 1 WETH to USDC
  const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

  try {
    const amountIn = parseAmount(1, 18); // 1 WETH with 18 decimals

    const quotedAmount = await quoter.getQuoteExactInputSingle({
      tokenIn: WETH,
      tokenOut: USDC,
      fee: 3000, // 0.3%
      amountIn: amountIn,
    });

    console.log("Quote amount out:", ethers.utils.formatUnits(quotedAmount, 6)); // USDC has 6 decimals
  } catch (error) {
    console.error("Error:", error);
  }
}

export default UniswapV3Quoter;

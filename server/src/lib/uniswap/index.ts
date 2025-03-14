import { SUPPORTED_CHAINS, Token } from "@uniswap/sdk-core";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { computePoolAddress, FeeAmount } from "@uniswap/v3-sdk";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { fromReadableAmount } from "../../utils";
import { ethProvider, quoterContract } from "../eth";
import { POOL_FACTORY_CONTRACT_ADDRESS, USDC_TOKEN } from "./constants";
import { isAddress } from "ethers/lib/utils";

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
  if (isAddress(tokenA.address)) {
    console.log({ tokenA });
    const tokenIn = new Token(SUPPORTED_CHAINS[0], tokenA.address, 18);
    const mainnet = process.env.INFURA_URL;
    const CurrentConfig = {
      rpc: {
        mainnet,
      },
      tokens: {
        in: tokenIn,
        amountIn: 1,
        out: USDC_TOKEN,
      },
    };

    if (CurrentConfig.tokens.in.address != CurrentConfig.tokens.out.address) {
      let selectedFee: FeeAmount | null = null;

      // Find the first pool with liquidity
      for (const fee of FEE_TIERS) {
        let maxLiquidity = 0;
        const poolAddress = computePoolAddress({
          factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
          tokenA: CurrentConfig.tokens.in,
          tokenB: CurrentConfig.tokens.out,
          fee,
        });

        const poolContract = new ethers.Contract(
          poolAddress,
          IUniswapV3PoolABI.abi,
          ethProvider
        );

        try {
          const liquidity = await poolContract.liquidity();
          if (liquidity && liquidity.gt(0) && liquidity.gt(maxLiquidity)) {
            selectedFee = fee; // Found a pool with liquidity
            break;
          }
        } catch (error) {
          continue;
        }
      }

      if (!selectedFee) {
        return null;
      }

      const currentPoolAddress = computePoolAddress({
        factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
        tokenA: CurrentConfig.tokens.in,
        tokenB: CurrentConfig.tokens.out,
        fee: selectedFee,
      });
      ``;

      const poolContract = new ethers.Contract(
        currentPoolAddress,
        IUniswapV3PoolABI.abi,
        ethProvider
      );

      const [token0, token1, fee] = await Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
        poolContract.liquidity(),
        poolContract.slot0(),
      ]);

      const quotedAmountOut =
        await quoterContract.callStatic.quoteExactInputSingle(
          token0,
          token1,
          fee,
          fromReadableAmount(
            CurrentConfig.tokens.amountIn,
            CurrentConfig.tokens.in.decimals
          ).toString(),
          0
        );
      const bigNumber = new BigNumber(quotedAmountOut._hex);
      console.log({ name: tokenA.id, number: bigNumber.toString(), fee });
      return bigNumber.dividedBy(new BigNumber(10).pow(18)).toString();
    }
    return null;
  }
  return null;
};

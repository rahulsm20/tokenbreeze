import { Token } from "@uniswap/sdk-core";

interface ExampleConfig {
  rpc: {
    local: string;
    mainnet: string;
  };
  tokens: {
    in: Token;
    amountIn: number;
    out: Token;
    poolFee: number;
  };
}

// export const CurrentConfig: ExampleConfig = {...}

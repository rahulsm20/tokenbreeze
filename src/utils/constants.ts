export const jwtSecret = process.env.JWT_SECRET || "secret";

export const DEX_SOURCES = {
  UNISWAP: "uniswap",
  SUSHISWAP: "sushiswap",
  PANCAKESWAP: "pancakeswap",
  QUICKSWAP: "quickswap",
  COINBASE: "coinbase",
};

export const API_SOURCES = {
  POLYGON: "polygon",
  COINGECKO: "coingecko",
  CRYPTO_COMPARE: "cryptoCompare",
  COINBASE: "coinbase",
};

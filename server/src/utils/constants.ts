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
  COIN_MARKET_CAP: "coinmarketcap",
};

export const CRYPTO_TICKERS = {
  BTC: "X:BTCUSD",
  ETH: "X:BTCETH",
  ADA: "ADA",
  DOT: "DOT",
  UNI: "UNI",
  LINK: "LINK",
  AAVE: "AAVE",
  COMP: "COMP",
  SUSHI: "SUSHI",
};

export const TICKERS_MAP = {
  bitcoin: {
    polygon: "X:BTCUSD",
    coinmarketcap: "bitcoin",
  },
};

export const DEX_MAP = {
  uniswap: {
    address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
  },
  sushiswap: {
    address: "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2",
  },
  pancakeswap: {
    address: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
  },
  quickswap: {
    address: "0x831753dd7087cac61ab5644b308642cc1c33dc13",
  },
};

export const API_KEY = {
  COIN_MARKET_CAP: process.env.CMC_API_KEY || "",
  POLYGON: process.env.POLYGON_API_KEY || "",
  COINBASE: process.env.COINBASE_API_KEY || "",
};

export const PROVIDERS = {
  COIN_MARKET_CAP: "CoinMarketCap",
  POLYGON: "Polygon.io",
  COINGECKO: "CoinGecko",
  COINBASE: "Coinbase",
  UNISWAP: "Uniswap",
  ONEINCH: "1inch",
  BINANCE: "Binance",
};

export const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

// export const BINANCE_

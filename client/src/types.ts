export type CoinType = {
  quote: {
    USD: {
      price: number;
      percent_change_1h: number;
      percent_change_7d: number;
      percent_change_24h: number;
    };
  };
  symbol: string;
  tags: string[];
  name: string;
};

export type NewCoinType = {
  info: {
    id: string;
    name: string;
    symbol: string;
    price: number;
    current_price: number;
    price_change_percentage_24h: number;
    image: string;
    // price_change_1h: number;
    // price_change_7d: number;
  };
  providers: string[];
  results: {
    provider: string;
    price: number;
    percent_change_24h: number;
    price_change_percentage_24h: number;
  }[];
};

export enum DateRange {
  one_hour,
  seven_days,
  twenty_four_hours,
  thirty_days,
}

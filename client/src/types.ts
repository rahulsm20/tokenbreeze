export type WalletAction = "Buy / Sell" | "Send" | "Swap";

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
    total_supply: number;
    market_cap: number;
    total_volume: number;
  }[];
};

export enum DateRange {
  one_hour,
  seven_days,
  twenty_four_hours,
  thirty_days,
}

export type OtherDetailsType = {
  id: string;
  name: string;
  provider: string;
  total_supply: number;
  market_cap: number;
  total_volume: number;
  // price_change_1h: number;
  // price_change_7d: number;
};

export type StoreRootState = {
  wallet: {
    info: {
      address: string;
      balance: number;
      transactions: any[];
    };
  };
};

export type TransactionType = {
  from: string;
  to: string;
  timestamp: number;
  value: string;
  hash: string;
  gas?: string;
  gasPrice?: string;
};

export type UserDetailsType = {
  stock?: string;
  walletAddress?: string;
};

export type ModalProps = {
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  okText?: string | React.ReactNode;
  cancelText?: string;
  onOk?: () => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  children?: React.ReactNode;
  setModalOpen?: (open: boolean) => void;
  modalOpen?: boolean;
  disableButtons?: boolean;
};

export type onSwapProps = {
  to: string;
  from: string;
  amount: string;
};

// ------------------------------------------------------

import { DEX_AGGREGATOR_SPECIFIC } from "@/graphql/queries";
import { NewCoinType } from "@/types";
import { useLazyQuery } from "@apollo/client";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import StockChart from "../charts/StockChart";
import CurrencySelector from "../currency-selector";
import ProviderCardList from "../data/ProviderCardList";
import { TimeRangeSelector } from "../time-range-selector";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

dayjs.extend(advancedFormat);

// ------------------------------------------------------

/**
 * CoinModal.tsx
 * This component displays a modal with detailed information about a specific cryptocurrency.
 * It includes price data from various providers, a chart showing price changes over time,
 * and other details such as total supply and market cap.
 *
 * @component
 * @example
 * type NewCoinType = {
    info: {
      id: string;
      name: string;
      symbol: string;
      price: number;
      current_price: number;
      price_change_percentage_24h: number;
      image: string;
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
 * const [coin, setCoin] = useState(null);
 * <CoinModal open={coin} setOpen={setCoin} />
 */
export const CoinModal = ({
  currency,
  setCurrency = () => {},
  open,
  setOpen,
  timeRange = "24h",
  setTimeRange = () => {},
}: {
  open: NewCoinType | null;
  setOpen: (open: NewCoinType | null) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  timeRange?: string;
  setTimeRange?: (timeRange: string) => void;
}) => {
  const [fetchChartData, { loading, data, error }] = useLazyQuery(
    DEX_AGGREGATOR_SPECIFIC,
    {
      fetchPolicy: "no-cache",
    }
  );
  const [retried, setRetried] = useState(0);

  useEffect(() => {
    if (open?.info.id) {
      fetchChartData({
        variables: {
          id: open?.info.id.toLowerCase(),
          symbol: open?.info.symbol.toUpperCase(),
          dateRange: timeRangeMap[timeRange as keyof typeof timeRangeMap],
          currency,
        },
      });
    }
  }, [open, timeRange, currency]);

  useEffect(() => {
    if (error) {
      toast.error("Error fetching chart data. Please try again later.", {
        description: "This may be due to a network issue or an invalid symbol.",
      });
      if (retried == 0) {
        fetchChartData({
          variables: {
            symbol: open?.info.name.toLowerCase(),
          },
        });
        setRetried((retry) => retry + 1);
      } else if (retried == 1) {
        fetchChartData({
          variables: {
            symbol: open?.info.symbol.toLowerCase(),
          },
        });
        setRetried((retry) => retry + 1);
      }
    }
  }, [error, retried]);

  const timeRangeMap = {
    "24h": "twenty_four_hours",
    "7d": "seven_days",
    "30d": "thirty_days",
    "1h": "one_hour",
  };

  return (
    <Dialog
      open={open ? true : false}
      onOpenChange={() => setOpen(open ? null : open)}
    >
      <DialogContent className="lg:mx-0 max-w-[calc(100%-5rem)] h-3/4 lg:max-w-screen-lg">
        <DialogHeader className="flex flex-col gap-1">
          <DialogTitle className="flex items-center gap-2">
            {open?.info.image && (
              <img className="h-4 w-4" src={open?.info.image} />
            )}
            {open?.info.name} ({open?.info.symbol})
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex flex-col gap-2">
          <div className="flex gap-2 w-full justify-between">
            <TimeRangeSelector
              timeRange={timeRange}
              setTimeRange={setTimeRange}
            />
            <CurrencySelector currency={currency} setCurrency={setCurrency} />
          </div>
          <section className="flex flex-col md:flex-row gap-5">
            <ProviderCardList
              open={open}
              currency={currency}
              data={data?.dexAggregatorSpecific}
            />
            <StockChart
              loading={loading}
              data={data}
              timeRange={timeRange}
              currency={currency}
            />
          </section>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

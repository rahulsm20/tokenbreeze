// ------------------------------------------------------------------------------
import CurrencySelector from "@/components/currency-selector";
import { newCoinColumns } from "@/components/home/columns";
import { DataTable } from "@/components/home/data-table";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DEX_AGGREGATOR } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import {
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  Info,
  RefreshCcw,
} from "lucide-react";
import { useState } from "react";

/**
 * Home component that displays aggregated cryptocurrency prices.
 * It fetches data from the DEX aggregator and displays it in a table format.
 * @returns Home component
 */
const Home = () => {
  const [currency, setCurrency] = useState("usd");
  const [isRefetching, setIsRefetching] = useState(false);

  const {
    loading: loadingData,
    data: dexData,
    refetch,
  } = useQuery(DEX_AGGREGATOR, { variables: { currency } });

  const tooltipData = (
    <div className="text-wrap w-40 p-2">
      The prices are aggregated from CoinGecko and CoinMarketCap.
    </div>
  );

  const handleRefetch = async () => {
    try {
      setIsRefetching(true);
      await refetch();
    } finally {
      setIsRefetching(false);
    }
  };

  const isPresent =
    dexData &&
    dexData.dexAggregator &&
    dexData.dexAggregator.length > 0 &&
    dexData.dexAggregator.some(
      (item: { providers: { name: string }[] }) =>
        item.providers &&
        item.providers.some(
          (provider: { name: string }) => provider.name === "1inch"
        )
    );

  return (
    <Layout>
      <div className="p-10 flex flex-col gap-3">
        <h1 className="flex text-lg lg:text-xl items-center justify-between gap-2 flex-col md:flex-row">
          <p className="flex items-center gap-2">
            <span>Aggregated Cryptocurrency Prices</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="bg-background border text-foreground">
                  {tooltipData}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </p>
          <div className="flex items-center gap-2">
            <Button
              className="ml-auto"
              variant="outline"
              onClick={handleRefetch}
              disabled={isRefetching || loadingData}
            >
              <RefreshCcw
                className={isRefetching ? "animate-spin text-primary" : ""}
              />
            </Button>
            <CurrencySelector currency={currency} setCurrency={setCurrency} />
          </div>
        </h1>
        {loadingData ? (
          <Ellipsis className="animate-pulse" />
        ) : (
          <DataTable
            columns={() => newCoinColumns(currency)}
            data={dexData ? dexData.dexAggregator : []}
            paginate
            showPageData={false}
            previousIcon={<ChevronLeft />}
            nextIcon={<ChevronRight />}
            currency={currency}
            setCurrency={setCurrency}
          />
        )}
      </div>
    </Layout>
  );
};

export default Home;

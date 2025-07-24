// ------------------------------------------------------------------------------
import CurrencySelector from "@/components/currency-selector";
import { newCoinColumns } from "@/components/home/columns";
import { DataTable } from "@/components/home/data-table";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DEX_AGGREGATOR, SEARCH_AGGREGATOR } from "@/graphql/queries";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  Info,
  RefreshCcw,
} from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Home component that displays aggregated cryptocurrency prices.
 * It fetches data from the DEX aggregator and displays it in a table format.
 * @returns Home component
 */
const Home = () => {
  const [currency, setCurrency] = useState("usd");
  const [query, setQuery] = useState("");
  const [isRefetching, setIsRefetching] = useState(false);
  const [tableData, setTableData] = useState([]);

  const { loading: loadingData, refetch } = useQuery(DEX_AGGREGATOR, {
    variables: { currency },
    onCompleted: (data) => {
      setTableData(data.dexAggregator || []);
    },
  });

  const [searchTokens, { loading: loadingSearch }] = useLazyQuery(
    SEARCH_AGGREGATOR,
    {
      variables: { currency, page: 1, query },
      fetchPolicy: "network-only",
      onCompleted: (data) => {
        setTableData(data.searchDexAggregator || []);
      },
      onError: (error) => {
        console.error("Search error", error);
      },
    }
  );

  const tooltipData = (
    <div className="text-wrap w-40 p-2">
      The prices are aggregated from CoinGecko, Coinbase and Binance.
    </div>
  );

  const handleRefetch = async () => {
    try {
      setIsRefetching(true);
      return await refetch();
    } finally {
      setIsRefetching(false);
    }
  };

  // const isPresent =
  //   dexData &&
  //   dexData.dexAggregator &&
  //   dexData.dexAggregator.length > 0 &&
  //   dexData.dexAggregator.some(
  //     (item: { providers: { name: string }[] }) =>
  //       item.providers &&
  //       item.providers.some(
  //         (provider: { name: string }) => provider.name === "1inch"
  //       )
  //   );

  useEffect(() => {
    if (query.trim() === "") {
      if (!loadingData) {
        handleRefetch().then((data) => {
          setTableData(data.data.dexAggregator || []);
          return;
        });
      }
      return;
    }

    const timeout = setTimeout(() => {
      searchTokens({ variables: { currency, page: 1, query } });
    }, 500);

    return () => clearTimeout(timeout);
  }, [query, currency]);

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
              disabled={isRefetching || loadingData || loadingSearch}
            >
              <RefreshCcw
                className={isRefetching ? "animate-spin text-primary" : ""}
              />
            </Button>
            <CurrencySelector currency={currency} setCurrency={setCurrency} />
          </div>
        </h1>
        <Input
          placeholder="Search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          className="max-w-sm h-8"
        />
        {isRefetching || loadingData || loadingSearch ? (
          <Ellipsis className="animate-pulse" />
        ) : (
          <DataTable
            columns={() => newCoinColumns(currency)}
            data={tableData}
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

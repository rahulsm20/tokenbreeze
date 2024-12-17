import { newCoinColumns } from "@/components/home/columns";
import { DataTable } from "@/components/home/data-table";
import Layout from "@/components/Layout";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DEX_AGGREGATOR } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import { ChevronLeft, ChevronRight, Ellipsis, Info } from "lucide-react";

const Home = () => {
  const { loading: loadingData, data: dexData } = useQuery(DEX_AGGREGATOR);
  const tooltipData = (
    <div className="text-wrap w-40 p-2">
      The prices are aggregated from various sources including CoinGecko,
      CoinMarketCap, and Polygon.io
    </div>
  );
  return (
    <Layout>
      <div className="p-10 flex flex-col gap-5">
        <h1 className="flex text-2xl items-center gap-2">
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
        </h1>
        {loadingData ? (
          <Ellipsis className="animate-pulse" />
        ) : (
          <DataTable
            columns={newCoinColumns}
            data={dexData ? dexData.dexAggregator : []}
            paginate
            showPageData={false}
            previousIcon={<ChevronLeft />}
            nextIcon={<ChevronRight />}
          />
        )}
      </div>
    </Layout>
  );
};

export default Home;

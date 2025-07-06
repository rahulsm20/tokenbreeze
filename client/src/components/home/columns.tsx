import { CoinType, NewCoinType } from "@/types";
import { formatCurrency } from "@/utils";
import { PROVIDERS } from "@/utils/constants";
import { ColumnDef } from "@tanstack/react-table";
import SparklineChart from "../charts/SparklineChart";
import PriceChangeBadge from "./price-change-badge";

export const coinColumns: ColumnDef<CoinType>[] = [
  {
    accessorKey: "index",
    header: "#",
    cell: (info) => info.cell.row.index + 1,
  },
  {
    accessorKey: "name",
    header: "Token",
    cell: (info) => (
      <span className="flex p-2">
        {info.cell.row.original.name} ({info.cell.row.original.symbol})
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: (info) => formatCurrency(info.cell.row.original.quote.USD.price),
  },
  {
    accessorKey: "percent_change_1h",
    header: "1h Change",
    cell: (info) => (
      <PriceChangeBadge
        percentageChange={info.cell.row.original.quote.USD.percent_change_1h}
      />
    ),
  },
  {
    accessorKey: "percent_change_24h",
    header: "24h Change",
    cell: (info) => (
      <PriceChangeBadge
        percentageChange={info.cell.row.original.quote.USD.percent_change_24h}
      />
    ),
  },
  {
    accessorKey: "percent_change_7d",
    header: "7d Change",
    cell: (info) => (
      <PriceChangeBadge
        percentageChange={info.cell.row.original.quote.USD.percent_change_7d}
      />
    ),
  },
];

export const newCoinColumns = (currency: string): ColumnDef<NewCoinType>[] => {
  return [
    {
      accessorKey: "index",
      header: "#",
      cell: (info) => info.cell.row.index + 1,
    },
    {
      accessorKey: "info.name",
      id: "info.name",
      header: "Token",
      cell: (info) => (
        <div className="flex gap-2 items-center text-xs sm:text-base p-2 md:p-0">
          {info.cell.row.original.info.image && (
            <img src={info.cell.row.original.info.image} className="h-4 w-4" />
          )}
          <span className="p-2 text-xs sm:text-base hidden md:flex">
            {info.cell.row.original.info.name}
          </span>
          <span className="text-foreground/80 text-xs sm:text-base">
            {info.cell.row.original.info.symbol}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "preview",
      header: "Preview Chart",
      cell: (info) => {
        const data = info.cell.row.original.results.find(
          ({ provider }) => provider === PROVIDERS.COINGECKO
        );
        const change =
          info.cell.row.original.info.price_change_percentage_7d ||
          info.cell.row.original.results?.[0]?.percent_change_7d;

        if (data && data.sparkline_in_7d) {
          return (
            <SparklineChart
              data={data.sparkline_in_7d || []}
              color={change > 0 ? "green" : "red"}
            />
          );
        } else {
          return "-";
        }
      },
    },
    {
      accessorKey: "cmc",
      header: "CoinMarketCap",
      cell: (info) => (
        <div className="text-xs sm:text-base">
          {info.cell.row.original.results.find(
            (r) => r.provider === PROVIDERS.COINMARKETCAP
          )?.price
            ? formatCurrency(
                info.cell.row.original.results.find(
                  (r) => r.provider === PROVIDERS.COINMARKETCAP
                )?.price || 0,
                currency
              )
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "cg",
      header: "CoinGecko",
      cell: (info) => (
        <div className="text-xs sm:text-base">
          {info.cell.row.original.results.find(
            (r) => r.provider === PROVIDERS.COINGECKO
          )?.price
            ? formatCurrency(
                info.cell.row.original.results.find(
                  (r) => r.provider === PROVIDERS.COINGECKO
                )?.price || 0,
                currency
              )
            : "-"}
        </div>
      ),
    },
    // {
    //   accessorKey: "1inch",
    //   header: "1inch",
    //   cell: (info) => (
    //     <div className="text-xs sm:text-base">
    //       {info.cell.row.original.results.find(
    //         (r) => r.provider === PROVIDERS.ONEINCH
    //       )?.price
    //         ? formatCurrency(
    //             info.cell.row.original.results.find(
    //               (r) => r.provider === PROVIDERS.ONEINCH
    //             )?.price || 0,
    //             currency
    //           )
    //         : "-"}
    //     </div>
    //   ),
    // },
    {
      accessorKey: "percent_change_7d",
      header: "7d Change",
      cell: (info) => {
        const change =
          info.cell.row.original.info.price_change_percentage_7d ||
          info.cell.row.original.results?.[0]?.percent_change_7d;
        return <PriceChangeBadge percentageChange={change} />;
      },
    },
  ];
};

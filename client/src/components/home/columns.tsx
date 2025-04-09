import { CoinType, NewCoinType } from "@/types";
import { formatCurrency } from "@/utils";
import { PROVIDERS } from "@/utils/constants";
import { ColumnDef } from "@tanstack/react-table";
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

export const newCoinColumns: ColumnDef<NewCoinType>[] = [
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
              )?.price || 0
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
              )?.price || 0
            )
          : "-"}
      </div>
    ),
  },
  {
    accessorKey: "percent_change_24h",
    header: "24h Change",
    cell: (info) => (
      <PriceChangeBadge
        percentageChange={
          info.cell.row.original.info.price_change_percentage_24h ||
          info.cell.row.original.results?.[0]?.percent_change_24h
        }
      />
    ),
  },
];

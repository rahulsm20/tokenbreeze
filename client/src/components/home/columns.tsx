import { CoinType, NewCoinType } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import PriceChangeBadge from "./price-change-badge";
import { formatCurrency } from "@/utils";

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
      <div className="flex items-center">
        {info.cell.row.original.info.image && (
          <img src={info.cell.row.original.info.image} className="h-4 w-4" />
        )}
        <span className="flex p-2">{info.cell.row.original.info.name}</span>
        <span className="text-foreground/80">
          {info.cell.row.original.info.symbol}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: (info) => formatCurrency(info.cell.row.original.info.current_price),
  },
  // {
  //   accessorKey: "percent_change_1h",
  //   header: "1h Change",
  //   cell: (info) => (
  //     <PriceChangeBadge
  //       percentageChange={info.cell.row.original.info.price_change_1h}
  //     />
  //   ),
  // },
  {
    accessorKey: "percent_change_24h",
    header: "24h Change",
    cell: (info) => (
      <PriceChangeBadge
        percentageChange={
          info.cell.row.original.info.price_change_percentage_24h
        }
      />
    ),
  },
  // {
  //   accessorKey: "percent_change_7d",
  //   header: "7d Change",
  //   cell: (info) => (
  //     <PriceChangeBadge
  //       percentageChange={info.cell.row.original.info.price_change_7d}
  //     />
  //   ),
  // },
];

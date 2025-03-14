import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DEX_AGGREGATOR_SPECIFIC } from "@/graphql/queries";
import { NewCoinType } from "@/types";
import { formatCurrency } from "@/utils";
import { useLazyQuery } from "@apollo/client";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat"; // ES 2015
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  paginate?: boolean;
  previousIcon?: string | React.ReactNode;
  nextIcon?: string | React.ReactNode;
  showPageData?: boolean;
}

dayjs.extend(advancedFormat);

export function DataTable<TData, TValue>({
  columns,
  data,
  paginate = false,
  previousIcon = "Previous",
  nextIcon = "Next",
  showPageData = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [modal, setModal] = useState<NewCoinType | null>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: paginate ? getPaginationRowModel() : undefined,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      sorting,
      columnFilters,
    },
  });
  return (
    <div className="text-start w-full">
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Filter tokens..."
          value={
            (table.getColumn("info.name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) => {
            table.getColumn("info.name")?.setFilterValue(event.target.value);
          }}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border text-xs ">
        <Table className="overflow-x-scroll">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-start">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => setModal(row.original as NewCoinType)}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className=" text-start">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-start">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {paginate && (
        <div className="flex items-center justify-end space-x-2 py-4 flex-col gap-4 md:flex-row">
          <div className="flex gap-2">
            {showPageData && (
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {previousIcon}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {nextIcon}
            </Button>
          </div>
        </div>
      )}
      <CoinModal open={modal} setOpen={setModal} />
    </div>
  );
}

const CoinModal = ({
  open,
  setOpen,
}: {
  open: NewCoinType | null;
  setOpen: (open: NewCoinType | null) => void;
}) => {
  const [fetchChartData, { loading, data, error }] = useLazyQuery(
    DEX_AGGREGATOR_SPECIFIC
  );
  const [retried, setRetried] = useState(0);

  useEffect(() => {
    if (open?.info.id) {
      fetchChartData({
        variables: {
          symbol: open?.info.id.toLowerCase(),
        },
      });
    }
  }, [open]);

  useEffect(() => {
    if (error) {
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

  const hasPriceIncreased = open?.results
    .map((price) => {
      return price.provider == "CoinMarketCap"
        ? price.percent_change_24h
        : price.price_change_percentage_24h;
    })
    .some((change) => change > 0);

  return (
    <Dialog
      open={open ? true : false}
      onOpenChange={() => setOpen(open ? null : open)}
    >
      <DialogContent className="items-center max-h-full max-w-screen-sm md:max-w-screen-lg">
        <DialogHeader className="flex flex-col gap-1">
          <DialogTitle>
            {open?.info.name} ({open?.info.symbol})
          </DialogTitle>
        </DialogHeader>
        <section className="flex flex-col md:flex-row gap-2">
          <div className="flex flex-col gap-5">
            {open?.results.map((price) => {
              const percentageChange =
                price.provider == "CoinMarketCap"
                  ? price.percent_change_24h
                  : price.price_change_percentage_24h;
              return (
                <Card key={price.provider} className="p-3 rounded-none">
                  <div className="flex flex-col">
                    <CardHeader className="p-2">{price.provider}</CardHeader>
                    <CardContent className="p-2">
                      <CardDescription className="flex gap-2">
                        <span className="m-0">
                          {formatCurrency(price.price)}
                        </span>
                        <div>
                          {percentageChange > 0 ? (
                            <Badge className="text-white bg-green-600 hover:bg-green-500">
                              +{percentageChange}%
                            </Badge>
                          ) : (
                            <Badge className="text-white bg-red-600 hover:bg-red-500">
                              {percentageChange}%
                            </Badge>
                          )}
                        </div>
                      </CardDescription>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
          <ResponsiveContainer
            width="100%"
            height={500}
            className="flex items-center justify-center"
          >
            {loading ? (
              <Loader className="animate-spin h-4 w-4" />
            ) : (
              <LineChart
                width={730}
                height={400}
                data={data?.dexAggregatorSpecific}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis
                  dataKey="date"
                  domain={["dataMin-100", "dataMax"]}
                  tickFormatter={XAxisTickFormatter}
                />
                <YAxis
                  allowDataOverflow
                  domain={["auto", "auto"]}
                  type="number"
                  // domain={["dataMin", "dataMax"]}
                  tickFormatter={YAxisTickFormatter}
                />
                <Tooltip content={<CustomizedTooltip />} />
                <Legend />
                <Line
                  dot={false}
                  type="monotone"
                  dataKey="price"
                  stroke={hasPriceIncreased ? "#82ca9d" : "#ef4444"}
                  fill="#82ca9d"
                />
                <CartesianGrid vertical={false} strokeDasharray="4 1 2" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </section>
      </DialogContent>
    </Dialog>
  );
};

const CustomizedTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-transparent backdrop-blur-sm border p-2 rounded-md flex flex-col justify-between">
        <p className="flex gap-2">
          <span>{`${dayjs(payload[0]?.payload.date).format(
            "YYYY-MM-DD"
          )}`}</span>
          <span>{`${dayjs(payload[0]?.payload.date).format("hh:mm a")}`}</span>
        </p>
        <span className="flex">
          Price: {formatCurrency(payload[0]?.payload.price)}
        </span>
      </div>
    );
  }

  return null;
};

const XAxisTickFormatter = (value: number) => {
  return dayjs(value).format("HH:mm a");
};

const YAxisTickFormatter = (value: number) => {
  // if (value > 100000) {
  //   return `$${(value / 1000).toFixed(0)}k`;
  // }
  if (value > 1000) {
    return `$${(value / 1000).toFixed(2)}k`;
  }

  return formatCurrency(parseFloat(value.toFixed(4)));
};

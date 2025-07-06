import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NewCoinType } from "@/types";
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
import { useEffect, useState } from "react";
import { CoinModal } from "../modal/coin-modal";
import { Input } from "../ui/input";

//-------------------------------------------------------------------

interface DataTableProps<TData, TValue> {
  columns: () => ColumnDef<TData, TValue>[];
  data: TData[];
  paginate?: boolean;
  previousIcon?: string | React.ReactNode;
  nextIcon?: string | React.ReactNode;
  showPageData?: boolean;
  currency?: string;
  setCurrency?: (currency: string) => void;
  timeRange?: string;
  setTimeRange?: (timeRange: string) => void;
}

dayjs.extend(advancedFormat);

//-------------------------------------------------------------------

export function DataTable<TData, TValue>({
  columns,
  data,
  paginate = false,
  previousIcon = "Previous",
  nextIcon = "Next",
  showPageData = true,
  currency = "usd",
  setCurrency = () => {
    console.warn("setCurrency function not provided");
  },
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [modal, setModal] = useState<NewCoinType | null>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns: columns(),
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

  const [timeRange, setTimeRange] = useState("7d");
  useEffect(() => {
    if (modal) {
      const newRow = table.getRowModel().rows.find((row) => {
        const updatedRow = row.original as NewCoinType;
        return updatedRow.info.id === modal.info.id;
      });
      setModal(newRow?.original as NewCoinType);
    }
  }, [currency, timeRange]);
  return (
    <div className="text-start">
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Search"
          value={
            (table.getColumn("info.name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) => {
            table.getColumn("info.name")?.setFilterValue(event.target.value);
          }}
          className="max-w-sm"
        />
      </div>
      <div className="text-xs">
        <Table className="overflow-x-scroll">
          <TableHeader className="max-w-32">
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
                  title={`Click to view more details about ${row.getValue(
                    "info.name"
                  )}`}
                  onClick={() => setModal(row.original as NewCoinType)}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-start max-w-44">
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
      <CoinModal
        open={modal}
        setOpen={setModal}
        currency={currency}
        setCurrency={setCurrency}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />
    </div>
  );
}

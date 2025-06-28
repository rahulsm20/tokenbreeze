// ---------------------------------------------------------
import { TransactionType } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import CopyToClipboard from "react-copy-to-clipboard";
import { weiToEth } from "../../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

// --------------------------------------------------------

export const Columns: ColumnDef<TransactionType>[] = [
  {
    accessorKey: "hash",
    header: "Transaction Hash",
    cell: (info) => (
      <div
        style={{
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <TooltipProvider>
          <Tooltip>
            <CopyToClipboard text={info.cell.row.original.hash}>
              <TooltipTrigger className="hover:underline">
                {`${info.cell.row.original.hash.slice(
                  0,
                  6
                )}..${info.cell.row.original.hash.slice(-3)}`}
              </TooltipTrigger>
            </CopyToClipboard>
            <TooltipContent>
              <p>{"Copy Txn Hash"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: (info) =>
      info.cell.row.original.timestamp
        ? dayjs(new Date(info.cell.row.original.timestamp * 1000)).format(
            "YYYY-MM-DD HH:mm:ss"
          )
        : "",
  },
  {
    accessorKey: "to",
    header: "To",
    cell: (info) => (
      <TooltipProvider>
        <Tooltip>
          <CopyToClipboard text={info.cell.row.original.to}>
            <TooltipTrigger className="hover:underline">
              {`${info.cell.row.original.to.slice(
                0,
                6
              )}..${info.cell.row.original.to.slice(-3)}`}
            </TooltipTrigger>
          </CopyToClipboard>
          <TooltipContent>
            <p>{"Copy To Address"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "from",
    header: "From",
    cell: (info) => (
      <TooltipProvider>
        <Tooltip>
          <CopyToClipboard text={info.cell.row.original.from}>
            <TooltipTrigger className="hover:underline">
              {`${info.cell.row.original.from.slice(
                0,
                6
              )}..${info.cell.row.original.from.slice(-3)}`}
            </TooltipTrigger>
          </CopyToClipboard>
          <TooltipContent>
            <p>{"Copy From Address"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "value",
    header: "Value (ETH)",
    cell: (info) => `${weiToEth(info.cell.row.original.value)}`,
  },
  {
    accessorKey: "gas",
    header: "Gas (Wei)",
    cell: (info) => `${info.cell.row.original.gas || ""}`,
  },
];

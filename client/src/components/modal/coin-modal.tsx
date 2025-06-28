// ------------------------------------------------------
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEX_AGGREGATOR_SPECIFIC } from "@/graphql/queries";
import { NewCoinType } from "@/types";
import { formatCurrency } from "@/utils";
import { useLazyQuery } from "@apollo/client";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
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
import {
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { ContentType } from "recharts/types/component/Tooltip";
import { toast } from "sonner";
import { OtherDetailsColumns } from "../data/table/columns";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

dayjs.extend(advancedFormat);

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
  open,
  setOpen,
}: {
  open: NewCoinType | null;
  setOpen: (open: NewCoinType | null) => void;
}) => {
  const [fetchChartData, { loading, data, error }] = useLazyQuery(
    DEX_AGGREGATOR_SPECIFIC,
    {
      fetchPolicy: "no-cache",
    }
  );
  const [retried, setRetried] = useState(0);
  const [timeRange, setTimeRange] = useState("24h");
  const [currency, setCurrency] = useState("usd");

  useEffect(() => {
    if (open?.info.id) {
      fetchChartData({
        variables: {
          symbol: open?.info.id.toLowerCase(),
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

  const hasPriceIncreased = open?.results
    .map((price) => {
      return price.provider == "CoinMarketCap"
        ? price.percent_change_24h
        : price.price_change_percentage_24h;
    })
    .some((change) => change > 0);

  const timeRangeMap = {
    "24h": "twenty_four_hours",
    "7d": "seven_days",
    "30d": "thirty_days",
    "1h": "one_hour",
  };

  const updateVariable = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    updateState: (range: string) => void
  ) => {
    const target = e.target as HTMLElement;
    const range = target.innerText.toLowerCase() || "";
    updateState(range);
  };

  return (
    <Dialog
      open={open ? true : false}
      onOpenChange={() => setOpen(open ? null : open)}
    >
      <DialogContent className="items-center h-3/4 max-w-screen-sm md:max-w-screen-lg">
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
            <Tabs defaultValue="24h" value={timeRange}>
              <TabsList>
                <TabsTrigger
                  value="24h"
                  onClick={(e) => {
                    updateVariable(e, setTimeRange);
                  }}
                >
                  24h
                </TabsTrigger>
                <TabsTrigger
                  value="7d"
                  onClick={(e) => {
                    updateVariable(e, setTimeRange);
                  }}
                >
                  7d
                </TabsTrigger>
                <TabsTrigger
                  value="30d"
                  onClick={(e) => {
                    updateVariable(e, setTimeRange);
                  }}
                >
                  30d
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Tabs defaultValue="usd" value={currency}>
              <TabsList>
                <TabsTrigger
                  value="usd"
                  onClick={(e) => {
                    updateVariable(e, setCurrency);
                  }}
                >
                  USD
                </TabsTrigger>
                <TabsTrigger
                  value="gbp"
                  onClick={(e) => {
                    updateVariable(e, setCurrency);
                  }}
                >
                  GBP
                </TabsTrigger>
                <TabsTrigger
                  value="inr"
                  onClick={(e) => {
                    updateVariable(e, setCurrency);
                  }}
                >
                  INR
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <section className="flex flex-col md:flex-row gap-2">
            <div className="flex flex-col gap-5">
              {open?.results.map((price) => {
                const percentageChange =
                  price.provider == "CoinMarketCap"
                    ? price.percent_change_24h
                    : price.price_change_percentage_24h;
                return (
                  <Card key={price.provider} className="p-3">
                    <div className="flex flex-col">
                      <CardHeader className="p-2">{price.provider}</CardHeader>
                      <CardContent className="p-2">
                        <CardDescription className="flex gap-2">
                          <span className="m-0">
                            {formatCurrency(price.price, currency)}
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
              width="80%"
              height={500}
              className="flex items-center justify-center"
            >
              {loading ? (
                <Loader className="animate-spin h-4 w-4" />
              ) : data?.dexAggregatorSpecific.length > 0 ? (
                <LineChart
                  width={400}
                  height={400}
                  data={data?.dexAggregatorSpecific}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis
                    dataKey="date"
                    domain={["dataMin-100", "dataMax"]}
                    tickFormatter={(val) => XAxisTickFormatter(val, timeRange)}
                  />
                  <YAxis
                    allowDataOverflow
                    domain={["auto", "auto"]}
                    type="number"
                    tickFormatter={(data) => YAxisTickFormatter(data, currency)}
                  />
                  <Tooltip
                    content={
                      <CustomizedTooltip {...data} currency={currency} />
                    }
                  />
                  <Legend />
                  <Line
                    dot={false}
                    type="monotone"
                    dataKey="CoinGecko"
                    stroke={hasPriceIncreased ? "#82ca9d" : "#ef4444"}
                    fill="#82ca9d"
                  />
                  <CartesianGrid strokeDasharray="4 1 2" />
                </LineChart>
              ) : (
                <div className="flex items-center justify-center h-full w-full">
                  <span className="text-gray-500">No data available</span>
                </div>
              )}
            </ResponsiveContainer>
          </section>
        </DialogDescription>
        <Card className="p-3 border-none hover:bg-inherit">
          {open && open?.results.length > 0 && (
            <div className="flex flex-col">
              <CardHeader className="p-2 underline underline-offset-8">
                Other details
              </CardHeader>
              <CardContent className="p-2">
                <CardDescription className="flex gap-2 flex-col text-foreground">
                  <Table>
                    <TableHeader className="text-start">
                      <TableRow>
                        {OtherDetailsColumns.map((column) => (
                          <TableHead key={column.accessorKey}>
                            {column.header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {open?.results?.length > 0 &&
                        open?.results.map((res) => (
                          <TableRow>
                            <TableCell className="text-start">
                              {res.provider}
                            </TableCell>
                            <TableCell className="text-start">
                              {res.total_supply.toLocaleString("en-US")}
                            </TableCell>
                            <TableCell className="text-start">
                              {res.market_cap
                                ? formatCurrency(res.market_cap, currency)
                                : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardDescription>
              </CardContent>
            </div>
          )}
        </Card>
      </DialogContent>
    </Dialog>
  );
};

// ------------------------------------------------------
// Helper functions and components

type CustomizedTooltipProps = {
  active: any;
  payload: Payload<ValueType, NameType>[] | undefined;
  currency: string;
} & ContentType<ValueType, NameType>;

const CustomizedTooltip: React.FC<CustomizedTooltipProps> = ({
  active,
  payload,
  currency,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-transparent backdrop-blur-sm border p-2 rounded-md flex flex-col justify-between">
        <p className="flex gap-2">
          <span>{`${dayjs(payload[0]?.payload.date).format(
            "MMM Do YYYY"
          )}`}</span>
          <span>{`${dayjs(payload[0]?.payload.date).format("hh:mm a")}`}</span>
        </p>
        <span className="flex">
          CoinGecko: {formatCurrency(payload[0]?.payload.CoinGecko, currency)}
        </span>
      </div>
    );
  }

  return <></>;
};

/**
 * XAxisTickFormatter function formats the x-axis ticks based on the time range.
 * It uses the dayjs library to format the date and time.
 * @param value
 * @param timeRange
 * @returns
 */
const XAxisTickFormatter = (value: number, timeRange: string) => {
  if (timeRange == "24h") {
    return dayjs(value).format("h:mm a");
  }
  if (timeRange == "7d") {
    return dayjs(value).format("MMM D");
  }
  if (timeRange == "30d") {
    return dayjs(value).format("MMM D");
  }
  return dayjs(value).format("MMM D");
};

/**
 * YAxisTickFormatter function formats the y-axis ticks based on the currency.
 * It uses the formatCurrency utility function to format the value.
 * @param value
 * @param currency
 * @returns
 */
const YAxisTickFormatter = (value: number, currency: string) => {
  if (value > 1000) {
    return `$${(value / 1000).toFixed(2)}k`;
  }

  return formatCurrency(parseFloat(value.toFixed(4)), currency);
};

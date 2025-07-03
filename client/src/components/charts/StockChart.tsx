import { StockChartPropsType } from "@/types";
import { formatCurrency } from "@/utils";
import { COLORS } from "@/utils/constants";
import dayjs from "dayjs";
import { Loader } from "lucide-react";
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
    return `${formatCurrency(
      parseFloat((value / 1000).toFixed(2)),
      currency
    )}k`;
  }

  return formatCurrency(parseFloat(value.toFixed(4)), currency);
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

const StockChart = ({
  loading,
  data,
  timeRange,
  currency,
  hasPriceIncreased,
}: StockChartPropsType) => {
  return (
    <ResponsiveContainer
      width="100%"
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
            content={<CustomizedTooltip {...data} currency={currency} />}
          />
          <Legend />
          <Line
            dot={false}
            type="monotone"
            dataKey="CoinGecko"
            stroke={hasPriceIncreased ? COLORS.GREEN : COLORS.RED}
            fill={COLORS.GREEN}
          />
          <CartesianGrid strokeDasharray="4 1 2" />
        </LineChart>
      ) : (
        <div className="flex items-center justify-center h-full w-full">
          <span className="text-gray-500">No data available</span>
        </div>
      )}
    </ResponsiveContainer>
  );
};

export default StockChart;

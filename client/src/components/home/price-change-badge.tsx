import { ChevronDown, ChevronUp } from "lucide-react";

const PriceChangeBadge = ({
  percentageChange,
}: {
  percentageChange: number;
}) => {
  return (
    <div className="flex gap-1 items-center text-xs sm:text-base">
      {percentageChange > 0 ? (
        <>
          <ChevronUp className="text-green-500" />
          <span className="text-green-500 px-2 py-1">{percentageChange}%</span>
        </>
      ) : (
        <>
          <ChevronDown className="text-red-500" />
          <span className="text-red-500 px-2 py-1">{percentageChange}%</span>
        </>
      )}
    </div>
  );
};

export default PriceChangeBadge;

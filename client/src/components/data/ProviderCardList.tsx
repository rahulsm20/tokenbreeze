// ------------------------------------------------------

import { NewCoinType } from "@/types";
import { formatCurrency } from "@/utils";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const ProviderCardList = ({
  open,
  currency,
  data,
}: {
  open: NewCoinType | null;
  currency: string;
  data: { [key: string]: number }[] | undefined;
}) => {
  if (!data) {
    return (
      <div className="flex flex-col gap-5">
        <Skeleton className="h-[125px] w-[250px] md:w-52 rounded-xl" />
        <Skeleton className="h-[125px] w-[250px] md:w-52 rounded-xl" />
        <Skeleton className="h-[125px] w-[250px] md:w-52 rounded-xl" />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-5">
      {open?.results.map(({ provider, price_change_percentage_24h, price }) => {
        const initPrice =
          data?.find((item: { [key: string]: number }) => item?.[provider])?.[
            provider
          ] || 0;
        const finalPrice = data?.[data.length - 1]?.[provider] || 1;
        const priceChange = finalPrice - initPrice;

        const percentageChange = Number(
          (provider == "CoinGecko"
            ? price_change_percentage_24h
            : (priceChange / initPrice) * 100
          ).toFixed(4)
        );

        return (
          <Card key={provider} className="p-3 md:w-52 w-full">
            <div className="flex flex-col">
              <CardHeader className="p-2">{provider}</CardHeader>
              <CardContent className="p-2">
                <CardDescription className="flex gap-2 justify-between">
                  <span className="m-0">{formatCurrency(price, currency)}</span>
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
  );
};

export default ProviderCardList;

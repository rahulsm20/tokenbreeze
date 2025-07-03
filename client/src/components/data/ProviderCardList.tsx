// ------------------------------------------------------

import { NewCoinType } from "@/types";
import { formatCurrency } from "@/utils";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";

const ProviderCardList = ({
  open,
  currency,
}: {
  open: NewCoinType | null;
  currency: string;
}) => {
  return (
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
  );
};

export default ProviderCardList;

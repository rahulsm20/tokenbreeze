import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type CurrencySelectorProps = {
  currency: string;
  setCurrency: (value: string) => void;
};

const CurrencySelector = ({ currency, setCurrency }: CurrencySelectorProps) => {
  return (
    <Select value={currency} onValueChange={setCurrency}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Currency" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="usd">USD</SelectItem>
        <SelectItem value="gbp">GBP</SelectItem>
        <SelectItem value="eur">EUR</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default CurrencySelector;

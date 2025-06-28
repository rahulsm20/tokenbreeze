import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectOptionType = {
  label?: React.ReactNode;
  value: string;
};

type SelectProps = {
  name: string;
  label?: string;
  options: SelectOptionType[];
  value: string;
  icon?: React.ReactNode;
  showLabel?: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
  gap?: string;
  className?: string;
};
const TWSelect = ({
  options,
  value,
  label,
  showLabel = true,
  name,
  icon,
  onChange,
  placeholder,
  gap = "0",
  className,
}: SelectProps) => {
  return (
    <div
      className={`grid w-full max-w-sm items-center ${className} ${
        "gap-" + gap
      } `}
    >
      {showLabel && (
        <label htmlFor={name} className="flex">
          {label}
        </label>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={placeholder ? placeholder : "Theme"} />
        </SelectTrigger>
        <SelectContent>
          {options.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
              {icon}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TWSelect;

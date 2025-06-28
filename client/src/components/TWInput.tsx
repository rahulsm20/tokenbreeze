import { Input } from "@/components/ui/input";

type InputProps = {
  type?: string;
  name: string;
  label?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  showLabel?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const TWInput = ({
  type,
  name,
  onChange,
  placeholder,
  label,
  showLabel = true,
  ...props
}: InputProps) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      {showLabel && (
        <label htmlFor={name} className="flex">
          {label}
        </label>
      )}
      <div className="flex relative items-center">
        <Input
          type={type}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          {...props}
        />
        {props?.icon && (
          <div className="absolute right-4 rounded-l-none">{props?.icon}</div>
        )}
      </div>
    </div>
  );
};

export default TWInput;

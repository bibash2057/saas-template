import React from "react";
import { Input } from "../ui/input";
import { cn } from "cn";

interface DebouncedInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
}

const DebouncedInput = ({
  value: propValue,
  onChange,
  debounce = 300,
  className,
  ...props
}: DebouncedInputProps) => {
  const [value, setValue] = React.useState(propValue || "");

  React.useEffect(() => {
    setValue(propValue || "");
  }, [propValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce, onChange]);

  return (
    <Input
      {...props}
      className={cn("h-9 w-64 text-sm", className)}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default DebouncedInput;

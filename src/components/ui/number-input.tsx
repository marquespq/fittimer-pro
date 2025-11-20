import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      min = 0,
      max = 999,
      step = 1,
      value,
      onValueChange,
      onChange,
      ...props
    },
    ref
  ) => {
    const handleIncrement = () => {
      const currentValue = Number(value) || 0;
      const newValue = Math.min(currentValue + step, max);
      onValueChange?.(newValue);
    };

    const handleDecrement = () => {
      const currentValue = Number(value) || 0;
      const newValue = Math.max(currentValue - step, min);
      onValueChange?.(newValue);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      if (!isNaN(newValue) && newValue >= min && newValue <= max) {
        onValueChange?.(newValue);
      }
      onChange?.(e);
    };

    return (
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={Number(value) <= min}
          className={cn(
            "absolute left-1 z-10 h-8 w-8 rounded-lg",
            "flex items-center justify-center",
            "bg-gradient-to-br from-primary/10 to-primary/5",
            "border border-primary/20",
            "text-primary hover:bg-primary/20",
            "transition-all duration-200",
            "hover:scale-110 active:scale-95",
            "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100",
            "shadow-sm hover:shadow-md"
          )}
        >
          <Minus className="h-4 w-4" />
        </button>

        <input
          type="number"
          ref={ref}
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          className={cn(
            "flex h-12 w-full rounded-xl border-2 border-border/50",
            "bg-background/50 backdrop-blur-sm",
            "px-12 py-2 text-center text-lg font-mono font-bold tabular-nums",
            "ring-offset-background",
            "transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            "focus-visible:border-primary/50 focus-visible:bg-background",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            className
          )}
          {...props}
        />

        <button
          type="button"
          onClick={handleIncrement}
          disabled={Number(value) >= max}
          className={cn(
            "absolute right-1 z-10 h-8 w-8 rounded-lg",
            "flex items-center justify-center",
            "bg-gradient-to-br from-primary/10 to-primary/5",
            "border border-primary/20",
            "text-primary hover:bg-primary/20",
            "transition-all duration-200",
            "hover:scale-110 active:scale-95",
            "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100",
            "shadow-sm hover:shadow-md"
          )}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    );
  }
);
NumberInput.displayName = "NumberInput";

export { NumberInput };

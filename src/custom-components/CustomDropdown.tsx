import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
  icon?: string | React.ReactNode;
};

type DropdownProps = {
  options: Option[];
  selectedValue?: Option;
  onChange?: (value: Option) => void;
  isSearchable?: boolean;
  showSelectedOption?: boolean;
  disabled?: boolean;
  placeholder?: string;
  leftChild?: React.ReactNode;
  className?: string;
  dropdownClassName?: string;
  iconClassName?: string;
};

export function CustomDropdown({
  options,
  selectedValue,
  onChange,
  isSearchable = false,
  showSelectedOption = true,
  disabled = false,
  placeholder = "Select...",
  leftChild,
  className = "",
  dropdownClassName = "",
  iconClassName = "",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<Option | undefined>(selectedValue);

  const filteredOptions = useMemo(() => {
    return searchTerm
      ? options.filter((o) =>
          o.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;
  }, [searchTerm, options]);

  const handleSelect = (option: Option) => {
    setSelected(option);
    onChange?.(option);
    setOpen(false);
    setSearchTerm("");
  };

  useEffect(() => {
    setSelected(selectedValue);
  }, [selectedValue]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        disabled={disabled}
        className={cn(
          "flex items-center justify-between border border-borderPrimary rounded-md px-3 py-2 text-sm w-full",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {leftChild}
          {showSelectedOption ? (
            <div className="flex items-center gap-2 truncate">
              {typeof selected?.icon === "string" ? (
                <img
                  src={selected.icon}
                  alt="icon"
                  className={cn("w-4 h-4", iconClassName)}
                />
              ) : (
                <span className={cn("w-4 h-4", iconClassName)}>
                  {selected?.icon}
                </span>
              )}

              <span className="truncate">{selected?.label || placeholder}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <ChevronDown className="ml-2 size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className={cn(
          "w-[--radix-popover-trigger-width] mt-2 z-50",
          dropdownClassName
        )}
      >
        {isSearchable && (
          <div className="p-2">
            <input
              className="w-full border px-2 py-1 rounded-md text-sm"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
        {filteredOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => handleSelect(option)}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              selected?.value === option.value && "bg-muted"
            )}
          >
            {typeof option.icon === "string" ? (
              <img
                src={option.icon}
                alt="icon"
                className={cn("w-4 h-4", iconClassName)}
              />
            ) : (
              <span className={cn("w-4 h-4", iconClassName)}>
                {option.icon}
              </span>
            )}

            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

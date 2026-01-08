"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useTranslations } from "next-intl"

interface ComboboxProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Combobox({
  value = "",
  onChange,
  placeholder = "",
  className = ""
}: ComboboxProps) {

  const t = useTranslations('combobox');

  const frameworks = [
    {
      value: "evaluation",
      label: t('popularity_order'),
    },
    {
      value: "upload_desc",
      label: t('newest_order'),
    },
    {
      value: "upload_asc",
      label: t('oldest_order'),
    },
  ]

  const [open, setOpen] = React.useState(false)

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue;
    if (onChange) {
      onChange(newValue);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between font-light", className)}
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : t('sort_by')}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={() => handleSelect(framework.value)}
                  className="hover:cursor-pointer"
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "text-label opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

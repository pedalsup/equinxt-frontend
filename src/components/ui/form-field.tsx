"use client"

import type { FormField as FormFieldType } from "../../types/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { CalendarIcon, Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { FileUpload } from "./file-upload"

interface FormFieldProps {
  field: FormFieldType
  value: any
  error?: string
  onChange: (value: any) => void
}

export const FormField = ({ field, value, error, onChange }: FormFieldProps) => {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "number":
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(field.type === "number" ? Number(e.target.value) : e.target.value)}
            className={error ? "border-red-500" : ""}
          />
        )

      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground",
                  error && "border-red-500",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), "PPP") : <span>{field.placeholder || "Pick a date"}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => onChange(date ? date.toISOString().split("T")[0] : "")}
                disabled={(date) => {
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)

                  if (field.validation?.minDate) {
                    const minDate = new Date(field.validation.minDate)
                    minDate.setHours(0, 0, 0, 0)
                    if (date < minDate) return true
                  }

                  if (field.validation?.maxDate) {
                    const maxDate = new Date(field.validation.maxDate)
                    maxDate.setHours(0, 0, 0, 0)
                    if (date > maxDate) return true
                  }

                  return false
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )

      case "file":
        return (
          <FileUpload
            value={value || []}
            onChange={onChange}
            accept={field.accept}
            multiple={field.multiple}
            maxFiles={field.maxFiles}
            maxFileSize={field.validation?.maxFileSize}
            disabled={false}
            error={error}
            placeholder={field.placeholder}
          />
        )

      case "select":
        // Group options if they have groups
        const groupedOptions = field.options?.reduce(
          (acc, option) => {
            const group = option.group || "default"
            if (!acc[group]) acc[group] = []
            acc[group].push(option)
            return acc
          },
          {} as Record<string, typeof field.options>,
        )

        return (
          <Select value={value || ""} onValueChange={onChange}>
            <SelectTrigger className={error ? "border-red-500" : ""}>
              <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {groupedOptions && Object.keys(groupedOptions).length > 1
                ? // Render grouped options
                  Object.entries(groupedOptions).map(([groupName, options]) => (
                    <div key={groupName}>
                      {groupName !== "default" && (
                        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">{groupName}</div>
                      )}
                      {options?.map((option) => (
                        <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </div>
                  ))
                : // Render flat options
                  field.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                      {option.label}
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>
        )

      case "searchable-select":
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn("w-full justify-between", !value && "text-muted-foreground", error && "border-red-500")}
              >
                {value
                  ? field.options?.find((option) => option.value === value)?.label
                  : field.placeholder || `Select ${field.label}`}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder={`Search ${field.label.toLowerCase()}...`}
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
                <CommandList>
                  <CommandEmpty>No options found.</CommandEmpty>
                  {field.options?.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                      onSelect={(currentValue) => {
                        onChange(currentValue === value ? "" : currentValue)
                        setOpen(false)
                        setSearchValue("")
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )

      case "multiselect":
        const selectedValues = Array.isArray(value) ? value : []
        const availableOptions = field.options?.filter((option) => !option.disabled) || []

        return (
          <div className="space-y-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn("w-full justify-between min-h-10", error && "border-red-500")}
                >
                  <div className="flex flex-wrap gap-1">
                    {selectedValues.length > 0 ? (
                      selectedValues.slice(0, 3).map((val) => {
                        const option = field.options?.find((opt) => opt.value === val)
                        return (
                          <Badge key={val} variant="secondary" className="text-xs">
                            {option?.label}
                            <button
                              type="button"
                              className="ml-1 hover:bg-muted-foreground/20 rounded-full"
                              onClick={(e) => {
                                e.stopPropagation()
                                const newValues = selectedValues.filter((v) => v !== val)
                                onChange(newValues)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )
                      })
                    ) : (
                      <span className="text-muted-foreground">{field.placeholder || `Select ${field.label}`}</span>
                    )}
                    {selectedValues.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{selectedValues.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder={`Search ${field.label.toLowerCase()}...`} />
                  <CommandList>
                    <CommandEmpty>No options found.</CommandEmpty>
                    <CommandGroup>
                      {availableOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={(currentValue) => {
                            const newValues = selectedValues.includes(currentValue)
                              ? selectedValues.filter((v) => v !== currentValue)
                              : [...selectedValues, currentValue]

                            // Check max selections limit
                            if (field.maxSelections && newValues.length > field.maxSelections) {
                              return
                            }

                            onChange(newValues)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedValues.includes(option.value) ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Show selected items */}
            {selectedValues.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedValues.map((val) => {
                  const option = field.options?.find((opt) => opt.value === val)
                  return (
                    <Badge key={val} variant="outline" className="text-xs">
                      {option?.label}
                      <button
                        type="button"
                        className="ml-1 hover:bg-muted-foreground/20 rounded-full"
                        onClick={() => {
                          const newValues = selectedValues.filter((v) => v !== val)
                          onChange(newValues)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )
                })}
              </div>
            )}
          </div>
        )

      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={error ? "border-red-500" : ""}
          />
        )

      case "radio":
        return (
          <RadioGroup
            value={value || ""}
            onValueChange={onChange}
            className={error ? "border-red-500 rounded p-2" : ""}
          >
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${field.name}-${option.value}`} disabled={option.disabled} />
                <Label
                  htmlFor={`${field.name}-${option.value}`}
                  className={option.disabled ? "text-muted-foreground" : ""}
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox checked={value || false} onCheckedChange={onChange} id={field.name} />
            <Label htmlFor={field.name}>{field.label}</Label>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-2">
      {field.type !== "checkbox" && (
        <Label htmlFor={field.name} className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
          {field.type === "multiselect" && field.maxSelections && (
            <span className="text-xs text-muted-foreground ml-2">(Max {field.maxSelections} selections)</span>
          )}
        </Label>
      )}
      {renderField()}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

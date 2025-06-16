
import type { FormField as FormFieldType } from "../../types/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FormFieldProps {
  field: FormFieldType
  value: any
  error?: string
  onChange: (value: any) => void
}

export const FormField = ({ field, value, error, onChange }: FormFieldProps) => {
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

                  // Check minDate constraint
                  if (field.validation?.minDate) {
                    const minDate = new Date(field.validation.minDate)
                    minDate.setHours(0, 0, 0, 0)
                    if (date < minDate) return true
                  }

                  // Check maxDate constraint
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

      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={error ? "border-red-500" : ""}
          />
        )

      case "select":
        return (
          <Select value={value || ""} onValueChange={onChange}>
            <SelectTrigger className={error ? "border-red-500" : ""}>
              <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                <RadioGroupItem value={option.value} id={`${field.name}-${option.value}`} />
                <Label htmlFor={`${field.name}-${option.value}`}>{option.label}</Label>
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
        </Label>
      )}
      {renderField()}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

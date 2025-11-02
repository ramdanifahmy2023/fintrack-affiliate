"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DatePickerWithRangeProps {
  date: DateRange | undefined
  onDateChange: (date: DateRange | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DatePickerWithRange({
  date,
  onDateChange,
  placeholder = "Pilih tanggal",
  className,
  disabled = false
}: DatePickerWithRangeProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const presets = [
    {
      label: "Hari ini",
      value: {
        from: new Date(),
        to: new Date()
      }
    },
    {
      label: "7 hari terakhir", 
      value: {
        from: addDays(new Date(), -7),
        to: new Date()
      }
    },
    {
      label: "30 hari terakhir",
      value: {
        from: addDays(new Date(), -30),
        to: new Date()
      }
    },
    {
      label: "Bulan ini",
      value: {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date()
      }
    },
    {
      label: "Bulan lalu",
      value: {
        from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        to: new Date(new Date().getFullYear(), new Date().getMonth(), 0)
      }
    },
    {
      label: "3 bulan terakhir",
      value: {
        from: addDays(new Date(), -90),
        to: new Date()
      }
    }
  ]

  const formatDateRange = (dateRange: DateRange | undefined) => {
    if (!dateRange?.from) {
      return placeholder
    }
    if (!dateRange.to) {
      return format(dateRange.from, "dd MMM yyyy", { locale: localeId })
    }
    if (dateRange.from.getTime() === dateRange.to.getTime()) {
      return format(dateRange.from, "dd MMM yyyy", { locale: localeId })
    }
    return `${format(dateRange.from, "dd MMM yyyy", { locale: localeId })} - ${format(
      dateRange.to,
      "dd MMM yyyy",
      { locale: localeId }
    )}`
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange(date)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {/* Preset sidebar */}
            <div className="w-48 border-r bg-muted/20 p-3">
              <div className="space-y-1">
                <h4 className="text-sm font-medium mb-2">Preset Periode</h4>
                {presets.map((preset, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-sm h-auto p-2"
                    onClick={() => {
                      onDateChange(preset.value)
                      setIsOpen(false)
                    }}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Calendar */}
            <div className="p-3">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={onDateChange}
                numberOfMonths={2}
                locale={localeId}
              />
            </div>
          </div>
          
          {/* Footer with actions */}
          <div className="border-t p-3 flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onDateChange(undefined)
                setIsOpen(false)
              }}
            >
              Reset
            </Button>
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Tutup
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
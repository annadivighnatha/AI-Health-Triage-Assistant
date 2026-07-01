"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface SymptomComboboxProps {
  options: string[]
  selected: string[]
  onToggle: (symptom: string) => void
}

export function SymptomCombobox({ options, selected, onToggle }: SymptomComboboxProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const normalizedExists = options.some((o) => o.toLowerCase() === query.trim().toLowerCase())
  const canAddCustom = query.trim().length > 1 && !normalizedExists

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent font-normal text-muted-foreground"
        >
          Search and add symptoms...
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Type a symptom..." value={query} onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>
              {canAddCustom ? (
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-2 py-1.5 text-sm hover:text-foreground"
                  onClick={() => {
                    onToggle(query.trim())
                    setQuery("")
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Add &quot;{query.trim()}&quot;
                </button>
              ) : (
                "No symptom found."
              )}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected.includes(option)
                return (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => {
                      onToggle(option)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                    {option}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

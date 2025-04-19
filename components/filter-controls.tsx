"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getChannels, getCategories, getTags } from "@/lib/api"

interface FilterControlsProps {
  orientation?: "horizontal" | "vertical"
  onFilterChange?: () => void
}

export function FilterControls({ orientation = "horizontal", onFilterChange }: FilterControlsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { data: channels = [] } = useQuery({
    queryKey: ["channels"],
    queryFn: getChannels,
  })

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  })

  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  })

  const selectedChannelId = searchParams.get("channelId") || ""
  const selectedCategory = searchParams.get("category") || ""
  const selectedTags = searchParams.get("tags")?.split(",").filter(Boolean) || []

  const selectedChannel = channels.find((c) => c.channelId === selectedChannelId)

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    // Reset to first page when filters change
    params.delete("offset")

    router.push(`?${params.toString()}`)

    if (onFilterChange) {
      onFilterChange()
    }
  }

  const updateTagsFilter = (tag: string) => {
    const currentTags = new Set(selectedTags)

    if (currentTags.has(tag)) {
      currentTags.delete(tag)
    } else {
      currentTags.add(tag)
    }

    const params = new URLSearchParams(searchParams.toString())

    if (currentTags.size > 0) {
      params.set("tags", Array.from(currentTags).join(","))
    } else {
      params.delete("tags")
    }

    // Reset to first page when filters change
    params.delete("offset")

    router.push(`?${params.toString()}`)

    if (onFilterChange) {
      onFilterChange()
    }
  }

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("channelId")
    params.delete("category")
    params.delete("tags")
    params.delete("offset")
    router.push(`?${params.toString()}`)

    if (onFilterChange) {
      onFilterChange()
    }
  }

  const hasActiveFilters = selectedChannelId || selectedCategory || selectedTags.length > 0

  return (
    <div className={cn(orientation === "horizontal" ? "flex flex-wrap gap-2 items-center" : "flex flex-col gap-4")}>
      <div className={cn("flex gap-2", orientation === "horizontal" ? "flex-wrap" : "flex-col")}>
        {/* Channel Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn("justify-between", orientation === "vertical" && "w-full")}
            >
              {selectedChannel ? selectedChannel.channelName : "All Channels"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0">
            <Command>
              <CommandInput placeholder="Search channels..." />
              <CommandList>
                <CommandEmpty>No channel found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem onSelect={() => updateFilters("channelId", null)} className="cursor-pointer">
                    <Check className={cn("mr-2 h-4 w-4", !selectedChannelId ? "opacity-100" : "opacity-0")} />
                    All Channels
                  </CommandItem>
                  {channels.map((channel) => (
                    <CommandItem
                      key={channel.channelId}
                      onSelect={() => updateFilters("channelId", channel.channelId)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          channel.channelId === selectedChannelId ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {channel.channelName}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Category Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn("justify-between", orientation === "vertical" && "w-full")}
            >
              {selectedCategory || "All Categories"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0">
            <Command>
              <CommandInput placeholder="Search categories..." />
              <CommandList>
                <CommandEmpty>No category found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem onSelect={() => updateFilters("category", null)} className="cursor-pointer">
                    <Check className={cn("mr-2 h-4 w-4", !selectedCategory ? "opacity-100" : "opacity-0")} />
                    All Categories
                  </CommandItem>
                  {categories.map((category) => (
                    <CommandItem
                      key={category}
                      onSelect={() => updateFilters("category", category)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn("mr-2 h-4 w-4", category === selectedCategory ? "opacity-100" : "opacity-0")}
                      />
                      {category}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Tags Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("justify-between", orientation === "vertical" && "w-full")}>
              Tags
              {selectedTags.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedTags.length}
                </Badge>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0">
            <Command>
              <CommandInput placeholder="Search tags..." />
              <CommandList>
                <CommandEmpty>No tag found.</CommandEmpty>
                <CommandGroup>
                  {tags.map((tag) => (
                    <CommandItem key={tag} onSelect={() => updateTagsFilter(tag)} className="cursor-pointer">
                      <div
                        className={cn(
                          "mr-2 h-4 w-4 rounded-sm border border-primary flex items-center justify-center",
                          selectedTags.includes(tag) && "bg-primary text-primary-foreground",
                        )}
                      >
                        {selectedTags.includes(tag) && <Check className="h-3 w-3" />}
                      </div>
                      {tag}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className={cn("h-8 px-2 text-xs", orientation === "vertical" && "w-full")}
        >
          Clear filters
          <X className="ml-1 h-3 w-3" />
        </Button>
      )}
    </div>
  )
}

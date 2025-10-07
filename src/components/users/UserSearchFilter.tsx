"use client"

import { IconFilter, IconSearch, IconX } from "@tabler/icons-react"
import { Button } from "@/components/shadcn/ui/button"
import { Input } from "@/components/shadcn/ui/input"

interface UserSearchFilterProps {
  search: string
  onSearchChange: (value: string) => void
  onClearSearch: () => void
}

/**
 * Komponen untuk pencarian dan filter users
 */
export function UserSearchFilter({ search, onSearchChange, onClearSearch }: UserSearchFilterProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative flex-1">
        <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari berdasarkan nama atau email..."
          className="pl-8"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {search && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-7 w-7 p-0"
            onClick={onClearSearch}
          >
            <IconX className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button variant="outline">
        <IconFilter className="mr-2 h-4 w-4" />
        Filter
      </Button>
    </div>
  )
}
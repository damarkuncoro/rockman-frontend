import * as React from "react"
import { IconSearch } from "@tabler/icons-react"
import { Button } from "@/components/shadcn/ui/button"
import { Input } from "@/components/shadcn/ui/input"

interface DepartmentFilterProps {
  search: string
  isActive: boolean | undefined
  onSearchChange: (value: string) => void
  onFilterChange: (isActive: boolean | undefined) => void
}

/**
 * Komponen untuk filter dan pencarian departemen
 */
export function DepartmentFilter({
  search,
  isActive,
  onSearchChange,
  onFilterChange
}: DepartmentFilterProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Cari departemen..."
          className="pl-8"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button
        variant={isActive === true ? "default" : "outline"}
        onClick={() => onFilterChange(true)}
      >
        Aktif
      </Button>
      <Button
        variant={isActive === false ? "default" : "outline"}
        onClick={() => onFilterChange(false)}
      >
        Tidak Aktif
      </Button>
      <Button
        variant={isActive === undefined ? "default" : "outline"}
        onClick={() => onFilterChange(undefined)}
      >
        Semua
      </Button>
    </div>
  )
}
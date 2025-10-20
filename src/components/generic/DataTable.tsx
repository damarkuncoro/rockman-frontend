"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/shadcn/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/ui/table"
import { Button } from "@/components/shadcn/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/ui/select"
import { Input } from "@/components/shadcn/ui/input"
import { IconChevronUp, IconChevronDown, IconSelector, IconSearch } from "@tabler/icons-react"

type CellRenderer<T> = (row: T) => React.ReactNode

export type ColumnDef<T> = {
  id: string
  header: string
  accessorKey?: string
  cell?: CellRenderer<T>
  className?: string
  sortable?: boolean
  sortValue?: (row: T) => string | number | Date | null | undefined
}

export type RowAction<T> = {
  id: string
  label: string
  onClick: (row: T) => void
  variant?: "default" | "outline" | "destructive" | "ghost"
  icon?: React.ComponentType<{ className?: string }>
  disabled?: boolean | ((row: T) => boolean)
}

export type DataTableProps<T> = {
  data: T[]
  columns: ColumnDef<T>[]
  actions?: RowAction<T>[]
  loading?: boolean
  error?: string
  emptyMessage?: string
  className?: string
  enableSorting?: boolean
  enablePagination?: boolean
  pageSizeOptions?: number[]
  defaultPageSize?: number
  defaultPage?: number
  defaultSort?: { id: string | null; direction: "asc" | "desc" | null }
  onSortChange?: (s: { id: string | null; direction: "asc" | "desc" | null }) => void
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  // Generic filters
  filters?: TableFilter<T>[]
  onFiltersChange?: (filters: TableFilter<T>[]) => void
  renderFiltersRight?: React.ReactNode
  applyFiltersInternally?: boolean
  // Stats
  renderStats?: React.ReactNode
  stats?: DataTableStat[]
}

type FilterType = "search" | "select"

type FilterOption = { label: string; value: string }

export type TableFilter<T> = {
  id: string
  type: FilterType
  label?: string
  placeholder?: string
  options?: FilterOption[] // for select
  value?: string
  accessorKeys?: string[] // keys to apply predicate/search against
  predicate?: (row: T, value: string) => boolean // custom matcher
  onChange?: (value: string) => void // controlled
}

export type DataTableStat = {
  label: string
  value: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  helperText?: string
}

function getPath(obj: any, path?: string) {
  if (!path) return undefined
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj)
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  loading,
  error,
  emptyMessage = "No data found",
  className,
  enableSorting = true,
  enablePagination = true,
  pageSizeOptions = [10, 25, 50],
  defaultPageSize = 10,
  defaultPage = 1,
  defaultSort = { id: null, direction: null },
  onSortChange,
  onPageChange,
  onPageSizeChange,
  filters,
  onFiltersChange,
  renderFiltersRight,
  applyFiltersInternally = true,
  renderStats,
  stats,
}: DataTableProps<T>) {
  const [sort, setSort] = React.useState<{ id: string | null; direction: "asc" | "desc" | null }>(defaultSort)
  const [page, setPage] = React.useState<number>(defaultPage)
  const [pageSize, setPageSize] = React.useState<number>(defaultPageSize)
  const [internalFilters, setInternalFilters] = React.useState<TableFilter<T>[]>(filters || [])

  const setSortAndNotify = (updater: ((prev: { id: string | null; direction: "asc" | "desc" | null }) => { id: string | null; direction: "asc" | "desc" | null }) | { id: string | null; direction: "asc" | "desc" | null }) => {
    setSort((prev) => {
      const next = typeof updater === "function" ? (updater as any)(prev) : (updater as any)
      onSortChange?.(next)
      return next
    })
  }

  const setPageAndNotify = (updater: ((prev: number) => number) | number) => {
    setPage((prev) => {
      const next = typeof updater === "function" ? (updater as any)(prev) : (updater as any)
      onPageChange?.(next)
      return next
    })
  }

  const setPageSizeAndNotify = (size: number) => {
    setPageSize(size)
    onPageSizeChange?.(size)
  }

  const getCellValue = (row: T, col: ColumnDef<T>) => {
    if (col.sortValue) return col.sortValue(row)
    if (col.accessorKey) return getPath(row, col.accessorKey)
    return undefined
  }

  const effectiveFilters = filters ?? internalFilters

  const setFilterValue = (index: number, value: string) => {
    if (filters && filters[index]?.onChange) {
      filters[index].onChange?.(value)
      onFiltersChange?.(filters.map((f, i) => (i === index ? { ...f, value } : f)))
      return
    }
    setInternalFilters((prev) => {
      const next = prev.map((f, i) => (i === index ? { ...f, value } : f))
      onFiltersChange?.(next)
      return next
    })
  }

  const matchesFilter = (row: T, f: TableFilter<T>) => {
    const val = f.value?.trim()
    if (!val || val === "all") return true
    if (f.predicate) return f.predicate(row, val)
    if (f.type === "search") {
      const keys = f.accessorKeys && f.accessorKeys.length > 0 ? f.accessorKeys : (columns.map((c) => c.accessorKey).filter(Boolean) as string[])
      if (keys.length === 0) {
        // fallback: scan string values of row
        return Object.values(row).some((v) => typeof v === "string" && v.toLowerCase().includes(val.toLowerCase()))
      }
      return keys.some((k) => {
        const target = getPath(row, k)
        return typeof target === "string" && target.toLowerCase().includes(val.toLowerCase())
      })
    }
    if (f.type === "select") {
      const k = (f.accessorKeys && f.accessorKeys[0]) || columns.find((c) => c.id === f.id)?.accessorKey
      if (!k) return true
      const target = getPath(row, k)
      return String(target) === val
    }
    return true
  }

  const filteredData = React.useMemo(() => {
    if (!applyFiltersInternally) return data
    if (!effectiveFilters || effectiveFilters.length === 0) return data
    return data.filter((row) => effectiveFilters.every((f) => matchesFilter(row, f)))
  }, [data, effectiveFilters, columns, applyFiltersInternally])

  const sortedData = React.useMemo(() => {
    const base = Array.isArray(filteredData) ? filteredData : []
    if (!enableSorting || !sort.id || !sort.direction) return base
    const col = columns.find((c) => c.id === sort.id)
    if (!col) return base
    const copied = [...base]
    copied.sort((a, b) => {
      const va = getCellValue(a, col)
      const vb = getCellValue(b, col)
      const na = va instanceof Date ? va.getTime() : typeof va === "string" ? va.toLowerCase() : (va as any)
      const nb = vb instanceof Date ? vb.getTime() : typeof vb === "string" ? vb.toLowerCase() : (vb as any)
      if (na == null && nb == null) return 0
      if (na == null) return sort.direction === "asc" ? -1 : 1
      if (nb == null) return sort.direction === "asc" ? 1 : -1
      if (na < nb) return sort.direction === "asc" ? -1 : 1
      if (na > nb) return sort.direction === "asc" ? 1 : -1
      return 0
    })
    return copied
  }, [filteredData, columns, sort, enableSorting])

  const total = sortedData.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIdx = (currentPage - 1) * pageSize
  const paginatedData = enablePagination ? sortedData.slice(startIdx, startIdx + pageSize) : sortedData

  const toggleSort = (col: ColumnDef<T>) => {
    if (!enableSorting || !col.sortable) return
    setPageAndNotify(1)
    setSortAndNotify((prev) => {
      if (prev.id !== col.id) return { id: col.id, direction: "asc" }
      if (prev.direction === "asc") return { id: col.id, direction: "desc" }
      return { id: null, direction: null }
    })
  }

  return (
    <Card className={cn(className, "")}>
      <CardContent className="pt-6">
        {/* Stats Section */}
        {renderStats ? (
          <div className="mb-4">{renderStats}</div>
        ) : stats && stats.length > 0 ? (
          <div className="mb-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, idx) => (
                <Card key={idx} className="@container/card">
                  <CardHeader>
                    {stat.label && <CardDescription>{stat.label}</CardDescription>}
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-2">
                      {stat.icon && <stat.icon className="h-4 w-4" />}
                      {stat.value}
                    </CardTitle>
                  </CardHeader>
                  {stat.helperText && (
                    <CardContent className="text-sm text-muted-foreground">
                      {stat.helperText}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ) : null}
        {effectiveFilters && effectiveFilters.length > 0 && (
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              {effectiveFilters.map((f, i) => (
                <div key={f.id} className={cn(f.type === "search" ? "relative flex-1" : "w-full md:w-[180px]")}> 
                  {f.type === "search" ? (
                    <>
                      <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder={f.placeholder || "Search..."}
                        value={f.value || ""}
                        onChange={(e) => setFilterValue(i, e.target.value)}
                        className="pl-9"
                      />
                    </>
                  ) : f.type === "select" ? (
                    <Select value={f.value || "all"} onValueChange={(v) => setFilterValue(i, v)}>
                      <SelectTrigger>
                        <SelectValue placeholder={f.label || "Filter"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{f.label ? `Semua ${f.label}` : "Semua"}</SelectItem>
                        {(f.options || []).map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : null}
                </div>
              ))}
            </div>
            {renderFiltersRight}
          </div>
        )}
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.id} className={cn(col.className, col.sortable && "cursor-pointer select-none")}
                    onClick={() => toggleSort(col)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {enableSorting && col.sortable && (
                        sort.id === col.id ? (
                          sort.direction === "asc" ? <IconChevronUp className="h-4 w-4" /> : <IconChevronDown className="h-4 w-4" />
                        ) : (
                          <IconSelector className="h-4 w-4 text-muted-foreground" />
                        )
                      )}
                    </span>
                  </TableHead>
                ))}
                {actions.length > 0 && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={(columns?.length || 0) + (actions.length > 0 ? 1 : 0)} className="text-center text-muted-foreground">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, idx) => (
                  <TableRow key={idx}>
                    {columns.map((col) => (
                      <TableCell key={col.id} className={col.className}>
                        {col.cell ? col.cell(row) : (getPath(row, col.accessorKey) as React.ReactNode)}
                      </TableCell>
                    ))}
                    {actions.length > 0 && (
                      <TableCell className="text-right space-x-2">
                        {actions.map((action) => {
                          const Icon = action.icon
                          const disabled = typeof action.disabled === "function" ? action.disabled(row) : action.disabled
                          return (
                            <Button key={action.id} size="sm" variant={action.variant || "outline"} onClick={() => action.onClick(row)} disabled={disabled}>
                              {Icon ? <Icon className="h-4 w-4 mr-2" /> : null}
                              {action.label}
                            </Button>
                          )
                        })}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
        {enablePagination && !loading && !error && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {paginatedData.length} of {total} rows — Page {currentPage} / {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Select value={String(pageSize)} onValueChange={(v) => { setPageSizeAndNotify(Number(v)); setPageAndNotify(1) }}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Rows" />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((opt) => (
                    <SelectItem key={opt} value={String(opt)}>{opt} rows</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPageAndNotify((p) => Math.max(1, p - 1))} disabled={currentPage <= 1}>Prev</Button>
                <Button variant="outline" size="sm" onClick={() => setPageAndNotify((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>Next</Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
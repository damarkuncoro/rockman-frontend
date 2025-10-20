"use client"

import * as React from "react"
import { useFetch } from "@/lib/useFetch"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { DataTable, ColumnDef } from "@/components/generic/DataTable"
import { IconClipboard } from "@tabler/icons-react"
import { DashboardPage } from "@/components/layouts/DashboardPage"
import { Input } from "@/components/shadcn/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/ui/select"
import { Button } from "@/components/shadcn/ui/button"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { IconPlus } from "@tabler/icons-react"

interface Ticket {
  id: string
  userId?: string
  assignedTo?: string
  title: string
  description?: string
  status: string
  priority: string
  category?: string
  createdAt?: string
  updatedAt?: string
}

export default function TicketsPage() {
  const { data, loading, error } = useFetch<Ticket[]>("/api/v2/tickets", { useCache: true })
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [query, setQuery] = React.useState<string>(searchParams.get("q") ?? "")
  const [status, setStatus] = React.useState<string>(searchParams.get("status") ?? "")
  const [priority, setPriority] = React.useState<string>(searchParams.get("priority") ?? "")

  const updateParams = React.useCallback((updates: Record<string, string | null>) => {
    const sp = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value == null || value === "") sp.delete(key)
      else sp.set(key, value)
    }
    router.replace(`${pathname}?${sp.toString()}`)
  }, [router, pathname, searchParams])

  const columns: ColumnDef<Ticket>[] = [
    { id: "id", header: "ID", accessorKey: "id", className: "font-mono text-sm", sortable: true },
    { id: "title", header: "Title", accessorKey: "title", sortable: true },
    { id: "status", header: "Status", accessorKey: "status", sortable: true },
    { id: "priority", header: "Priority", accessorKey: "priority", sortable: true },
    { id: "assignedTo", header: "Assigned To", accessorKey: "assignedTo", className: "font-mono text-xs", sortable: true },
    { id: "createdAt", header: "Created At", cell: (t) => (t.createdAt ? new Date(t.createdAt).toLocaleString() : "-"), sortable: true, sortValue: (t) => (t.createdAt ? new Date(t.createdAt) : null) },
  ]

  const filtered = React.useMemo(() => {
    const list = Array.isArray(data) ? data : []
    const byQuery = (rows: Ticket[]) => {
      if (!query) return rows
      const q = query.toLowerCase()
      return rows.filter((t) => [
        t.id,
        t.title,
        t.status,
        t.priority,
        t.assignedTo,
        t.category,
      ].some((v) => String(v ?? "").toLowerCase().includes(q)))
    }
    const byStatus = (rows: Ticket[]) => {
      if (!status) return rows
      return rows.filter((t) => String(t.status ?? "") === status)
    }
    const byPriority = (rows: Ticket[]) => {
      if (!priority) return rows
      return rows.filter((t) => String(t.priority ?? "") === priority)
    }
    return byQuery(byPriority(byStatus(list)))
  }, [data, query, status, priority])

  const statusOptions = React.useMemo(() => {
    const list = Array.isArray(data) ? data : []
    return Array.from(new Set(list.map((t) => t.status).filter(Boolean)))
  }, [data])

  const priorityOptions = React.useMemo(() => {
    const list = Array.isArray(data) ? data : []
    return Array.from(new Set(list.map((t) => t.priority).filter(Boolean)))
  }, [data])

  return (
    <DashboardPage
      title="Tickets"
      description="Daftar tiket dukungan"
      actions={
        <Button size="sm" onClick={() => console.log("Add Ticket")}> <IconPlus className="h-4 w-4 mr-2" /> Add</Button>
      }
      toolbar={
        <div className="flex items-center gap-2 w-full">
          <Input
            placeholder="Cari tickets..."
            value={query}
            onChange={(e) => { const v = e.target.value; setQuery(v); updateParams({ q: v || null }) }}
            className="max-w-sm"
          />
          <Select value={status || undefined} onValueChange={(v) => { setStatus(v); updateParams({ status: v || null, page: "1" }) }}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={String(s)}>{String(s)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priority || undefined} onValueChange={(v) => { setPriority(v); updateParams({ priority: v || null, page: "1" }) }}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              {priorityOptions.map((p) => (
                <SelectItem key={p} value={String(p)}>{String(p)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => { setStatus(""); setPriority(""); updateParams({ status: null, priority: null, page: "1" }) }}>Reset</Button>
        </div>
      }
      contentCard={false}
    >

      <DataTable
        data={filtered}
        columns={columns}
        loading={loading}
        error={error?.message}
        emptyMessage="Belum ada tiket"
        pageSizeOptions={[10, 25, 50]}
        defaultPageSize={Number(searchParams.get("pageSize") ?? 10)}
        defaultPage={Number(searchParams.get("page") ?? 1)}
        defaultSort={{ id: searchParams.get("sortId"), direction: (searchParams.get("sortDir") as any) ?? null }}
        onSortChange={(s) => {
          updateParams({ sortId: s.id ?? null, sortDir: s.direction ?? null, page: s.direction ? "1" : null })
        }}
        onPageChange={(p) => updateParams({ page: String(p) })}
        onPageSizeChange={(ps) => updateParams({ pageSize: String(ps), page: "1" })}
        actions={[
          {
            id: "copy-id",
            label: "Copy ID",
            icon: IconClipboard,
            onClick: async (row) => {
              try {
                await navigator.clipboard.writeText(String(row.id))
              } catch {}
            },
          },
        ]}
      />
      
    </DashboardPage>
  )
}
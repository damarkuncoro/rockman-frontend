"use client"

import * as React from "react"
import { useFetch } from "@/lib/useFetch"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { DataTable, ColumnDef } from "@/components/generic/DataTable"
import { IconClipboard } from "@tabler/icons-react"
import { DashboardPage } from "@/components/layouts/DashboardPage"
import { Input } from "@/components/shadcn/ui/input"
import { Button } from "@/components/shadcn/ui/button"
import { IconPlus } from "@tabler/icons-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

interface TicketReply {
  id: string
  ticketId: string
  userId?: string
  content: string
  isInternal?: boolean
  createdAt?: string
}

export default function TicketRepliesPage() {
  const { data, loading, error } = useFetch<TicketReply[]>("/api/v2/ticket-replies", { useCache: true })
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [query, setQuery] = React.useState<string>(searchParams.get("q") ?? "")

  const updateParams = React.useCallback((updates: Record<string, string | null>) => {
    const sp = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value == null || value === "") sp.delete(key)
      else sp.set(key, value)
    }
    router.replace(`${pathname}?${sp.toString()}`)
  }, [router, pathname, searchParams])

  const columns: ColumnDef<TicketReply>[] = [
    { id: "id", header: "ID", accessorKey: "id", className: "font-mono text-sm", sortable: true },
    { id: "ticketId", header: "Ticket ID", accessorKey: "ticketId", className: "font-mono text-xs", sortable: true },
    { id: "userId", header: "User ID", accessorKey: "userId", className: "font-mono text-xs", sortable: true },
    { id: "content", header: "Content", cell: (r) => <span className="max-w-[400px] truncate inline-block">{r.content}</span> },
    { id: "isInternal", header: "Internal", cell: (r) => (r.isInternal ? "Yes" : "No"), sortable: true },
    { id: "createdAt", header: "Created At", cell: (r) => (r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"), sortable: true, sortValue: (r) => (r.createdAt ? new Date(r.createdAt) : null) },
  ]

  const filtered = React.useMemo(() => {
    const list = Array.isArray(data) ? data : []
    if (!query) return list
    const q = query.toLowerCase()
    return list.filter((r) => [
      r.id,
      r.ticketId,
      r.userId,
      r.content,
      r.isInternal ? "internal" : "public",
    ].some((v) => String(v ?? "").toLowerCase().includes(q)))
  }, [data, query])

  return (
    <DashboardPage
      title="Ticket Replies"
      description="Daftar balasan tiket"
      actions={<Button size="sm" onClick={() => console.log("Add Reply")}><IconPlus className="h-4 w-4 mr-2" /> Add</Button>}
      toolbar={
        <div className="flex items-center gap-2 w-full">
          <Input
            placeholder="Cari replies..."
            value={query}
            onChange={(e) => { const v = e.target.value; setQuery(v); updateParams({ q: v || null }) }}
            className="max-w-sm"
          />
        </div>
      }
    >
      <DataTable
        data={filtered}
        columns={columns}
        loading={loading}
        error={error?.message}
        emptyMessage="Belum ada balasan"
        pageSizeOptions={[10, 25, 50]}
        defaultPageSize={Number(searchParams.get("pageSize") ?? 10)}
        defaultPage={Number(searchParams.get("page") ?? 1)}
        defaultSort={{ id: searchParams.get("sortId"), direction: (searchParams.get("sortDir") as any) ?? null }}
        onSortChange={(s) => { updateParams({ sortId: s.id ?? null, sortDir: s.direction ?? null, page: s.direction ? "1" : null }) }}
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
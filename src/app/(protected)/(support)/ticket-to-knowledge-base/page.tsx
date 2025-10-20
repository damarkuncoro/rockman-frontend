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

interface TicketToKBRelation {
  ticketId: string
  articleId: string
  createdAt?: string
}

export default function TicketToKnowledgeBasePage() {
  const { data, loading, error } = useFetch<TicketToKBRelation[]>("/api/v2/ticket-to-knowledge-base", { useCache: true })
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

  const columns: ColumnDef<TicketToKBRelation>[] = [
    { id: "ticketId", header: "Ticket ID", accessorKey: "ticketId", className: "font-mono text-xs", sortable: true },
    { id: "articleId", header: "Article ID", accessorKey: "articleId", className: "font-mono text-xs", sortable: true },
    { id: "createdAt", header: "Created At", cell: (r) => (r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"), sortable: true, sortValue: (r) => (r.createdAt ? new Date(r.createdAt) : null) },
  ]

  const filtered = React.useMemo(() => {
    const list = Array.isArray(data) ? data : []
    if (!query) return list
    const q = query.toLowerCase()
    return list.filter((r) => [
      r.ticketId,
      r.articleId,
    ].some((v) => String(v ?? "").toLowerCase().includes(q)))
  }, [data, query])

  return (
    <DashboardPage
      title="Ticket to Knowledge Base"
      description="Relasi antara tiket dan artikel knowledge base"
      actions={<Button size="sm" onClick={() => console.log("Add Relation")}><IconPlus className="h-4 w-4 mr-2" /> Add</Button>}
      toolbar={
        <div className="flex items-center gap-2 w-full">
          <Input
            placeholder="Cari relasi..."
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
        emptyMessage="Belum ada relasi"
        pageSizeOptions={[10, 25, 50]}
        defaultPageSize={Number(searchParams.get("pageSize") ?? 10)}
        defaultPage={Number(searchParams.get("page") ?? 1)}
        defaultSort={{ id: searchParams.get("sortId"), direction: (searchParams.get("sortDir") as any) ?? null }}
        onSortChange={(s) => { updateParams({ sortId: s.id ?? null, sortDir: s.direction ?? null, page: s.direction ? "1" : null }) }}
        onPageChange={(p) => updateParams({ page: String(p) })}
        onPageSizeChange={(ps) => updateParams({ pageSize: String(ps), page: "1" })}
        actions={[
          {
            id: "copy-pair",
            label: "Copy Pair",
            icon: IconClipboard,
            onClick: async (row) => {
              try {
                await navigator.clipboard.writeText(`${row.ticketId} -> ${row.articleId}`)
              } catch {}
            },
          },
        ]}
      />
    </DashboardPage>
  )
}
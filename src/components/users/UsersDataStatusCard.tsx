"use client"

import * as React from "react"
import { Badge } from "@/components/shadcn/ui/badge"
import { Button } from "@/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"

interface UsersDataStatusCardProps {
  isStale: boolean
  lastUpdated?: number | null
  onRefetch: () => void
  onClearCache: () => void
}

export function UsersDataStatusCard({
  isStale,
  lastUpdated,
  onRefetch,
  onClearCache,
}: UsersDataStatusCardProps) {
  return (
    <>

      <Card>
        <CardHeader>
          <CardTitle>Status Data</CardTitle>
          <CardDescription>
            Sumber: useFetchCache:/api/v2/users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={isStale ? "destructive" : "default"}>
              {isStale ? "Stale" : "Fresh"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Terakhir diperbarui: {lastUpdated ? new Date(lastUpdated).toLocaleString("id-ID") : "-"}
            </span>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" size="sm" onClick={onRefetch}>Refetch</Button>
              <Button variant="secondary" size="sm" onClick={onClearCache}>Clear Cache</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
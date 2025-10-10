"use client"

import { IconLoader2 } from "@tabler/icons-react"
import { Card, CardHeader } from "@/components/shadcn/ui/card"

/**
 * Komponen untuk menampilkan status loading
 */
export function LoadingState() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-center items-center h-32">
          <IconLoader2 className="h-8 w-8 animate-spin" />
        </div>
      </CardHeader>
    </Card>
  )
}
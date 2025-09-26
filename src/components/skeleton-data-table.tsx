import { Card, CardContent, CardHeader } from "@/components/shadcn/ui/card"
import { Skeleton } from "@/components/shadcn/ui/skeleton"

/**
 * Komponen skeleton untuk data table di dashboard
 * Menampilkan placeholder loading state untuk tabel data
 */
export function SkeletonDataTable() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-64" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
          
          {/* Table Header */}
          <div className="border rounded-lg">
            <div className="border-b p-4">
              <div className="grid grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-4 w-20" />
                ))}
              </div>
            </div>
            
            {/* Table Rows */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
              <div key={row} className="border-b last:border-b-0 p-4">
                <div className="grid grid-cols-5 gap-4 items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-8" />
              <Skeleton className="h-9 w-8" />
              <Skeleton className="h-9 w-8" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
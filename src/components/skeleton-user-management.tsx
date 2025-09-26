import { Card, CardContent, CardHeader } from "@/components/shadcn/ui/card"
import { Skeleton } from "@/components/shadcn/ui/skeleton"

/**
 * Komponen skeleton untuk halaman user management
 * Menampilkan placeholder loading state yang konsisten dengan layout user-management
 */
export function SkeletonUserManagement() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Card Skeleton */}
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
        <CardContent className="space-y-4">
          {/* Search and Filters Skeleton */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Skeleton className="h-9 w-64" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="border rounded-lg">
            {/* Table Header */}
            <div className="border-b p-4">
              <div className="grid grid-cols-7 gap-4">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <Skeleton key={i} className="h-4 w-20" />
                ))}
              </div>
            </div>
            
            {/* Table Rows */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((row) => (
              <div key={row} className="border-b last:border-b-0 p-4">
                <div className="grid grid-cols-7 gap-4 items-center">
                  {/* Avatar + Name */}
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  {/* Email */}
                  <Skeleton className="h-4 w-32" />
                  {/* Department */}
                  <Skeleton className="h-4 w-20" />
                  {/* Region */}
                  <Skeleton className="h-4 w-16" />
                  {/* Level */}
                  <Skeleton className="h-4 w-12" />
                  {/* Status */}
                  <Skeleton className="h-6 w-16 rounded-full" />
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-16" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-8" />
              <Skeleton className="h-9 w-8" />
              <Skeleton className="h-9 w-8" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
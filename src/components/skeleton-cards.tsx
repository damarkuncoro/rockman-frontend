import { Card, CardContent, CardHeader } from "@/components/shadcn/ui/card"
import { Skeleton } from "@/components/shadcn/ui/skeleton"

/**
 * Komponen skeleton untuk section cards di dashboard
 * Menampilkan placeholder loading state yang konsisten dengan SectionCards
 */
export function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="@container/card">
          <CardHeader>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-6 w-16" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-40" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
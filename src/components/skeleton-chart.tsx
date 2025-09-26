import { Card, CardContent, CardHeader } from "@/components/shadcn/ui/card"
import { Skeleton } from "@/components/shadcn/ui/skeleton"

/**
 * Komponen skeleton untuk chart area di dashboard
 * Menampilkan placeholder loading state untuk chart interaktif
 */
export function SkeletonChart() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart Area */}
          <div className="h-[300px] w-full relative">
            <Skeleton className="absolute inset-0" />
            {/* Chart Lines */}
            <div className="absolute inset-4 space-y-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-px w-full" />
              ))}
            </div>
            {/* Chart Bars */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
              {[40, 60, 30, 80, 50, 70, 45, 90, 35, 65].map((height, i) => (
                <Skeleton 
                  key={i} 
                  className="w-8" 
                  style={{ height: `${height}px` }}
                />
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
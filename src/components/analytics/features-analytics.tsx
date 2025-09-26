"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts"
import { IconTrendingDown, IconTrendingUp, IconToggleLeft, IconToggleRight, IconEye, IconSettings } from "@tabler/icons-react"

import { Badge } from "@/components/shadcn/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/shadcn/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/ui/select"

/**
 * Interface untuk data feature analytics
 */
interface FeatureAnalytics {
  totalFeatures: number
  activeFeatures: number
  inactiveFeatures: number
  newFeatures: number
  featureGrowth: number
  featuresByCategory: Array<{
    category: string
    count: number
    active: number
    inactive: number
  }>
  featureUsageTrend: Array<{
    date: string
    usage: number
    active: number
  }>
  topFeatures: Array<{
    id: number
    name: string
    usage: number
    status: string
  }>
}

/**
 * Komponen untuk menampilkan analisa fitur
 * Menampilkan statistik, trend, dan visualisasi data fitur
 */
export function FeaturesAnalytics() {
  const [analytics, setAnalytics] = React.useState<FeatureAnalytics | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [timeRange, setTimeRange] = React.useState("30d")
  const router = useRouter()

  /**
   * Handler untuk navigasi ke halaman detail feature
   * @param featureId - ID feature yang akan dilihat detailnya
   */
  const handleFeatureClick = (featureId: number) => {
    router.push(`/features/${featureId}`)
  }

  /**
   * Fetch data analytics dari API
   */
  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        
        // Fetch features data dari API
        const response = await fetch('http://localhost:9999/api/v1/features')
        const features = await response.json()
        
        // Simulasi data analytics berdasarkan data features
        const mockAnalytics: FeatureAnalytics = {
          totalFeatures: features.length || 85,
          activeFeatures: Math.floor((features.length || 85) * 0.75),
          inactiveFeatures: Math.floor((features.length || 85) * 0.25),
          newFeatures: Math.floor((features.length || 85) * 0.08),
          featureGrowth: 8.3,
          featuresByCategory: [
            { category: "Authentication", count: 15, active: 12, inactive: 3 },
            { category: "User Management", count: 12, active: 10, inactive: 2 },
            { category: "Dashboard", count: 10, active: 8, inactive: 2 },
            { category: "Reporting", count: 8, active: 6, inactive: 2 },
            { category: "API", count: 18, active: 15, inactive: 3 },
            { category: "Security", count: 12, active: 9, inactive: 3 },
            { category: "Integration", count: 10, active: 7, inactive: 3 }
          ],
          featureUsageTrend: generateUsageTrendData(timeRange),
          topFeatures: [
            { id: 1, name: "User Login", usage: 95, status: "active" },
            { id: 2, name: "Dashboard View", usage: 88, status: "active" },
            { id: 3, name: "Data Export", usage: 76, status: "active" },
            { id: 4, name: "User Profile", usage: 72, status: "active" },
            { id: 5, name: "Settings", usage: 65, status: "active" },
            { id: 6, name: "Reports", usage: 58, status: "active" },
            { id: 7, name: "Notifications", usage: 45, status: "inactive" },
            { id: 8, name: "File Upload", usage: 42, status: "active" }
          ]
        }
        
        setAnalytics(mockAnalytics)
      } catch (error) {
        console.error('Error fetching feature analytics:', error)
        // Fallback data jika API gagal
        setAnalytics({
          totalFeatures: 85,
          activeFeatures: 64,
          inactiveFeatures: 21,
          newFeatures: 7,
          featureGrowth: 8.3,
          featuresByCategory: [
            { category: "Authentication", count: 15, active: 12, inactive: 3 },
            { category: "User Management", count: 12, active: 10, inactive: 2 },
            { category: "Dashboard", count: 10, active: 8, inactive: 2 },
            { category: "Reporting", count: 8, active: 6, inactive: 2 },
            { category: "API", count: 18, active: 15, inactive: 3 },
            { category: "Security", count: 12, active: 9, inactive: 3 },
            { category: "Integration", count: 10, active: 7, inactive: 3 }
          ],
          featureUsageTrend: generateUsageTrendData(timeRange),
          topFeatures: [
            { id: 1, name: "User Login", usage: 95, status: "active" },
            { id: 2, name: "Dashboard View", usage: 88, status: "active" },
            { id: 3, name: "Data Export", usage: 76, status: "active" },
            { id: 4, name: "User Profile", usage: 72, status: "active" },
            { id: 5, name: "Settings", usage: 65, status: "active" },
            { id: 6, name: "Reports", usage: 58, status: "active" },
            { id: 7, name: "Notifications", usage: 45, status: "inactive" },
            { id: 8, name: "File Upload", usage: 42, status: "active" }
          ]
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

  /**
   * Generate data trend usage berdasarkan time range
   */
  const generateUsageTrendData = (range: string) => {
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90
    const data = []
    const today = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      data.push({
        date: date.toISOString().split('T')[0],
        usage: Math.floor(Math.random() * 30) + 50,
        active: Math.floor(Math.random() * 25) + 40
      })
    }
    
    return data
  }

  const chartConfig = {
    usage: {
      label: "Feature Usage",
      color: "var(--primary)",
    },
    active: {
      label: "Active Features",
      color: "var(--primary)",
    },
  } satisfies ChartConfig

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Features</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums flex items-center gap-2">
              <IconSettings className="h-5 w-5 text-blue-500" />
              {analytics.totalFeatures.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +{analytics.featureGrowth}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Steady growth <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Total available features
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Active Features</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums flex items-center gap-2">
              <IconToggleRight className="h-5 w-5 text-green-500" />
              {analytics.activeFeatures.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +5.2%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              High adoption <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Features currently enabled
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Inactive Features</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums flex items-center gap-2">
              <IconToggleLeft className="h-5 w-5 text-red-500" />
              {analytics.inactiveFeatures.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingDown />
                -2.1%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Decreasing count <IconTrendingDown className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Features currently disabled
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>New Features</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums flex items-center gap-2">
              <IconEye className="h-5 w-5 text-purple-500" />
              {analytics.newFeatures.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +12.8%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Innovation pace <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Features added this month
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Feature Usage Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Usage Trend</CardTitle>
            <CardDescription>
              Feature usage and adoption over time
            </CardDescription>
            <CardAction>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={analytics.featureUsageTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                />
                <YAxis />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      }}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="usage"
                  stroke="var(--color-usage)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-usage)" }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Features by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Features by Category</CardTitle>
            <CardDescription>
              Distribution of features across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={analytics.featuresByCategory} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="category" 
                  type="category" 
                  width={100}
                  tickFormatter={(value) => value.length > 10 ? `${value.slice(0, 10)}...` : value}
                />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-background border rounded-lg p-3 shadow-md">
                          <p className="font-medium">{label}</p>
                          <p className="text-sm">Total: {data.count}</p>
                          <p className="text-sm text-green-600">Active: {data.active}</p>
                          <p className="text-sm text-red-600">Inactive: {data.inactive}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="var(--primary)" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Features Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Features by Usage</CardTitle>
          <CardDescription>
            Most frequently used features in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topFeatures.map((feature, index) => (
              <div 
                key={feature.id} 
                className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleFeatureClick(feature.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{feature.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {feature.usage}% usage rate
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${feature.usage}%` }}
                    />
                  </div>
                  <Badge 
                    variant={feature.status === 'active' ? 'default' : 'secondary'}
                    className="min-w-[60px] justify-center"
                  >
                    {feature.status === 'active' ? (
                      <IconToggleRight className="w-3 h-3 mr-1" />
                    ) : (
                      <IconToggleLeft className="w-3 h-3 mr-1" />
                    )}
                    {feature.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
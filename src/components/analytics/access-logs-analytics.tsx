"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts"
import { IconTrendingDown, IconTrendingUp, IconEye, IconShield, IconAlertTriangle, IconCheck } from "@tabler/icons-react"

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/ui/table"

/**
 * Interface untuk data access logs analytics
 */
interface AccessLogsAnalytics {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  uniqueUsers: number
  requestGrowth: number
  successRate: number
  requestsByHour: Array<{
    hour: string
    requests: number
    successful: number
    failed: number
  }>
  requestsByEndpoint: Array<{
    endpoint: string
    count: number
    method: string
    avgResponseTime: number
  }>
  requestsByStatus: Array<{
    status: string
    count: number
    percentage: number
    color: string
  }>
  recentLogs: Array<{
    id: string
    timestamp: string
    method: string
    endpoint: string
    status: number
    responseTime: number
    userAgent: string
    ip: string
  }>
}

/**
 * Komponen untuk menampilkan analisa access logs
 * Menampilkan statistik, trend, dan visualisasi data log akses
 */
export function AccessLogsAnalytics() {
  const [analytics, setAnalytics] = React.useState<AccessLogsAnalytics | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [timeRange, setTimeRange] = React.useState("24h")

  /**
   * Fetch data analytics dari API
   */
  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        // Simulasi data untuk development
        // TODO: Replace dengan actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setAnalytics({
          totalRequests: 15420,
          successfulRequests: 14876,
          failedRequests: 544,
          uniqueUsers: 1247,
          requestGrowth: 12.5,
          successRate: 96.5,
          requestsByHour: [
            { hour: "00:00", requests: 245, successful: 238, failed: 7 },
            { hour: "01:00", requests: 189, successful: 185, failed: 4 },
            { hour: "02:00", requests: 156, successful: 152, failed: 4 },
            { hour: "03:00", requests: 134, successful: 130, failed: 4 },
            { hour: "04:00", requests: 167, successful: 162, failed: 5 },
            { hour: "05:00", requests: 198, successful: 192, failed: 6 },
            { hour: "06:00", requests: 289, successful: 278, failed: 11 },
            { hour: "07:00", requests: 456, successful: 441, failed: 15 },
            { hour: "08:00", requests: 678, successful: 652, failed: 26 },
            { hour: "09:00", requests: 892, successful: 859, failed: 33 },
            { hour: "10:00", requests: 1045, successful: 1008, failed: 37 },
            { hour: "11:00", requests: 1156, successful: 1115, failed: 41 },
            { hour: "12:00", requests: 1234, successful: 1189, failed: 45 },
            { hour: "13:00", requests: 1189, successful: 1147, failed: 42 },
            { hour: "14:00", requests: 1098, successful: 1059, failed: 39 },
            { hour: "15:00", requests: 987, successful: 952, failed: 35 },
            { hour: "16:00", requests: 876, successful: 845, failed: 31 },
            { hour: "17:00", requests: 765, successful: 738, failed: 27 },
            { hour: "18:00", requests: 654, successful: 631, failed: 23 },
            { hour: "19:00", requests: 543, successful: 524, failed: 19 },
            { hour: "20:00", requests: 432, successful: 417, failed: 15 },
            { hour: "21:00", requests: 345, successful: 333, failed: 12 },
            { hour: "22:00", requests: 278, successful: 268, failed: 10 },
            { hour: "23:00", requests: 234, successful: 226, failed: 8 }
          ],
          requestsByEndpoint: [
            { endpoint: "/api/auth/login", count: 2456, method: "POST", avgResponseTime: 245 },
            { endpoint: "/api/users", count: 1876, method: "GET", avgResponseTime: 156 },
            { endpoint: "/api/features", count: 1654, method: "GET", avgResponseTime: 189 },
            { endpoint: "/api/routes", count: 1432, method: "GET", avgResponseTime: 167 },
            { endpoint: "/api/auth/refresh", count: 1234, method: "POST", avgResponseTime: 123 },
            { endpoint: "/api/dashboard", count: 987, method: "GET", avgResponseTime: 234 },
            { endpoint: "/api/analytics", count: 876, method: "GET", avgResponseTime: 345 },
            { endpoint: "/api/settings", count: 654, method: "GET", avgResponseTime: 198 }
          ],
          requestsByStatus: [
            { status: "200 OK", count: 12456, percentage: 80.8, color: "#22c55e" },
            { status: "201 Created", count: 1876, percentage: 12.2, color: "#16a34a" },
            { status: "304 Not Modified", count: 544, percentage: 3.5, color: "#84cc16" },
            { status: "400 Bad Request", count: 234, percentage: 1.5, color: "#f59e0b" },
            { status: "401 Unauthorized", count: 156, percentage: 1.0, color: "#ef4444" },
            { status: "404 Not Found", count: 98, percentage: 0.6, color: "#dc2626" },
            { status: "500 Server Error", count: 56, percentage: 0.4, color: "#b91c1c" }
          ],
          recentLogs: [
            {
              id: "1",
              timestamp: "2024-01-15 14:32:15",
              method: "GET",
              endpoint: "/api/users",
              status: 200,
              responseTime: 156,
              userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
              ip: "192.168.1.100"
            },
            {
              id: "2",
              timestamp: "2024-01-15 14:32:12",
              method: "POST",
              endpoint: "/api/auth/login",
              status: 200,
              responseTime: 245,
              userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
              ip: "192.168.1.101"
            },
            {
              id: "3",
              timestamp: "2024-01-15 14:32:08",
              method: "GET",
              endpoint: "/api/features",
              status: 200,
              responseTime: 189,
              userAgent: "Mozilla/5.0 (X11; Linux x86_64)",
              ip: "192.168.1.102"
            },
            {
              id: "4",
              timestamp: "2024-01-15 14:32:05",
              method: "GET",
              endpoint: "/api/routes",
              status: 404,
              responseTime: 45,
              userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
              ip: "192.168.1.103"
            },
            {
              id: "5",
              timestamp: "2024-01-15 14:32:01",
              method: "POST",
              endpoint: "/api/auth/refresh",
              status: 401,
              responseTime: 123,
              userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
              ip: "192.168.1.104"
            }
          ]
        })
      } catch (error) {
        console.error('Error fetching access logs analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

  const chartConfig = {
    requests: {
      label: "Total Requests",
      color: "var(--primary)",
    },
    successful: {
      label: "Successful",
      color: "#22c55e",
    },
    failed: {
      label: "Failed",
      color: "#ef4444",
    },
  } satisfies ChartConfig

  /**
   * Mendapatkan status badge berdasarkan HTTP status code
   */
  const getStatusBadge = (status: number) => {
    if (status >= 200 && status < 300) {
      return <Badge variant="outline" className="text-green-600 border-green-600">Success</Badge>
    } else if (status >= 300 && status < 400) {
      return <Badge variant="outline" className="text-blue-600 border-blue-600">Redirect</Badge>
    } else if (status >= 400 && status < 500) {
      return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Client Error</Badge>
    } else {
      return <Badge variant="outline" className="text-red-600 border-red-600">Server Error</Badge>
    }
  }

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
            <CardDescription>Total Requests</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums flex items-center gap-2">
              <IconEye className="h-5 w-5 text-blue-500" />
              {analytics.totalRequests.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +{analytics.requestGrowth}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Growing steadily <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Total API requests today
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Successful Requests</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums flex items-center gap-2">
              <IconCheck className="h-5 w-5 text-green-500" />
              {analytics.successfulRequests.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-green-600">
                {analytics.successRate}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              High success rate <IconCheck className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Requests completed successfully
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Failed Requests</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums flex items-center gap-2">
              <IconAlertTriangle className="h-5 w-5 text-red-500" />
              {analytics.failedRequests.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-red-600">
                {((analytics.failedRequests / analytics.totalRequests) * 100).toFixed(1)}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Low error rate <IconTrendingDown className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Requests that failed
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Unique Users</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums flex items-center gap-2">
              <IconShield className="h-5 w-5 text-purple-500" />
              {analytics.uniqueUsers.toLocaleString()}
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
              Active users <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Unique users making requests
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Requests by Hour */}
        <Card>
          <CardHeader>
            <CardTitle>Requests by Hour</CardTitle>
            <CardDescription>
              Request volume and success rate throughout the day
            </CardDescription>
            <CardAction>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <AreaChart data={analytics.requestsByHour}>
                <defs>
                  <linearGradient id="fillRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--primary)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--primary)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 5)}
                />
                <YAxis />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-background border rounded-lg p-3 shadow-md">
                          <p className="font-medium">{label}</p>
                          <p className="text-sm">Total: {data.requests}</p>
                          <p className="text-sm text-green-600">Successful: {data.successful}</p>
                          <p className="text-sm text-red-600">Failed: {data.failed}</p>
                          <p className="text-sm text-muted-foreground">
                            Success Rate: {((data.successful / data.requests) * 100).toFixed(1)}%
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  dataKey="requests"
                  type="monotone"
                  fill="url(#fillRequests)"
                  fillOpacity={0.4}
                  stroke="var(--primary)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Endpoints */}
        <Card>
          <CardHeader>
            <CardTitle>Top Endpoints</CardTitle>
            <CardDescription>
              Most frequently accessed API endpoints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={analytics.requestsByEndpoint} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="endpoint" 
                  type="category" 
                  width={120}
                  tickFormatter={(value) => value.length > 15 ? `${value.slice(0, 15)}...` : value}
                />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-background border rounded-lg p-3 shadow-md">
                          <p className="font-medium">{label}</p>
                          <p className="text-sm">Method: {data.method}</p>
                          <p className="text-sm">Requests: {data.count}</p>
                          <p className="text-sm">Avg Response: {data.avgResponseTime}ms</p>
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

      {/* Recent Access Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Access Logs</CardTitle>
          <CardDescription>
            Latest API requests and their details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.recentLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">
                    {log.timestamp}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      log.method === 'GET' ? 'text-blue-600 border-blue-600' :
                      log.method === 'POST' ? 'text-green-600 border-green-600' :
                      log.method === 'PUT' ? 'text-yellow-600 border-yellow-600' :
                      log.method === 'DELETE' ? 'text-red-600 border-red-600' :
                      'text-gray-600 border-gray-600'
                    }>
                      {log.method}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {log.endpoint}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(log.status)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {log.responseTime}ms
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {log.ip}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
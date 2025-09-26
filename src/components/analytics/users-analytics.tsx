"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { IconTrendingDown, IconTrendingUp, IconUsers, IconUserCheck, IconUserX, IconUserPlus } from "@tabler/icons-react"

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
 * Interface untuk data user analytics
 */
interface UserAnalytics {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  newUsers: number
  userGrowth: number
  usersByDepartment: Array<{
    department: string
    count: number
    color: string
  }>
  userRegistrationTrend: Array<{
    date: string
    users: number
    active: number
  }>
}

/**
 * Komponen untuk menampilkan analisa pengguna
 * Menampilkan statistik, trend, dan visualisasi data pengguna
 */
export function UsersAnalytics() {
  const [analytics, setAnalytics] = React.useState<UserAnalytics | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [timeRange, setTimeRange] = React.useState("30d")

  /**
   * Fetch data analytics dari API
   */
  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        
        // Fetch users data dari API
        const response = await fetch('http://localhost:9999/api/v1/users')
        const users = await response.json()
        
        // Simulasi data analytics berdasarkan data users
        const mockAnalytics: UserAnalytics = {
          totalUsers: users.length || 150,
          activeUsers: Math.floor((users.length || 150) * 0.8),
          inactiveUsers: Math.floor((users.length || 150) * 0.2),
          newUsers: Math.floor((users.length || 150) * 0.1),
          userGrowth: 12.5,
          usersByDepartment: [
            { department: "Engineering", count: 45, color: "#3b82f6" },
            { department: "Marketing", count: 32, color: "#10b981" },
            { department: "Sales", count: 28, color: "#f59e0b" },
            { department: "HR", count: 20, color: "#ef4444" },
            { department: "Finance", count: 15, color: "#8b5cf6" },
            { department: "Operations", count: 10, color: "#06b6d4" }
          ],
          userRegistrationTrend: generateTrendData(timeRange)
        }
        
        setAnalytics(mockAnalytics)
      } catch (error) {
        console.error('Error fetching user analytics:', error)
        // Fallback data jika API gagal
        setAnalytics({
          totalUsers: 150,
          activeUsers: 120,
          inactiveUsers: 30,
          newUsers: 15,
          userGrowth: 12.5,
          usersByDepartment: [
            { department: "Engineering", count: 45, color: "#3b82f6" },
            { department: "Marketing", count: 32, color: "#10b981" },
            { department: "Sales", count: 28, color: "#f59e0b" },
            { department: "HR", count: 20, color: "#ef4444" },
            { department: "Finance", count: 15, color: "#8b5cf6" },
            { department: "Operations", count: 10, color: "#06b6d4" }
          ],
          userRegistrationTrend: generateTrendData(timeRange)
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

  /**
   * Generate data trend berdasarkan time range
   */
  const generateTrendData = (range: string) => {
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90
    const data = []
    const today = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      data.push({
        date: date.toISOString().split('T')[0],
        users: Math.floor(Math.random() * 10) + 5,
        active: Math.floor(Math.random() * 8) + 3
      })
    }
    
    return data
  }

  const chartConfig = {
    users: {
      label: "New Users",
      color: "var(--primary)",
    },
    active: {
      label: "Active Users",
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
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums flex items-center gap-2">
              <IconUsers className="h-5 w-5 text-blue-500" />
              {analytics.totalUsers.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +{analytics.userGrowth}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Growing steadily <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Total registered users
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Active Users</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums flex items-center gap-2">
              <IconUserCheck className="h-5 w-5 text-green-500" />
              {analytics.activeUsers.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +8.2%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              High engagement <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Users active in last 30 days
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Inactive Users</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums flex items-center gap-2">
              <IconUserX className="h-5 w-5 text-red-500" />
              {analytics.inactiveUsers.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingDown />
                -5.1%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Decreasing trend <IconTrendingDown className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Users inactive for 30+ days
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>New Users</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums flex items-center gap-2">
              <IconUserPlus className="h-5 w-5 text-purple-500" />
              {analytics.newUsers.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +15.3%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Strong acquisition <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              New registrations this month
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Registration Trend */}
        <Card>
          <CardHeader>
            <CardTitle>User Registration Trend</CardTitle>
            <CardDescription>
              New user registrations over time
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
              <AreaChart data={analytics.userRegistrationTrend}>
                <defs>
                  <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-users)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-users)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="var(--color-users)"
                  fill="url(#fillUsers)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Users by Department */}
        <Card>
          <CardHeader>
            <CardTitle>Users by Department</CardTitle>
            <CardDescription>
              Distribution of users across departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.usersByDepartment}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {analytics.usersByDepartment.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border rounded-lg p-2 shadow-md">
                            <p className="font-medium">{data.department}</p>
                            <p className="text-sm text-muted-foreground">
                              {data.count} users ({((data.count / analytics.totalUsers) * 100).toFixed(1)}%)
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {analytics.usersByDepartment.map((dept) => (
                <div key={dept.department} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: dept.color }}
                  />
                  <span className="text-sm">{dept.department}</span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    {dept.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
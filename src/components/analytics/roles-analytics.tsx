"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from "recharts"
import { IconTrendingDown, IconTrendingUp, IconShield, IconShieldCheck, IconShieldX, IconUsers } from "@tabler/icons-react"

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
 * Interface untuk data role analytics
 */
interface RoleAnalytics {
  totalRoles: number
  activeRoles: number
  inactiveRoles: number
  newRoles: number
  roleGrowth: number
  rolesByLevel: Array<{
    level: string
    count: number
    users: number
    color: string
  }>
  rolePermissions: Array<{
    role: string
    permissions: number
    users: number
    level: string
  }>
  roleDistribution: Array<{
    name: string
    value: number
    fill: string
  }>
}

/**
 * Komponen untuk menampilkan analisa peran
 * Menampilkan statistik, distribusi, dan visualisasi data peran
 */
export function RolesAnalytics() {
  const [analytics, setAnalytics] = React.useState<RoleAnalytics | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [viewType, setViewType] = React.useState("overview")

  /**
   * Fetch data analytics dari API
   */
  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        
        // Fetch roles data dari API
        const response = await fetch('http://localhost:9999/api/v1/roles')
        const roles = await response.json()
        
        // Simulasi data analytics berdasarkan data roles
        const mockAnalytics: RoleAnalytics = {
          totalRoles: roles.length || 25,
          activeRoles: Math.floor((roles.length || 25) * 0.85),
          inactiveRoles: Math.floor((roles.length || 25) * 0.15),
          newRoles: Math.floor((roles.length || 25) * 0.12),
          roleGrowth: 6.8,
          rolesByLevel: [
            { level: "Admin", count: 3, users: 8, color: "#ef4444" },
            { level: "Manager", count: 5, users: 25, color: "#f59e0b" },
            { level: "Senior", count: 7, users: 42, color: "#10b981" },
            { level: "Junior", count: 6, users: 58, color: "#3b82f6" },
            { level: "Intern", count: 4, users: 17, color: "#8b5cf6" }
          ],
          rolePermissions: [
            { role: "Super Admin", permissions: 45, users: 2, level: "Admin" },
            { role: "System Admin", permissions: 38, users: 6, level: "Admin" },
            { role: "Project Manager", permissions: 28, users: 12, level: "Manager" },
            { role: "Team Lead", permissions: 25, users: 13, level: "Manager" },
            { role: "Senior Developer", permissions: 22, users: 18, level: "Senior" },
            { role: "Senior Designer", permissions: 20, users: 12, level: "Senior" },
            { role: "Developer", permissions: 18, users: 32, level: "Junior" },
            { role: "Designer", permissions: 16, users: 15, level: "Junior" },
            { role: "QA Tester", permissions: 14, users: 11, level: "Junior" },
            { role: "Intern Developer", permissions: 8, users: 10, level: "Intern" },
            { role: "Intern Designer", permissions: 7, users: 7, level: "Intern" }
          ],
          roleDistribution: [
            { name: "Admin", value: 85, fill: "#ef4444" },
            { name: "Manager", value: 70, fill: "#f59e0b" },
            { name: "Senior", value: 60, fill: "#10b981" },
            { name: "Junior", value: 45, fill: "#3b82f6" },
            { name: "Intern", value: 30, fill: "#8b5cf6" }
          ]
        }
        
        setAnalytics(mockAnalytics)
      } catch (error) {
        console.error('Error fetching role analytics:', error)
        // Fallback data jika API gagal
        setAnalytics({
          totalRoles: 25,
          activeRoles: 21,
          inactiveRoles: 4,
          newRoles: 3,
          roleGrowth: 6.8,
          rolesByLevel: [
            { level: "Admin", count: 3, users: 8, color: "#ef4444" },
            { level: "Manager", count: 5, users: 25, color: "#f59e0b" },
            { level: "Senior", count: 7, users: 42, color: "#10b981" },
            { level: "Junior", count: 6, users: 58, color: "#3b82f6" },
            { level: "Intern", count: 4, users: 17, color: "#8b5cf6" }
          ],
          rolePermissions: [
            { role: "Super Admin", permissions: 45, users: 2, level: "Admin" },
            { role: "System Admin", permissions: 38, users: 6, level: "Admin" },
            { role: "Project Manager", permissions: 28, users: 12, level: "Manager" },
            { role: "Team Lead", permissions: 25, users: 13, level: "Manager" },
            { role: "Senior Developer", permissions: 22, users: 18, level: "Senior" },
            { role: "Senior Designer", permissions: 20, users: 12, level: "Senior" },
            { role: "Developer", permissions: 18, users: 32, level: "Junior" },
            { role: "Designer", permissions: 16, users: 15, level: "Junior" },
            { role: "QA Tester", permissions: 14, users: 11, level: "Junior" },
            { role: "Intern Developer", permissions: 8, users: 10, level: "Intern" },
            { role: "Intern Designer", permissions: 7, users: 7, level: "Intern" }
          ],
          roleDistribution: [
            { name: "Admin", value: 85, fill: "#ef4444" },
            { name: "Manager", value: 70, fill: "#f59e0b" },
            { name: "Senior", value: 60, fill: "#10b981" },
            { name: "Junior", value: 45, fill: "#3b82f6" },
            { name: "Intern", value: 30, fill: "#8b5cf6" }
          ]
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const chartConfig = {
    permissions: {
      label: "Permissions",
      color: "var(--primary)",
    },
    users: {
      label: "Users",
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
            <CardDescription>Total Roles</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums flex items-center gap-2">
              <IconShield className="h-5 w-5 text-blue-500" />
              {analytics.totalRoles.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +{analytics.roleGrowth}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Expanding access <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Total defined roles
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Active Roles</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums flex items-center gap-2">
              <IconShieldCheck className="h-5 w-5 text-green-500" />
              {analytics.activeRoles.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +4.2%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              High utilization <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Roles currently in use
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Inactive Roles</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums flex items-center gap-2">
              <IconShieldX className="h-5 w-5 text-red-500" />
              {analytics.inactiveRoles.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingDown />
                -1.8%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Cleanup needed <IconTrendingDown className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Unused or deprecated roles
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>New Roles</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums flex items-center gap-2">
              <IconUsers className="h-5 w-5 text-purple-500" />
              {analytics.newRoles.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +18.5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Growing complexity <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Roles created this month
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Roles by Level */}
        <Card>
          <CardHeader>
            <CardTitle>Roles by Level</CardTitle>
            <CardDescription>
              Distribution of roles across organizational levels
            </CardDescription>
            <CardAction>
              <Select value={viewType} onValueChange={setViewType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                </SelectContent>
              </Select>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={analytics.rolesByLevel}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-background border rounded-lg p-3 shadow-md">
                          <p className="font-medium">{label} Level</p>
                          <p className="text-sm">Roles: {data.count}</p>
                          <p className="text-sm">Users: {data.users}</p>
                          <p className="text-sm text-muted-foreground">
                            Avg: {(data.users / data.count).toFixed(1)} users/role
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="var(--primary)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Role Access Distribution</CardTitle>
            <CardDescription>
              Access level distribution across role hierarchy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="20%" 
                  outerRadius="90%" 
                  data={analytics.roleDistribution}
                >
                  <RadialBar 
                    dataKey="value" 
                    cornerRadius={10} 
                    fill="#8884d8" 
                  />
                  <Legend 
                    iconSize={10} 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border rounded-lg p-2 shadow-md">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm">Access Level: {data.value}%</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Permissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions Overview</CardTitle>
          <CardDescription>
            Detailed breakdown of permissions and user assignments per role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.rolePermissions.map((role, index) => (
              <div key={role.role} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{role.role}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{role.permissions} permissions</span>
                      <span>•</span>
                      <span>{role.users} users</span>
                      <span>•</span>
                      <Badge 
                        variant="secondary" 
                        className="text-xs"
                        style={{ 
                          backgroundColor: analytics.rolesByLevel.find(l => l.level === role.level)?.color + '20',
                          color: analytics.rolesByLevel.find(l => l.level === role.level)?.color
                        }}
                      >
                        {role.level}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {((role.permissions / 45) * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Permission coverage
                    </div>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(role.permissions / 45) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role Summary */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {analytics.rolesByLevel.map((level) => (
          <Card key={level.level}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: level.color }}
                />
                {level.level} Level
              </CardTitle>
              <CardDescription>
                {level.count} roles • {level.users} users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Roles</span>
                  <span className="font-medium">{level.count}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Users</span>
                  <span className="font-medium">{level.users}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg Users/Role</span>
                  <span className="font-medium">{(level.users / level.count).toFixed(1)}</span>
                </div>
                <div className="pt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        backgroundColor: level.color,
                        width: `${(level.users / Math.max(...analytics.rolesByLevel.map(r => r.users))) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
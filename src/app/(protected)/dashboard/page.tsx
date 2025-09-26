"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/ui/tabs"
import { UsersAnalytics } from "@/components/analytics/users-analytics"
import { FeaturesAnalytics } from "@/components/analytics/features-analytics"
import { RolesAnalytics } from "@/components/analytics/roles-analytics"

/**
 * Halaman Dashboard yang menampilkan analisa users, features, dan roles
 * Menggunakan protected layout untuk konsistensi UI
 * Implementasi tabs untuk navigasi antar analisa
 */
export default function DashboardPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Analytics</h1>
        <p className="text-muted-foreground">
          Analisa komprehensif untuk users, features, dan roles dalam sistem
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-6" suppressHydrationWarning>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Users Analytics</TabsTrigger>
          <TabsTrigger value="features">Features Analytics</TabsTrigger>
          <TabsTrigger value="roles">Roles Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-6">
          <UsersAnalytics />
        </TabsContent>
        
        <TabsContent value="features" className="space-y-6">
          <FeaturesAnalytics />
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-6">
          <RolesAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}

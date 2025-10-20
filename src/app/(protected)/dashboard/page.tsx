"use client"
import { UsersAnalytics } from "@/components/analytics/users-analytics"
import { FeaturesAnalytics } from "@/components/analytics/features-analytics"
import { RolesAnalytics } from "@/components/analytics/roles-analytics"
import { DashboardPage as DashboardLayout } from "@/components/layouts/DashboardPage"

/**
 * Halaman Dashboard yang menampilkan analisa users, features, dan roles
 * Menggunakan protected layout untuk konsistensi UI
 * Implementasi tabs untuk navigasi antar analisa
 */
export default function DashboardAppPage() {
  return (
    <DashboardLayout
      title="Dashboard Analytics"
      description="Analisa komprehensif untuk users, features, dan roles dalam sistem"
      tabs={[
        { value: "users", label: "Users Analytics", content: <UsersAnalytics /> },
        { value: "features", label: "Features Analytics", content: <FeaturesAnalytics /> },
        { value: "roles", label: "Roles Analytics", content: <RolesAnalytics /> },
      ]}
      defaultTab="users"
    >
    </DashboardLayout>
  )
}

"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconInnerShadowTop,
  IconSearch,
  IconSettings,
  IconUsers,
  IconShield,
  IconLock,
  IconRoute,
  IconCategory,
  IconFeather,
  IconUserCheck,
  IconShieldCheck,
  IconActivity,
  IconMapPin,
  IconHome,
  IconPhone,
  IconNotification,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavFeatures } from "@/components/nav-features"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcn/ui/sidebar"

/**
 * Data konfigurasi untuk sidebar aplikasi Rockman
 * Berisi navigasi utama, sekunder, dan informasi pengguna
 */
const data = {
  user: {
    name: "Admin Rockman",
    email: "admin@rockman.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "User Management",
      url: "/user-management",
      icon: IconUsers,
    },
    {
      title: "Phone Management",
      url: "/phone-management",
      icon: IconPhone,
    },
    {
      title: "Address Management",
      url: "/address-management",
      icon: IconMapPin,
    },
    {
      title: "Role Management", 
      url: "/role-management",
      icon: IconShield,
    },
    {
      title: "Feature Management",
      url: "/feature-management",
      icon: IconFeather,
    },
    {
      title: "Feature Categories",
      url: "/feature-categories",
      icon: IconCategory,
    },
  ],
  // Kelompok menu tambahan merujuk endpoint v2
  navFeatures: [
    {
      title: "Access Control",
      icon: IconLock,
      isActive: true,
      url: "/features",
      items: [
        {
          title: "Features",
          url: "/feature-management",
        },
        {
          title: "Categories",
          url: "/feature-categories",
        },
        {
          title: "Routes",
          url: "/routes",
        },
      ],
    },
    {
      title: "User & Roles",
      icon: IconUserCheck,
      url: "/users",
      items: [
        {
          title: "Users",
          url: "/user-management",
        },
        {
          title: "User Phones",
          url: "/phone-management",
        },
        {
          title: "User Addresses",
          url: "/addresses",
        },
        {
          title: "Roles",
          url: "/role-management",
        },
      ],
    },
    {
      title: "Address Management",
      icon: IconHome,
      url: "/addresses",
      items: [
        {
          title: "All Addresses",
          url: "/address-management",
        },
        {
          title: "User Addresses",
          url: "/addresses",
        },
      ],
    },
    {
      title: "Analytics",
      icon: IconActivity,
      url: "/analytics",
      items: [
        {
          title: "Access Logs",
          url: "/access-logs",
        },
        {
          title: "User Analytics",
          url: "/user-analytics",
        },
      ],
    },
    // Kelompokkan berdasarkan (nama folder / prefix)
    {
      title: "Users & Relations",
      icon: IconUsers,
      url: "/users",
      items: [
        { title: "Users", url: "/user-management" },
        { title: "User Roles", url: "/user-roles" },
        { title: "User Products", url: "/user-products" },
        { title: "User Memberships", url: "/user-memberships" },
        { title: "User Customers", url: "/user-customers" },
        { title: "User Departments", url: "/users/departments" },
      ],
    },
    {
      title: "Knowledge Base",
      icon: IconHelp,
      url: "/knowledge-base",
      items: [
        { title: "Knowledge Base", url: "/knowledge-base" },
        { title: "KB Articles", url: "/knowledge-base-articles" },
      ],
    },
    {
      title: "Tickets",
      icon: IconShieldCheck,
      url: "/tickets",
      items: [
        { title: "Tickets", url: "/tickets" },
        { title: "Ticket Replies", url: "/ticket-replies" },
        { title: "Ticket to KB", url: "/ticket-to-knowledge-base" },
      ],
    },
    {
      title: "Billing & Finance",
      icon: IconChartBar,
      url: "/billing",
      items: [
        { title: "Payments", url: "/payments" },
        { title: "Payment Methods", url: "/payment-methods" },
        { title: "Invoices", url: "/invoices" },
        { title: "Invoice Items", url: "/invoice-items" },
        { title: "Credit Notes", url: "/credit-notes" },
        { title: "Credit Note Applications", url: "/credit-note-applications" },
        { title: "Transactions", url: "/transactions" },
      ],
    },
    {
      title: "Products & Subscriptions",
      icon: IconCategory,
      url: "/products",
      items: [
        { title: "Products", url: "/products" },
        { title: "Subscriptions", url: "/subscriptions" },
        { title: "Subscription Discounts", url: "/subscription-discounts" },
        { title: "Discounts", url: "/discounts" },
        { title: "Loyalty Points", url: "/loyalty-points" },
      ],
    },
    {
      title: "HR & Employees",
      icon: IconUserCheck,
      url: "/employees",
      items: [
        { title: "Employees", url: "/employees" },
        { title: "Employment History", url: "/employment-history" },
        { title: "Leave Requests", url: "/leave-requests" },
        { title: "Performance Reviews", url: "/performance-reviews" },
        { title: "Payrolls", url: "/payrolls" },
        { title: "Policies", url: "/policies" },
        { title: "Policy Violations", url: "/policy-violations" },
        { title: "Positions", url: "/positions" },
      ],
    },
    {
      title: "Departments",
      icon: IconShield,
      url: "/departments",
      items: [
        { title: "Departments", url: "/departments" },
      ],
    },
    {
      title: "Network",
      icon: IconRoute,
      url: "/network",
      items: [
        { title: "Network Equipment", url: "/network-equipment" },
        { title: "Outages", url: "/outages" },
      ],
    },
    {
      title: "Addresses & Phones",
      icon: IconHome,
      url: "/addresses",
      items: [
        { title: "Addresses", url: "/addresses" },
        { title: "Phones", url: "/phone-management" },
      ],
    },
    {
      title: "Notifications",
      icon: IconNotification,
      url: "/notifications",
      items: [
        { title: "Notifications", url: "/notifications" },
        { title: "Change History", url: "/change-history" },
      ],
    },
    {
      title: "Customers",
      icon: IconUsers,
      url: "/customers",
      items: [
        { title: "Customers", url: "/customers" },
        { title: "Customer Equipment", url: "/customer-equipment" },
      ],
    },
  ],
  
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Help & Support",
      url: "/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "/search",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "System Analytics",
      url: "/analytics",
      icon: IconChartBar,
    },
    {
      name: "Access Reports",
      url: "/reports",
      icon: IconShieldCheck,
    },
    {
      name: "Route Management",
      url: "/routes",
      icon: IconRoute,
    },
  ],
}

/**
 * Komponen utama sidebar aplikasi Rockman
 * Menampilkan navigasi utama, features, documents, dan user info
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Rockman</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavFeatures items={data.navFeatures} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

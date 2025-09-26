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

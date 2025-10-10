"use client"

import { useEffect, useState, Fragment } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { decodeJwt, getAuthToken } from "@/lib/auth"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/shadcn/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbPage } from "@/components/shadcn/ui/breadcrumb"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    // Baca token dari localStorage via helper agar aman di lingkungan client
    const token = getAuthToken()
    let isValid = false
    if (token) {
      try {
        const payload = decodeJwt(token)
        const exp = (payload?.exp as number | undefined)
        // Jika tidak ada exp, anggap valid; jika ada, pastikan belum kedaluwarsa
        isValid = !exp || exp * 1000 > Date.now()
      } catch {
        isValid = false
      }
    }

    if (!isValid) {
      // Tidak ada token atau token kedaluwarsa: arahkan ke halaman login
      router.replace("/login")
      setAllowed(false)
    } else {
      setAllowed(true)
    }
    setReady(true)
  }, [router])

  // Tampilkan placeholder singkat untuk mencegah flash konten
  if (!ready) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-muted-foreground">Memeriksa sesi…</div>
      </div>
    )
  }

  // Setelah redirect, hentikan render konten terproteksi jika tidak diizinkan
  if (!allowed) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex min-h-svh flex-col">
          <header className="flex h-12 items-center gap-3 border-b px-4">
            <SidebarTrigger />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {(() => {
                  const segs = (pathname || "").split("/").filter(Boolean)
                  // Build cumulative hrefs for segments
                  const items = [] as { label: string; href: string }[]
                  let acc = ""
                  for (let i = 0; i < segs.length; i++) {
                    acc += `/${segs[i]}`
                    items.push({ label: segs[i], href: acc })
                  }
                  // Render segments after root; skip empty
                  return items.map((item, idx) => (
                    <Fragment key={`crumb-${idx}`}>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        {idx === items.length - 1 ? (
                          <BreadcrumbPage>{item.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link href={item.href}>{item.label}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </Fragment>
                  ))
                })()}
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <main className="flex-1 p-4">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
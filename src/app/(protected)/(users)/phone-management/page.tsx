"use client"

import React, { useEffect, useState } from "react"
import { getAuthToken } from "@/lib/auth"
import Link from "next/link"

import { Badge } from "@/components/shadcn/ui/badge"
import { Button } from "@/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/ui/table"
import { Alert, AlertDescription } from "@/components/shadcn/ui/alert"

type Phone = {
  id: string
  userId: string
  label?: string | null
  countryCode: string
  phoneNumber: string
  isDefault: boolean
  isActive?: boolean
  isVerified?: boolean
  createdAt?: string
  updatedAt?: string
}

export default function PhoneManagementPage() {
  const [phones, setPhones] = useState<Phone[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    
    // Gunakan util auth untuk konsistensi pengambilan token
    const token = typeof window !== "undefined" ? (getAuthToken() || localStorage.getItem("auth_token") || localStorage.getItem("token")) : null
    
    async function fetchPhones() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`/api/v2/phones`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })

        const json = await res.json()
        if (!res.ok) throw new Error(json?.message || "Gagal mengambil nomor telepon")
        const data: Phone[] = json?.data ?? []
        setPhones(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan")
      } finally {
        setLoading(false)
      }
    }

    fetchPhones()
  }, [])

  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Nomor Telepon</h1>
        <p className="text-muted-foreground">Daftar semua nomor telepon dari endpoint /api/v2/phones</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Daftar Nomor Telepon */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Nomor Telepon</CardTitle>
          <CardDescription>Menampilkan {phones.length} nomor telepon</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Memuat data nomor telepon...</p>
          ) : phones.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tidak ada data nomor telepon.</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nomor</TableHead>
                    <TableHead>Info</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Default</TableHead>
                    <TableHead>Dibuat / Diubah</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {phones.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="space-y-1">
                        <div className="font-medium">+{p.countryCode} {p.phoneNumber}</div>
                        {p.label ? (
                          <div className="text-sm text-muted-foreground">Label: {p.label}</div>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">User: {p.userId || "-"}</TableCell>
                      <TableCell className="space-x-2">
                        {p.isDefault && <Badge variant="secondary">Default</Badge>}
                        {p.isActive ? (
                          <Badge variant="default">Aktif</Badge>
                        ) : (
                          <Badge variant="destructive">Tidak Aktif</Badge>
                        )}
                        {p.isVerified ? (
                          <Badge variant="default">Terverifikasi</Badge>
                        ) : (
                          <Badge variant="destructive">Belum</Badge>
                        )}
                      </TableCell>
                      <TableCell>{p.isDefault ? "Ya" : "Tidak"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div>{p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}</div>
                        <div>{p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "-"}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/phones/${p.id}`}>Lihat</Link>
                          </Button>
                          <Button asChild variant="default" size="sm">
                            <Link href={`/phones/${p.id}/edit`}>Edit</Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
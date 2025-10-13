"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"

import { Badge } from "@/components/shadcn/ui/badge"
import { Button } from "@/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/ui/table"
import { Alert, AlertDescription } from "@/components/shadcn/ui/alert"
import { getAuthToken } from "@/lib/auth"

type Address = {
  id: string
  userId: string
  label: string
  recipientName: string
  phoneNumber: string
  addressLine1: string
  addressLine2?: string | null
  city: string
  province: string
  postalCode: string
  country: string
  isDefault: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AddressManagementPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = getAuthToken()

    async function fetchAddresses() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`/api/v2/addresses`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })

        const json = await res.json()
        if (!res.ok) throw new Error(json?.message || "Gagal mengambil alamat")
        const data: Address[] = json?.data ?? []
        setAddresses(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan")
      } finally {
        setLoading(false)
      }
    }

    fetchAddresses()
  }, [])

  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Alamat</h1>
        <p className="text-muted-foreground">Daftar semua alamat dari endpoint /api/v2/addresses</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Daftar Alamat */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Alamat</CardTitle>
          <CardDescription>Menampilkan {addresses.length} alamat</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Memuat data alamat...</p>
          ) : addresses.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tidak ada data alamat.</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alamat</TableHead>
                    <TableHead>Info</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Default</TableHead>
                    <TableHead>Dibuat / Diubah</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {addresses.map((addr) => (
                    <TableRow key={addr.id}>
                      <TableCell className="space-y-1">
                        <div className="font-medium">{addr.addressLine1 || "(Tanpa alamat)"}</div>
                        {addr.addressLine2 && (
                          <div className="text-sm text-muted-foreground">{addr.addressLine2}</div>
                        )}
                        <div className="text-sm text-muted-foreground">
                          {[addr.city, addr.province, addr.postalCode].filter(Boolean).join(", ")}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        User: {addr.userId || "-"}
                      </TableCell>
                      <TableCell className="space-x-2">
                        {addr.isDefault && <Badge variant="secondary">Default</Badge>}
                        {addr.isActive ? (
                          <Badge variant="default">Aktif</Badge>
                        ) : (
                          <Badge variant="destructive">Tidak Aktif</Badge>
                        )}
                      </TableCell>
                      <TableCell>{addr.isDefault ? "Ya" : "Tidak"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div>{addr.createdAt ? new Date(addr.createdAt).toLocaleString() : "-"}</div>
                        <div>{addr.updatedAt ? new Date(addr.updatedAt).toLocaleString() : "-"}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/addresses/${addr.id}`}>Lihat</Link>
                          </Button>
                          <Button asChild variant="default" size="sm">
                            <Link href={`/addresses/${addr.id}/edit`}>Edit</Link>
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
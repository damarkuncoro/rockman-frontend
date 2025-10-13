"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/shadcn/ui/card"
import { Badge } from "@/components/shadcn/ui/badge"
import { Button } from "@/components/shadcn/ui/button"
import { Label } from "@/components/shadcn/ui/label"
import { Input } from "@/components/shadcn/ui/input"
import { Separator } from "@/components/shadcn/ui/separator"

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

export default function AddressDetailPage() {
  const router = useRouter()
  const params = useParams()
  const addressId = params.id as string

  const [address, setAddress] = useState<Address | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  useEffect(() => {
    const fetchAddress = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/v2/addresses/${addressId}`, {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.message || "Gagal mengambil alamat")
        const item: Address | null = json?.data || null
        if (!item) throw new Error("Alamat tidak ditemukan")
        setAddress(item)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Terjadi kesalahan saat mengambil alamat")
      } finally {
        setLoading(false)
      }
    }
    void fetchAddress()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressId])

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>Kembali</Button>
        <div className="flex gap-2">
          <Button variant="default" onClick={() => router.push(`/addresses/${addressId}/edit`)} disabled={!address}>Edit</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detail Alamat</CardTitle>
          <CardDescription>Memuat detail alamat berdasarkan ID</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && <div className="text-sm text-muted-foreground">Memuat data...</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}

          {address && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">ID: {address.id}</Badge>
                {address.isDefault && <Badge variant="default">Default</Badge>}
                {address.isActive ? (
                  <Badge variant="default">Aktif</Badge>
                ) : (
                  <Badge variant="destructive">Tidak Aktif</Badge>
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Label</Label>
                  <div className="text-sm font-medium">{address.label}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Nama Penerima</Label>
                  <div className="text-sm font-medium">{address.recipientName}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Nomor Telepon</Label>
                  <div className="text-sm font-medium">{address.phoneNumber}</div>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm text-muted-foreground">Alamat</Label>
                  <div className="text-sm font-medium whitespace-pre-line">{address.addressLine1}</div>
                  {address.addressLine2 && <div className="text-sm font-medium whitespace-pre-line">{address.addressLine2}</div>}
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Kota</Label>
                  <div className="text-sm font-medium">{address.city}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Provinsi</Label>
                  <div className="text-sm font-medium">{address.province}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Kode Pos</Label>
                  <div className="text-sm font-medium">{address.postalCode}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Negara</Label>
                  <div className="text-sm font-medium">{address.country}</div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Dibuat</Label>
                  <div className="text-sm font-medium">{new Date(address.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Diperbarui</Label>
                  <div className="text-sm font-medium">{new Date(address.updatedAt).toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
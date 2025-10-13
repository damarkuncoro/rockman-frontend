"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shadcn/ui/card"
import { Label } from "@/components/shadcn/ui/label"
import { Input } from "@/components/shadcn/ui/input"
import { Textarea } from "@/components/shadcn/ui/textarea"
import { Switch } from "@/components/shadcn/ui/switch"
import { Button } from "@/components/shadcn/ui/button"

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
}

type FormData = {
  label: string
  recipientName: string
  phoneNumber: string
  addressLine1: string
  addressLine2?: string
  city: string
  province: string
  postalCode: string
  country: string
  isDefault: boolean
}

export default function EditAddressPage() {
  const router = useRouter()
  const params = useParams()
  const addressId = params.id as string

  const [userId, setUserId] = useState("")
  const [address, setAddress] = useState<Address | null>(null)
  const [form, setForm] = useState<FormData>({
    label: "",
    recipientName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Indonesia",
    isDefault: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  useEffect(() => {
    const fetchAddress = async () => {
      if (!userId) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/v2/users/${userId}/addresses`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.message || "Gagal mengambil alamat")

        const items: Address[] = json?.data || []
        const found = items.find((a) => String(a.id) === String(addressId)) || null
        if (!found) throw new Error("Alamat tidak ditemukan untuk user ini")
        setAddress(found)
        setForm({
          label: found.label || "",
          recipientName: found.recipientName || "",
          phoneNumber: found.phoneNumber || "",
          addressLine1: found.addressLine1 || "",
          addressLine2: found.addressLine2 || "",
          city: found.city || "",
          province: found.province || "",
          postalCode: found.postalCode || "",
          country: found.country || "Indonesia",
          isDefault: !!found.isDefault,
        })
      } catch (e) {
        setError(e instanceof Error ? e.message : "Terjadi kesalahan saat mengambil alamat")
      } finally {
        setLoading(false)
      }
    }
    void fetchAddress()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, addressId])

  const onChange = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const onSubmit = async () => {
    if (!userId) {
      setError("User ID diperlukan")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/v2/users/${userId}/addresses`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ addressId, ...form }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.message || "Gagal memperbarui alamat")
      router.back()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan saat memperbarui alamat")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Alamat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>User ID</Label>
            <Input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Masukkan UUID User" />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input value={form.label} onChange={(e) => onChange("label", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Nama Penerima</Label>
              <Input value={form.recipientName} onChange={(e) => onChange("recipientName", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Nomor Telepon</Label>
              <Input value={form.phoneNumber} onChange={(e) => onChange("phoneNumber", e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Alamat</Label>
              <Textarea value={form.addressLine1} onChange={(e) => onChange("addressLine1", e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Alamat (Baris 2)</Label>
              <Textarea value={form.addressLine2} onChange={(e) => onChange("addressLine2", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Kota</Label>
              <Input value={form.city} onChange={(e) => onChange("city", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Provinsi</Label>
              <Input value={form.province} onChange={(e) => onChange("province", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Kode Pos</Label>
              <Input value={form.postalCode} onChange={(e) => onChange("postalCode", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Negara</Label>
              <Input value={form.country} onChange={(e) => onChange("country", e.target.value)} />
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={form.isDefault} onCheckedChange={(v) => onChange("isDefault", v)} />
              <Label>Jadikan sebagai alamat default</Label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={onSubmit} disabled={loading || !userId}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Batal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
"use client"

import { useEffect, useMemo, useState } from "react"
import { IconUser, IconBuilding, IconShieldLock, IconHome, IconPhone, IconId, IconKey, IconCopy } from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Separator } from "@/components/shadcn/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/ui/alert"
import { Badge } from "@/components/shadcn/ui/badge"
import { Button } from "@/components/shadcn/ui/button"
import { Input } from "@/components/shadcn/ui/input"
import { Label } from "@/components/shadcn/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/shadcn/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/ui/select"
import { useCurrentUser } from "@/hooks/users/useCurrentUser"
import { useUserSessions } from "@/hooks/api/v2/users/[id]/sessions"
import { decodeJwt, getAuthToken } from "@/lib/auth"

export default function AccountsPage() {
  const [mounted, setMounted] = useState(false)
  const [tokenVersion, setTokenVersion] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const [refreshError, setRefreshError] = useState<string | null>(null)
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null)
  const { userId, user, loading, error } = useCurrentUser()
  const { refetch } = useCurrentUser()
  const { sessions, loading: sessLoading, error: sessError, fetchUserSessions } = useUserSessions()

  // Refresh token (masked) state
  const [refreshMasked, setRefreshMasked] = useState<string | null>(null)
  const [refreshExp, setRefreshExp] = useState<string | null>(null)
  const [refreshLoading, setRefreshLoading] = useState<boolean>(false)
  const [refreshInfoError, setRefreshInfoError] = useState<string | null>(null)

  // State untuk dialog tambah identitas
  const [identityDialogOpen, setIdentityDialogOpen] = useState(false)
  const [identityType, setIdentityType] = useState<string>("KTP")
  const [identityNumber, setIdentityNumber] = useState<string>("")
  const [submittingIdentity, setSubmittingIdentity] = useState(false)
  const [submitIdentityError, setSubmitIdentityError] = useState<string | null>(null)
  // State untuk dialog tambah alamat
  const [addressDialogOpen, setAddressDialogOpen] = useState(false)
  const [submittingAddress, setSubmittingAddress] = useState(false)
  const [submitAddressError, setSubmitAddressError] = useState<string | null>(null)
  const [addressLabel, setAddressLabel] = useState<string>("")
  const [addressRecipientName, setAddressRecipientName] = useState<string>("")
  const [addressPhoneNumber, setAddressPhoneNumber] = useState<string>("")
  const [addressLine1, setAddressLine1] = useState<string>("")
  const [addressCity, setAddressCity] = useState<string>("")
  const [addressProvince, setAddressProvince] = useState<string>("")
  const [addressPostalCode, setAddressPostalCode] = useState<string>("")
  const [addressCountry, setAddressCountry] = useState<string>("Indonesia")
  const [addressIsDefault, setAddressIsDefault] = useState<string>("false")

  // State untuk dialog tambah telepon
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false)
  const [submittingPhone, setSubmittingPhone] = useState(false)
  const [submitPhoneError, setSubmitPhoneError] = useState<string | null>(null)
  const [phoneCountryCode, setPhoneCountryCode] = useState<string>("+62")
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [phoneLabel, setPhoneLabel] = useState<string>("")
  const [phoneIsDefault, setPhoneIsDefault] = useState<string>("false")

  // Token info
  const token = useMemo(() => (mounted ? getAuthToken() : null), [mounted, tokenVersion])
  const payload = useMemo(() => (token ? decodeJwt(token) : null), [token])

  const issuedAt = payload?.iat ? new Date(payload.iat * 1000) : null
  const expiresAt = payload?.exp ? new Date(payload.exp * 1000) : null
  const remainingMs = expiresAt ? expiresAt.getTime() - Date.now() : null

  const remainingText = useMemo(() => {
    if (remainingMs == null) return "-"
    if (remainingMs <= 0) return "Sudah kedaluwarsa"
    const totalSec = Math.floor(remainingMs / 1000)
    const days = Math.floor(totalSec / 86400)
    const hours = Math.floor((totalSec % 86400) / 3600)
    const minutes = Math.floor((totalSec % 3600) / 60)
    const seconds = totalSec % 60
    if (days > 0) return `${days}h ${hours}j ${minutes}m`
    if (hours > 0) return `${hours}j ${minutes}m`
    if (minutes > 0) return `${minutes}m ${seconds}d`
    return `${seconds}d`
  }, [remainingMs])

  const maskedToken = useMemo(() => {
    if (!token) return "-"
    return token.length > 16 ? `${token.slice(0, 8)}...${token.slice(-8)}` : token
  }, [token])

  const [copied, setCopied] = useState(false)
  const handleCopyToken = async () => {
    if (!token) return
    try {
      await navigator.clipboard.writeText(token)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error("Clipboard copy failed", e)
    }
  }

  // Copy alamat & telepon
  const [copiedAddressKey, setCopiedAddressKey] = useState<string | number | null>(null)
  const [copiedPhoneKey, setCopiedPhoneKey] = useState<string | number | null>(null)
  const handleCopyAddress = async (value: string | number, key: string | number) => {
    try {
      await navigator.clipboard.writeText(String(value))
      setCopiedAddressKey(key)
      setTimeout(() => setCopiedAddressKey(null), 2000)
    } catch (e) {
      console.error("Clipboard copy failed", e)
    }
  }
  const handleCopyPhone = async (value: string | number, key: string | number) => {
    try {
      await navigator.clipboard.writeText(String(value))
      setCopiedPhoneKey(key)
      setTimeout(() => setCopiedPhoneKey(null), 2000)
    } catch (e) {
      console.error("Clipboard copy failed", e)
    }
  }
  // Copy nomor identitas
  const [copiedIdentityKey, setCopiedIdentityKey] = useState<string | number | null>(null)
  const handleCopyIdentity = async (value: string | number, key: string | number) => {
    try {
      await navigator.clipboard.writeText(String(value))
      setCopiedIdentityKey(key)
      setTimeout(() => setCopiedIdentityKey(null), 2000)
    } catch (e) {
      console.error("Clipboard copy failed", e)
    }
  }

  // Hindari hydration mismatch, samakan render awal SSR & client
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && userId) {
      fetchUserSessions(userId)
    }
  }, [mounted, userId])

  // Ambil informasi refresh token (dimasking) dari endpoint protected
  useEffect(() => {
    const run = async () => {
      setRefreshLoading(true)
      setRefreshInfoError(null)
      try {
        const res = await fetch(`/api/v2/auth/refresh-token`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        })
        const json = await res.json()
        if (!res.ok || !json?.success) {
          throw new Error(json?.message || 'Gagal mengambil refresh token')
        }
        setRefreshMasked(json?.data?.refreshTokenMasked ?? null)
        setRefreshExp(json?.data?.expiresAt ?? null)
      } catch (e: any) {
        setRefreshInfoError(e?.message || 'Gagal mengambil refresh token')
      } finally {
        setRefreshLoading(false)
      }
    }
    run()
  }, [])

  const handleOpenIdentityDialog = () => {
    setSubmitIdentityError(null)
    setIdentityDialogOpen(true)
  }

  const reloadTokenInfo = () => {
    setTokenVersion((v) => v + 1)
  }

  const handleRefreshToken = async () => {
    setRefreshing(true)
    setRefreshError(null)
    try {
      const res = await fetch(`/api/v2/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Gagal me-refresh token (${res.status})`)
      }
      const result = await res.json()
      const newToken = (result?.token) || (result?.data?.token) || (result?.data)
      if (typeof newToken !== "string" || !newToken) {
        throw new Error("Token baru tidak ditemukan di respons")
      }
      try {
        localStorage.setItem("auth_token", newToken)
      } catch {}
      setLastRefreshedAt(new Date())
      reloadTokenInfo()
    } catch (err: any) {
      setRefreshError(err?.message || "Terjadi kesalahan saat me-refresh token")
    } finally {
      setRefreshing(false)
    }
  }

  const handleSubmitIdentity = async () => {
    if (!userId) return
    setSubmittingIdentity(true)
    setSubmitIdentityError(null)
    try {
      const res = await fetch(`/api/v2/users/${userId}/identities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: identityType, number: identityNumber }),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Gagal menyimpan identitas (${res.status})`)
      }
      // Reset form dan tutup dialog
      setIdentityNumber("")
      setIdentityType("KTP")
      setIdentityDialogOpen(false)
      // Refresh data user agar jumlah identitas ter-update
      try { await refetch?.() } catch {}
    } catch (err: any) {
      setSubmitIdentityError(err?.message || "Terjadi kesalahan saat menyimpan identitas")
    } finally {
      setSubmittingIdentity(false)
    }
  }

  // Handlers tambah alamat
  const handleOpenAddressDialog = () => {
    setSubmitAddressError(null)
    setAddressDialogOpen(true)
  }
  const handleSubmitAddress = async () => {
    if (!userId) return
    setSubmittingAddress(true)
    setSubmitAddressError(null)
    try {
      const payload = {
        label: addressLabel,
        recipientName: addressRecipientName,
        phoneNumber: addressPhoneNumber,
        addressLine1,
        city: addressCity,
        province: addressProvince,
        postalCode: addressPostalCode,
        country: addressCountry,
        isDefault: addressIsDefault === "true",
      }
      const res = await fetch(`/api/v2/users/${userId}/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Gagal menyimpan alamat (${res.status})`)
      }
      setAddressDialogOpen(false)
      setAddressLabel("")
      setAddressRecipientName("")
      setAddressPhoneNumber("")
      setAddressLine1("")
      setAddressCity("")
      setAddressProvince("")
      setAddressPostalCode("")
      setAddressCountry("Indonesia")
      setAddressIsDefault("false")
      try { await refetch?.() } catch {}
    } catch (err: any) {
      setSubmitAddressError(err?.message || "Terjadi kesalahan saat menyimpan alamat")
    } finally {
      setSubmittingAddress(false)
    }
  }

  // Handlers tambah telepon
  const handleOpenPhoneDialog = () => {
    setSubmitPhoneError(null)
    setPhoneLabel("")
    setPhoneDialogOpen(true)
  }
  const handleSubmitPhone = async () => {
    if (!userId) return
    setSubmittingPhone(true)
    setSubmitPhoneError(null)
    try {
      const payload = {
        label: phoneLabel || "Utama",
        countryCode: phoneCountryCode,
        phoneNumber: phoneNumber,
        isDefault: phoneIsDefault === "true",
      }
      const res = await fetch(`/api/v2/users/${userId}/phones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Gagal menyimpan telepon (${res.status})`)
      }
      setPhoneDialogOpen(false)
      setPhoneCountryCode("+62")
      setPhoneNumber("")
      setPhoneLabel("")
      setPhoneIsDefault("false")
      try { await refetch?.() } catch {}
    } catch (err: any) {
      setSubmitPhoneError(err?.message || "Terjadi kesalahan saat menyimpan telepon")
    } finally {
      setSubmittingPhone(false)
    }
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex items-center gap-3">
        <IconUser className="h-6 w-6" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Akun Saya</h1>
          <p className="text-muted-foreground">Informasi pengguna saat ini</p>
        </div>
      </div>

      <Separator />

      {!mounted || loading ? (
        <Card>
          <CardHeader>
            <CardTitle>Memuat data akun…</CardTitle>
            <CardDescription>Mohon tunggu sebentar</CardDescription>
          </CardHeader>
        </Card>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : String(error)}
          </AlertDescription>
        </Alert>
      ) : user ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profil</CardTitle>
              <CardDescription>Rangkuman identitas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nama</span>
                <span>{user.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Username</span>
                <span>{user.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span>{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={user.active ? "default" : "outline"}>
                  {user.active ? "Aktif" : "Tidak Aktif"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Refresh Token */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <IconKey className="h-4 w-4" />
                <CardTitle>Refresh Token</CardTitle>
              </div>
              <CardDescription>Nilai ditampilkan dalam bentuk dimasking demi keamanan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {!refreshInfoError ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Token</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {refreshLoading ? 'Memuat…' : (refreshMasked ?? 'Tidak tersedia')}
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kedaluwarsa</span>
                    <span className="text-xs">
                      {refreshLoading ? 'Memuat…' : (refreshExp ? new Date(refreshExp).toLocaleString() : 'Tidak diketahui')}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-destructive">Gagal memuat refresh token: {refreshInfoError}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <IconBuilding className="h-4 w-4" />
                <CardTitle>Departemen</CardTitle>
              </div>
              <CardDescription>Informasi unit dan keanggotaan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Primary</span>
                <span>
                  {user.primaryDepartment?.name || "-"}
                  {user.primaryDepartment?.code ? ` (${user.primaryDepartment.code})` : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jumlah Departemen</span>
                <span>{user.departments?.length || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <IconShieldLock className="h-4 w-4" />
                <CardTitle>Peran & Akses</CardTitle>
              </div>
              <CardDescription>Ringkasan role pengguna</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jumlah Role</span>
                <span>{user.roles?.length || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <IconKey className="h-4 w-4" />
                <CardTitle>Token & Expiry</CardTitle>
              </div>
              <CardDescription>Informasi token akses saat ini</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Token</span>
                <span className="font-mono text-sm">{maskedToken}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dibuat</span>
                <span>{issuedAt ? issuedAt.toLocaleString() : "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kedaluwarsa</span>
                <span>{expiresAt ? expiresAt.toLocaleString() : "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Waktu tersisa</span>
                <span>{remainingText}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={remainingMs != null && remainingMs > 0 ? "default" : "destructive"}>
                  {remainingMs != null && remainingMs > 0 ? "Valid" : "Kedaluwarsa"}
                </Badge>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={token || "-"}
                    className="font-mono text-xs"
                  />
                  <Button type="button" variant="outline" onClick={handleCopyToken} disabled={!token}>
                    <IconCopy className="h-4 w-4 mr-1" /> Copy
                  </Button>
                </div>
                {copied && (
                  <div className="text-xs text-muted-foreground">Token tersalin ke clipboard</div>
                )}
                {refreshError && (
                  <div className="text-xs text-destructive">{refreshError}</div>
                )}
                <div className="flex items-center gap-2 pt-1">
                  <Button type="button" onClick={handleRefreshToken} disabled={refreshing}>
                    {refreshing ? "Refreshing..." : "Refresh Token"}
                  </Button>
                  <Button type="button" variant="outline" onClick={reloadTokenInfo}>
                    Reload Info
                  </Button>
                  {lastRefreshedAt && (
                    <div className="text-xs text-muted-foreground">Terakhir di-refresh {lastRefreshedAt.toLocaleString()}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <IconHome className="h-4 w-4" />
                <CardTitle>Alamat</CardTitle>
              </div>
              <CardDescription>Ringkasan alamat pengguna</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jumlah Alamat</span>
                <span>{user.addresses?.length || 0}</span>
              </div>
              {(user.addresses?.length || 0) > 0 ? (
                <div className="mt-3 space-y-2">
                  {user.addresses?.map((address: any, idx: number) => {
                    const key = address.id ?? idx
                    const display = [address.addressLine1, address.city, address.province, address.postalCode].filter(Boolean).join(", ")
                    return (
                      <div key={key} className="space-y-1 rounded border p-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{address.label || "Alamat"}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{display || "-"}</span>
                            <Button type="button" size="sm" variant="outline" onClick={() => handleCopyAddress(display || "-", key)}>
                              <IconCopy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {copiedAddressKey === key && (
                          <div className="text-xs text-muted-foreground">Alamat tersalin</div>
                        )}
                      </div>
                    )
                  })}
                  <div className="flex justify-end pt-2">
                    <Button type="button" variant="outline" onClick={handleOpenAddressDialog}>
                      Tambah Alamat
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end pt-2">
                  <Button type="button" variant="default" onClick={handleOpenAddressDialog}>
                    Tambah Alamat
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <IconPhone className="h-4 w-4" />
                <CardTitle>Telepon</CardTitle>
              </div>
              <CardDescription>Ringkasan nomor telepon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jumlah Nomor</span>
                <span>{user.phones?.length || 0}</span>
              </div>
              {(user.phones?.length || 0) > 0 ? (
                <div className="mt-3 space-y-2">
                  {user.phones?.map((phone: any, idx: number) => {
                    const key = phone.id ?? idx
                    const display = `${phone.countryCode || ""}${phone.phoneNumber || ""}`.trim()
                    return (
                      <div key={key} className="space-y-1 rounded border p-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Nomor</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{display || "-"}</span>
                            <Button type="button" size="sm" variant="outline" onClick={() => handleCopyPhone(display || "-", key)}>
                              <IconCopy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {copiedPhoneKey === key && (
                          <div className="text-xs text-muted-foreground">Nomor telepon tersalin</div>
                        )}
                      </div>
                    )
                  })}
                  <div className="flex justify-end pt-2">
                    <Button type="button" variant="outline" onClick={handleOpenPhoneDialog}>
                      Tambah Telepon
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end pt-2">
                  <Button type="button" variant="default" onClick={handleOpenPhoneDialog}>
                    Tambah Telepon
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <IconId className="h-4 w-4" />
                <CardTitle>Identitas</CardTitle>
              </div>
              <CardDescription>Dokumen identitas pengguna</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jumlah Identitas</span>
                <span>{user.identities?.length || 0}</span>
              </div>
              {(user.identities?.length || 0) > 0 ? (
                <div className="mt-3 space-y-2">
                  {user.identities?.map((ident: any, idx: number) => {
                    const key = ident.id ?? idx
                    return (
                      <div key={key} className="space-y-1 rounded border p-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{ident.type}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{ident.number}</span>
                            <Button type="button" size="sm" variant="outline" onClick={() => handleCopyIdentity(ident.number, key)}>
                              <IconCopy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {copiedIdentityKey === key && (
                          <div className="text-xs text-muted-foreground">Nomor identitas tersalin</div>
                        )}
                      </div>
                    )
                  })}
                  <div className="flex justify-end pt-2">
                    <Button type="button" variant="outline" onClick={handleOpenIdentityDialog}>
                      Tambah Identitas
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end pt-2">
                  <Button type="button" variant="default" onClick={handleOpenIdentityDialog}>
                    Tambah Identitas
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dialog Tambah Identitas */}
          <Dialog open={identityDialogOpen} onOpenChange={setIdentityDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Tambah Identitas</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="identityType" className="text-right">Tipe</Label>
                  <Select value={identityType} onValueChange={setIdentityType}>
                    <SelectTrigger id="identityType" className="col-span-3">
                      <SelectValue placeholder="Pilih tipe identitas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KTP">KTP</SelectItem>
                      <SelectItem value="SIM">SIM</SelectItem>
                      <SelectItem value="Passport">Passport</SelectItem>
                      <SelectItem value="Lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="identityNumber" className="text-right">Nomor</Label>
                  <Input
                    id="identityNumber"
                    value={identityNumber}
                    onChange={(e) => setIdentityNumber(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                {submitIdentityError && (
                  <div className="text-destructive text-sm">{submitIdentityError}</div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIdentityDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleSubmitIdentity} disabled={submittingIdentity || !identityNumber}>
                  {submittingIdentity ? "Menyimpan…" : "Simpan"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Dialog Tambah Alamat */}
          <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Tambah Alamat</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="addressLabel" className="text-right">Label</Label>
                  <Input id="addressLabel" value={addressLabel} onChange={(e) => setAddressLabel(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="recipientName" className="text-right">Penerima</Label>
                  <Input id="recipientName" value={addressRecipientName} onChange={(e) => setAddressRecipientName(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="addrPhone" className="text-right">Telepon</Label>
                  <Input id="addrPhone" value={addressPhoneNumber} onChange={(e) => setAddressPhoneNumber(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="addressLine1" className="text-right">Alamat</Label>
                  <Input id="addressLine1" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="city" className="text-right">Kota</Label>
                  <Input id="city" value={addressCity} onChange={(e) => setAddressCity(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="province" className="text-right">Provinsi</Label>
                  <Input id="province" value={addressProvince} onChange={(e) => setAddressProvince(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="postalCode" className="text-right">Kode Pos</Label>
                  <Input id="postalCode" value={addressPostalCode} onChange={(e) => setAddressPostalCode(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="country" className="text-right">Negara</Label>
                  <Input id="country" value={addressCountry} onChange={(e) => setAddressCountry(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Default?</Label>
                  <Select value={addressIsDefault} onValueChange={setAddressIsDefault}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Pilih status default" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Tidak</SelectItem>
                      <SelectItem value="true">Ya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {submitAddressError && (
                  <div className="text-destructive text-sm">{submitAddressError}</div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddressDialogOpen(false)}>Batal</Button>
                <Button onClick={handleSubmitAddress} disabled={submittingAddress || !addressLine1}> {submittingAddress ? "Menyimpan…" : "Simpan"} </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Dialog Tambah Telepon */}
          <Dialog open={phoneDialogOpen} onOpenChange={setPhoneDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Tambah Telepon</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phoneLabel" className="text-right">Label</Label>
                  <Input id="phoneLabel" value={phoneLabel} onChange={(e) => setPhoneLabel(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="countryCode" className="text-right">Kode Negara</Label>
                  <Input id="countryCode" value={phoneCountryCode} onChange={(e) => setPhoneCountryCode(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phoneNumber" className="text-right">Nomor</Label>
                  <Input id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Default?</Label>
                  <Select value={phoneIsDefault} onValueChange={setPhoneIsDefault}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Pilih status default" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Tidak</SelectItem>
                      <SelectItem value="true">Ya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {submitPhoneError && (
                  <div className="text-destructive text-sm">{submitPhoneError}</div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPhoneDialogOpen(false)}>Batal</Button>
                <Button onClick={handleSubmitPhone} disabled={submittingPhone || !phoneNumber}> {submittingPhone ? "Menyimpan…" : "Simpan"} </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <IconShieldLock className="h-4 w-4" />
                <CardTitle>Sesi Aktif</CardTitle>
              </div>
              <CardDescription>Manajemen sesi pengguna</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {!sessError ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jumlah Sesi</span>
                    <span>{sessLoading ? "Memuat…" : sessions.length}</span>
                  </div>
                  {!sessLoading && (
                    sessions.length > 0 ? (
                      <div className="mt-3 space-y-2">
                        {sessions.map((s: any, idx: number) => {
                          const isExpired = s?.expiresAt ? (new Date(s.expiresAt).getTime() < Date.now()) : false
                          return (
                            <div key={s?.id || idx} className="space-y-1 rounded border p-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Sesi #{idx + 1}</span>
                                <Badge variant={isExpired ? "destructive" : "default"}>
                                  {isExpired ? "Kedaluwarsa" : "Aktif"}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">ID</span>
                                  <span className="font-mono truncate max-w-[60%] text-right">{s?.id || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">IP</span>
                                  <span className="truncate max-w-[60%] text-right">{s?.ipAddress || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">User Agent</span>
                                  <span className="truncate max-w-[60%] text-right">{s?.userAgent || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Dibuat</span>
                                  <span className="text-right">{s?.createdAt ? new Date(s.createdAt).toLocaleString() : "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Berakhir</span>
                                  <span className="text-right">{s?.expiresAt ? new Date(s.expiresAt).toLocaleString() : "-"}</span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-muted-foreground">Tidak ada sesi</div>
                    )
                  )}
                </>
              ) : (
                <div className="text-destructive">
                  Gagal memuat sesi
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Data akun tidak ditemukan</CardTitle>
            <CardDescription>Pastikan Anda sudah login</CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}

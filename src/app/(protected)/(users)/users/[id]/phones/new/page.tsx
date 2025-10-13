"use client";

import { useState } from "react";
import { getAuthToken } from "@/lib/auth";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shadcn/ui/card";
import { Button } from "@/components/shadcn/ui/button";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { Checkbox } from "@/components/shadcn/ui/checkbox";

type PhoneFormData = {
  label: string;
  phoneNumber: string;
  countryCode?: string;
  isDefault?: boolean;
  isActive?: boolean;
};

export default function NewUserPhonePage() {
  const router = useRouter();
  const params = useParams();
  const userId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [form, setForm] = useState<PhoneFormData>({
    label: "",
    phoneNumber: "",
    countryCode: "+62",
    isDefault: false,
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onChange<K extends keyof PhoneFormData>(key: K, value: PhoneFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSubmitting(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? (getAuthToken() || localStorage.getItem("auth_token") || localStorage.getItem("token")) : null;
      const res = await fetch(`/api/v2/users/${userId}/phones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          label: form.label,
          phoneNumber: form.phoneNumber,
          countryCode: form.countryCode,
          isDefault: !!form.isDefault,
          isActive: !!form.isActive,
        }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Gagal membuat nomor telepon: ${res.status}`);
      }
      // Redirect kembali ke daftar nomor telepon
      router.push(`/users/${userId}/phones`);
    } catch (err: any) {
      setError(err?.message ?? "Terjadi kesalahan saat membuat nomor telepon");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Tambah Nomor Telepon</h1>
          <p className="text-sm text-muted-foreground">User ID: {userId}</p>
        </div>
        <Button variant="ghost" onClick={() => router.push(`/users/${userId}/phones`)}>
          Kembali
        </Button>
      </div>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700 text-sm">{error}</div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Form Nomor Telepon</CardTitle>
          <CardDescription>Isi detail nomor telepon pengguna</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Label</Label>
              <Input
                placeholder="Contoh: Kantor, Pribadi"
                value={form.label}
                onChange={(e) => onChange("label", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Nomor Telepon</Label>
              <Input
                placeholder="0812xxxxxxxx"
                value={form.phoneNumber}
                onChange={(e) => onChange("phoneNumber", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Kode Negara</Label>
              <Input
                placeholder="+62"
                value={form.countryCode || ""}
                onChange={(e) => onChange("countryCode", e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="isDefault"
                checked={!!form.isDefault}
                onCheckedChange={(checked) => onChange("isDefault", !!checked)}
              />
              <Label htmlFor="isDefault" className="text-sm text-muted-foreground">Jadikan Default</Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={!!form.isActive}
                onCheckedChange={(checked) => onChange("isActive", !!checked)}
              />
              <Label htmlFor="isActive" className="text-sm text-muted-foreground">Aktif</Label>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Menyimpan…" : "Simpan"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push(`/users/${userId}/phones`)}>
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
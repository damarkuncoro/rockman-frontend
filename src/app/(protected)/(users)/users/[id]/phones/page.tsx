"use client";

import { useEffect, useState } from "react";
import { getAuthToken } from "@/lib/auth";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shadcn/ui/card";
import { Button } from "@/components/shadcn/ui/button";

type UserPhone = {
  id: string;
  userId: string;
  label: string;
  phoneNumber: string;
  countryCode?: string;
  isDefault?: boolean;
  isActive?: boolean;
  isVerified?: boolean;
  verifiedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export default function UserPhonesPage() {
  const router = useRouter();
  const params = useParams();
  const userId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [phones, setPhones] = useState<UserPhone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPhones() {
      if (!userId) return;
      try {
        setLoading(true);
        setError(null);
        const token = typeof window !== "undefined" ? (getAuthToken() || localStorage.getItem("auth_token") || localStorage.getItem("token")) : null;
        const res = await fetch(`/api/v2/users/${userId}/phones`, {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || `Gagal memuat nomor telepon: ${res.status}`);
        }
        const data = await res.json();
        const list: UserPhone[] = data?.data || [];
        setPhones(Array.isArray(list) ? list : []);
      } catch (err: any) {
        setError(err?.message ?? "Terjadi kesalahan saat memuat nomor telepon");
      } finally {
        setLoading(false);
      }
    }
    fetchPhones();
  }, [userId]);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Nomor Telepon Pengguna</h1>
          <p className="text-sm text-muted-foreground">User ID: {userId}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push(`/users/${userId}/phones/new`)}>
            Tambah Nomor Telepon
          </Button>
        </div>
      </div>

      {loading && (
        <div className="rounded border p-4 text-sm text-muted-foreground">Memuat data nomor telepon…</div>
      )}

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Daftar Nomor Telepon</CardTitle>
            <CardDescription>Nomor telepon yang terhubung dengan pengguna ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border px-3 py-2 text-left">ID</th>
                    <th className="border px-3 py-2 text-left">Label</th>
                    <th className="border px-3 py-2 text-left">Nomor</th>
                    <th className="border px-3 py-2 text-left">Kode Negara</th>
                    <th className="border px-3 py-2 text-left">Default</th>
                    <th className="border px-3 py-2 text-left">Aktif</th>
                    <th className="border px-3 py-2 text-left">Verifikasi</th>
                    <th className="border px-3 py-2 text-left">Terverifikasi Pada</th>
                    <th className="border px-3 py-2 text-left">Dibuat</th>
                    <th className="border px-3 py-2 text-left">Diperbarui</th>
                  </tr>
                </thead>
                <tbody>
                  {phones.length === 0 ? (
                    <tr>
                      <td className="px-3 py-4 text-center" colSpan={10}>
                        Tidak ada nomor telepon.
                      </td>
                    </tr>
                  ) : (
                    phones.map((p) => (
                      <tr key={p.id}>
                        <td className="border px-3 py-2 font-mono text-xs">{p.id}</td>
                        <td className="border px-3 py-2 text-sm font-medium">{p.label}</td>
                        <td className="border px-3 py-2 text-sm font-medium">{p.phoneNumber}</td>
                        <td className="border px-3 py-2">{p.countryCode ?? "-"}</td>
                        <td className="border px-3 py-2">{p.isDefault ? "Ya" : "Tidak"}</td>
                        <td className="border px-3 py-2">{p.isActive ? "Ya" : "Tidak"}</td>
                        <td className="border px-3 py-2">{p.isVerified ? "Ya" : "Tidak"}</td>
                        <td className="border px-3 py-2">{p.verifiedAt ?? "-"}</td>
                        <td className="border px-3 py-2">{p.createdAt ?? "-"}</td>
                        <td className="border px-3 py-2">{p.updatedAt ?? "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/shadcn/ui/badge";
import useUserAddresses from "@/hooks/users/useUserAddresses";

export default function UserAddressesListPage() {
  const params = useParams<{ id: string }>();
  const userId = params?.id as string;
  const { addresses, loading, error } = useUserAddresses(userId);

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Alamat Pengguna</h1>
        <p className="text-sm text-muted-foreground">User ID: {userId || "-"}</p>
      </div>

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      {loading ? (
        <div className="text-sm text-muted-foreground">Memuat data...</div>
      ) : addresses.length === 0 ? (
        <div className="text-sm text-muted-foreground">Belum ada alamat untuk user ini.</div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div key={addr.id} className="border rounded-md p-4 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{addr.address}</span>
                  {addr.isDefault && <Badge variant="secondary">Default</Badge>}
                  {addr.isActive ? (
                    <Badge variant="default">Aktif</Badge>
                  ) : (
                    <Badge variant="destructive">Tidak Aktif</Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {[addr.city, addr.province, addr.postalCode].filter(Boolean).join(", ")}
                </div>
                {addr.notes && (
                  <div className="text-sm">Catatan: {addr.notes}</div>
                )}
                <div className="text-xs text-muted-foreground">
                  {addr.createdAt ? `Dibuat: ${new Date(addr.createdAt).toLocaleString()}` : null}
                  {addr.updatedAt ? ` | Diperbarui: ${new Date(addr.updatedAt).toLocaleString()}` : null}
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/addresses/${addr.id}`} className="inline-flex items-center border rounded px-3 py-1 text-sm">
                  Detail
                </Link>
                <Link href={`/addresses/${addr.id}/edit`} className="inline-flex items-center bg-primary text-primary-foreground rounded px-3 py-1 text-sm">
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <Link href="/" className="text-sm text-muted-foreground hover:underline">Kembali</Link>
      </div>
    </div>
  );
}
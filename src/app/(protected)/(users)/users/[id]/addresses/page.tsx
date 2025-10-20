"use client";

import * as React from "react";
import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/shadcn/ui/badge";
import { DashboardPage } from "@/components/layouts/DashboardPage";
import { DataTable, type ColumnDef, type RowAction } from "@/components/generic/DataTable";
import { Button } from "@/components/shadcn/ui/button";
import useUserAddresses, { type UserAddress } from "@/hooks/users/useUserAddresses";

export default function UserAddressesListPage() {
  const params = useParams<{ id: string }>();
  const userId = params?.id as string;
  const router = useRouter();

  const { addresses, loading, error } = useUserAddresses(userId);

  const columns: ColumnDef<UserAddress>[] = [
    {
      id: "address",
      header: "Alamat",
      accessorKey: "address",
      sortable: true,
      cell: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{row.address}</span>
            {row.isDefault && <Badge variant="secondary">Default</Badge>}
            {row.isActive ? (
              <Badge variant="default">Aktif</Badge>
            ) : (
              <Badge variant="destructive">Tidak Aktif</Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {[row.city, row.province, row.postalCode].filter(Boolean).join(", ")}
          </div>
        </div>
      ),
    },
    {
      id: "city",
      header: "Kota",
      accessorKey: "city",
      sortable: true,
      className: "w-[12rem]",
    },
    {
      id: "province",
      header: "Provinsi",
      accessorKey: "province",
      sortable: true,
      className: "w-[12rem]",
    },
    {
      id: "postalCode",
      header: "Kode Pos",
      accessorKey: "postalCode",
      sortable: true,
      className: "w-[8rem]",
    },
    {
      id: "notes",
      header: "Catatan",
      accessorKey: "notes",
      sortable: false,
      cell: (row) => (
        <span className="text-sm text-muted-foreground line-clamp-2">
          {row.notes || "-"}
        </span>
      ),
    },
    {
      id: "updatedAt",
      header: "Diperbarui",
      accessorKey: "updatedAt",
      sortable: true,
      sortValue: (row) => (row.updatedAt ? new Date(row.updatedAt) : row.createdAt ? new Date(row.createdAt) : null),
      cell: (row) => {
        const updated = row.updatedAt || row.createdAt;
        return updated ? new Date(updated).toLocaleString() : "-";
      },
      className: "w-[12rem]",
    },
  ];

  const actions: RowAction<UserAddress>[] = [
    {
      id: "detail",
      label: "Detail",
      variant: "outline",
      onClick: (row) => router.push(`/addresses/${row.id}`),
    },
    {
      id: "edit",
      label: "Edit",
      onClick: (row) => router.push(`/addresses/${row.id}/edit`),
    },
  ];

  const filters = [
    {
      id: "search",
      type: "search" as const,
      label: "Pencarian",
      placeholder: "Cari alamat, kota, provinsi, kode pos",
      accessorKeys: ["address", "city", "province", "postalCode", "notes"],
    },
    {
      id: "status",
      type: "select" as const,
      label: "Status",
      options: [
        { label: "Semua", value: "all" },
        { label: "Aktif", value: "true" },
        { label: "Tidak Aktif", value: "false" },
      ],
      accessorKeys: ["isActive"],
      value: "all",
    },
    {
      id: "default",
      type: "select" as const,
      label: "Default",
      options: [
        { label: "Semua", value: "all" },
        { label: "Ya", value: "true" },
        { label: "Tidak", value: "false" },
      ],
      accessorKeys: ["isDefault"],
      value: "all",
    },
  ];

  const stats = useMemo(() => {
    const total = addresses.length;
    const active = addresses.filter((a) => a.isActive).length;
    const defaults = addresses.filter((a) => a.isDefault).length;
    const lastUpdated = addresses
      .map((a) => a.updatedAt || a.createdAt)
      .filter(Boolean)
      .map((d) => new Date(d as string).getTime())
      .sort((a, b) => b - a)[0];
    return [
      { label: "Total Alamat", value: total },
      { label: "Aktif", value: active },
      { label: "Default", value: defaults },
      { label: "Terakhir Diubah", value: lastUpdated ? new Date(lastUpdated).toLocaleString() : "-" },
    ];
  }, [addresses]);

  return (
    <DashboardPage
      title="Alamat Pengguna"
      description={`User ID: ${userId || "-"}`}
      stats={stats}
      contentCard={false}
      actions={<Button onClick={() => router.push(`/users/${userId}/addresses/new`)}>Tambah Alamat</Button>}
    >
      <DataTable<UserAddress>
        data={addresses}
        columns={columns}
        actions={actions}
        loading={loading}
        error={error || undefined}
        emptyMessage="Belum ada alamat untuk user ini."
        defaultPageSize={10}
        pageSizeOptions={[10, 25, 50]}
        filters={filters}
        className=""
      />
    </DashboardPage>
  );
}
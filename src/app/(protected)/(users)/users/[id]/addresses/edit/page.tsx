"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { DashboardPage } from "@/components/layouts/DashboardPage";
import { Button } from "@/components/shadcn/ui/button";
import { GenericForm, type FieldDef } from "@/components/generic/GenericForm";
import { useFetch } from "@/lib/useFetch";

// Minimal type to map initial values from v2 address schema
type Address = {
  id: string;
  userId: string;
  label?: string | null;
  recipientName?: string | null;
  phoneNumber?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  country?: string | null;
  isDefault?: boolean | null;
};

export default function EditUserAddressPage() {
  const params = useParams<{ id: string; addressId?: string }>();
  const searchParams = useSearchParams();
  const userId = params?.id as string;
  const addressIdFromParams = params?.addressId as string | undefined;
  const addressIdFromQuery = searchParams.get("addressId") || undefined;
  const addressId = addressIdFromParams || addressIdFromQuery || undefined;
  const router = useRouter();

  const fields: FieldDef[] = [
    // Hidden field to include id/addressId in payload for PUT endpoint
    { id: "id", label: "ID", type: "text", hidden: true, defaultValue: addressId },
    { id: "label", label: "Label Alamat", type: "text", required: true },
    { id: "recipientName", label: "Nama Penerima", type: "text", required: true },
    {
      id: "phoneNumber",
      label: "Nomor Telepon",
      type: "text",
      required: true,
      helpText: "Contoh: 081234567890",
      validate: (v) => {
        const s = String(v || "").replace(/\D/g, "");
        if (s.length === 0) return "Wajib diisi";
        if (s.length < 10 || s.length > 20) return "Nomor telepon 10-20 digit";
        return null;
      },
    },
    { id: "addressLine1", label: "Alamat", type: "textarea", required: true, helpText: "Detail alamat lengkap" },
    { id: "addressLine2", label: "Alamat Tambahan", type: "textarea" },
    { id: "city", label: "Kota", type: "text", required: true },
    { id: "province", label: "Provinsi", type: "text", required: true },
    {
      id: "postalCode",
      label: "Kode Pos",
      type: "text",
      required: true,
      validate: (v) => {
        const s = String(v || "");
        if (!/^[0-9]+$/.test(s)) return "Hanya angka";
        if (s.length < 5 || s.length > 10) return "Panjang 5-10 digit";
        return null;
      },
    },
    { id: "country", label: "Negara", type: "text", defaultValue: "Indonesia" },
    { id: "isDefault", label: "Set sebagai alamat utama", type: "checkbox", defaultValue: false },
  ];

  // Fetch initial address data by ID (if provided)
  const { data, loading, error } = useFetch<{ message: string; data: Address }>(
    addressId ? `/api/v2/addresses/${addressId}` : "",
    { immediate: !!addressId, useCache: true, cacheMaxAge: 300000 }
  );

  const address = data?.data;
  const initialValues = address
    ? {
        id: addressId,
        label: address.label || "",
        recipientName: address.recipientName || "",
        phoneNumber: address.phoneNumber || "",
        addressLine1: address.addressLine1 || "",
        addressLine2: address.addressLine2 || "",
        city: address.city || "",
        province: address.province || "",
        postalCode: address.postalCode || "",
        country: address.country || "Indonesia",
        isDefault: !!address.isDefault,
      }
    : undefined;

  return (
    <DashboardPage
      title="Edit Alamat"
      description={`User ID: ${userId || "-"} | Address ID: ${addressId || "-"}`}
      actions={
        <Button variant="outline" onClick={() => router.push(`/users/${userId}/addresses`)}>
          Kembali
        </Button>
      }
    >
      {/* Optional error notice */}
      {error && (
        <div className="mb-4 text-sm text-destructive">{error.message}</div>
      )}

      <GenericForm
        fields={fields}
        initialValues={initialValues}
        endpoint={`/api/v2/users/${userId}/addresses`}
        method="PUT"
        submitLabel="Simpan Perubahan"
        cancelLabel="Batal"
        onCancel={() => router.push(`/users/${userId}/addresses`)}
        onSuccess={() => router.push(`/users/${userId}/addresses`)}
        disabled={!addressId || loading}
      />
    </DashboardPage>
  );
}
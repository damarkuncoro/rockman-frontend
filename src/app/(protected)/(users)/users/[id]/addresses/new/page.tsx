"use client";

import { useParams, useRouter } from "next/navigation";
import { DashboardPage } from "@/components/layouts/DashboardPage";
import { Button } from "@/components/shadcn/ui/button";
import { GenericForm, type FieldDef } from "@/components/generic/GenericForm";

export default function NewUserAddressPage() {
  const params = useParams<{ id: string }>();
  const userId = params?.id as string;
  const router = useRouter();

  const fields: FieldDef[] = [
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

  return (
    <DashboardPage
      title="Tambah Alamat"
      description={`User ID: ${userId || "-"}`}
      actions={
        <Button variant="outline" onClick={() => router.push(`/users/${userId}/addresses`)}>
          Kembali
        </Button>
      }
    >
      <GenericForm
        fields={fields}
        endpoint={`/api/v2/users/${userId}/addresses`}
        method="POST"
        submitLabel="Simpan Alamat"
        cancelLabel="Batal"
        onCancel={() => router.push(`/users/${userId}/addresses`)}
        onSuccess={() => router.push(`/users/${userId}/addresses`)}
      />
    </DashboardPage>
  );
}
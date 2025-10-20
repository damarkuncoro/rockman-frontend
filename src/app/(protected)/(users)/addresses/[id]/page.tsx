"use client";

import { useParams, useRouter } from "next/navigation";
import { DashboardPage } from "@/components/layouts/DashboardPage";
import { Button } from "@/components/shadcn/ui/button";
import { GenericShow, type ShowFieldDef } from "@/components/generic/GenericShow";

export default function AddressDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const addressId = params?.id as string;

  const fields: ShowFieldDef[] = [
    { id: "id", label: "ID", type: "text" },
    { id: "userId", label: "User ID", type: "text" },
    { id: "label", label: "Label Alamat", type: "text" },
    { id: "recipientName", label: "Nama Penerima", type: "text" },
    { id: "phoneNumber", label: "Nomor Telepon", type: "text" },
    { id: "addressLine1", label: "Alamat", type: "textarea" },
    { id: "addressLine2", label: "Alamat Tambahan", type: "textarea" },
    { id: "city", label: "Kota", type: "text" },
    { id: "province", label: "Provinsi", type: "text" },
    { id: "postalCode", label: "Kode Pos", type: "text" },
    { id: "country", label: "Negara", type: "text" },
    { id: "isDefault", label: "Default", type: "boolean" },
    { id: "isActive", label: "Aktif", type: "boolean" },
    { id: "createdAt", label: "Dibuat", type: "date" },
    { id: "updatedAt", label: "Diubah", type: "date" },
  ];

  const actions = (
    <>
      <Button onClick={() => router.push(`/addresses/${addressId}/edit`)}>Edit</Button>
    </>
  );

  return (
    <DashboardPage
      title="Detail Alamat"
      description={`Address ID: ${addressId || "-"}`}
      actions={<Button variant="outline" onClick={() => router.back()}>Kembali</Button>}
    >
      <GenericShow
        title="Informasi Alamat"
        description="Tampilan detail alamat pengguna"
        fields={fields}
        endpoint={`/api/v2/addresses/${addressId}`}
        actions={actions}
      />
    </DashboardPage>
  );
}
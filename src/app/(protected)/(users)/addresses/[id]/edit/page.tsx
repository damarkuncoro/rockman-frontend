"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shadcn/ui/card";
import GenericEditForm from "@/components/generic/GenericEditForm";
import { FieldDef } from "@/components/generic/GenericForm";

export default function EditAddressPage() {
  const router = useRouter();
  const params = useParams();
  const addressId = params.id as string;

  const fields: FieldDef[] = [
    { id: "label", label: "Label", type: "text", placeholder: "Rumah / Kantor", required: true },
    { id: "recipientName", label: "Nama Penerima", type: "text", required: true },
    { id: "phoneNumber", label: "Nomor Telepon", type: "text", required: true },
    { id: "addressLine1", label: "Alamat", type: "textarea", required: true },
    { id: "addressLine2", label: "Alamat (Baris 2)", type: "textarea" },
    { id: "city", label: "Kota", type: "text", required: true },
    { id: "province", label: "Provinsi", type: "text", required: true },
    { id: "postalCode", label: "Kode Pos", type: "text", required: true },
    { id: "country", label: "Negara", type: "text", defaultValue: "Indonesia" },
    { id: "isDefault", label: "Default", type: "checkbox" },
  ];

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Alamat</CardTitle>
        </CardHeader>
        <CardContent>
          <GenericEditForm
            fields={fields}
            getEndpoint={`/api/v2/addresses/${addressId}`}
            resolveUpdateEndpoint={(initial) => `/api/v2/users/${initial.userId}/addresses`}
            method="PUT"
            includeIdHidden
            idField="id"
            contentCard={false}
            submitLabel="Simpan"
            cancelLabel="Batal"
            onCancel={() => router.back()}
            onSuccess={() => router.push(`/addresses/${addressId}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
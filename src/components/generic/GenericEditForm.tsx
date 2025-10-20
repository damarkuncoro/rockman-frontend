"use client";

import * as React from "react";
import { useMemo } from "react";
import { GenericForm, FieldDef, FieldType } from "./GenericForm";
import { useFetch } from "@/lib/useFetch";
import { Skeleton } from "@/components/shadcn/ui/skeleton";

export type GenericEditFormProps = {
  // Fields definition for the form
  fields: FieldDef[];
  // Endpoint to GET the existing entity data
  getEndpoint: string;
  // Static endpoint to update entity OR resolve dynamically based on fetched data
  updateEndpoint?: string;
  resolveUpdateEndpoint?: (initialValues: Record<string, any>) => string;
  method?: "PUT" | "PATCH";
  // Optional transform/select function to map API payload -> initialValues
  select?: (payload: any) => Record<string, any>;
  // Auto inject hidden id field
  includeIdHidden?: boolean;
  idField?: string; // default: "id"
  // Labels and callbacks
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  onSuccess?: (result: any, initialValues?: Record<string, any>) => void;
  onError?: (error: Error) => void;
  // Styling
  contentCard?: boolean;
  className?: string;
};

function injectHiddenIdField(fields: FieldDef[], idField: string, initialValues?: Record<string, any>): FieldDef[] {
  const hasIdInFields = fields.some((f) => f.id === idField);
  const idValue = initialValues?.[idField];
  if (!idValue) return fields;
  if (hasIdInFields) {
    return fields.map((f) => (f.id === idField ? { ...f, hidden: true, defaultValue: idValue } : f));
  }
  const hiddenIdField: FieldDef = { id: idField, label: "ID", type: "text" as FieldType, hidden: true, defaultValue: idValue };
  return [hiddenIdField, ...fields];
}

export default function GenericEditForm({
  fields,
  getEndpoint,
  updateEndpoint,
  resolveUpdateEndpoint,
  method = "PUT",
  select,
  includeIdHidden = true,
  idField = "id",
  submitLabel,
  cancelLabel,
  onCancel,
  onSuccess,
  onError,
  contentCard = true,
  className,
}: GenericEditFormProps) {
  const { data, error, loading } = useFetch<any>(getEndpoint, { useCache: true, cacheMaxAge: 5 * 60 * 1000 });

  const initialValues = useMemo(() => {
    const payload = data?.data ?? data; // support {data: {...}} or flat payload
    return select ? select(payload) : (payload ?? undefined);
  }, [data, select]);

  const effectiveEndpoint = useMemo(() => {
    if (updateEndpoint) return updateEndpoint;
    if (resolveUpdateEndpoint && initialValues) return resolveUpdateEndpoint(initialValues);
    return undefined;
  }, [updateEndpoint, resolveUpdateEndpoint, initialValues]);

  const finalFields: FieldDef[] = useMemo(() => {
    if (!includeIdHidden) return fields;
    return injectHiddenIdField(fields, idField, initialValues);
  }, [fields, includeIdHidden, idField, initialValues]);

  // Loading skeleton mirrors a typical form layout
  if (loading && !initialValues) {
    return (
      <div className={className}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: Math.max(finalFields.length, 6) }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    );
  }

  // Show fetch error before the form for better visibility
  const fetchErrorMessage = error ? (error instanceof Error ? error.message : String(error)) : undefined;

  return (
    <div className={className}>
      {fetchErrorMessage && (
        <div className="mb-3 text-sm text-destructive">{fetchErrorMessage}</div>
      )}
      <GenericForm
        fields={finalFields}
        initialValues={initialValues}
        endpoint={effectiveEndpoint}
        method={method}
        submitLabel={submitLabel ?? (method === "PUT" ? "Simpan Perubahan" : "Perbarui")}
        cancelLabel={cancelLabel}
        onCancel={onCancel}
        onSuccess={(result) => onSuccess?.(result, initialValues)}
        onError={onError}
        contentCard={contentCard}
        disabled={loading || !effectiveEndpoint}
      />
    </div>
  );
}
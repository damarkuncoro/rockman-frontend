"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useMutation } from "@/lib/useMutation";
import { Card, CardContent } from "@/components/shadcn/ui/card";
import { Button } from "@/components/shadcn/ui/button";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { Textarea } from "@/components/shadcn/ui/textarea";
import { Checkbox } from "@/components/shadcn/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/ui/select";

export type GenericOption = { label: string; value: string };
export type FieldType = "text" | "textarea" | "number" | "select" | "checkbox" | "date";

export type FieldDef = {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  options?: GenericOption[]; // for select
  defaultValue?: any;
  disabled?: boolean;
  hidden?: boolean;
  validate?: (value: any, values: Record<string, any>) => string | null; // return error message or null
};

export type GenericFormProps = {
  fields: FieldDef[];
  initialValues?: Record<string, any>;
  // If provided, component will submit using this endpoint/method via useMutation
  endpoint?: string;
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
  // Custom submit callback; used when endpoint is not provided
  onSubmit?: (values: Record<string, any>) => Promise<any> | any;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  className?: string;
  contentCard?: boolean;
  disabled?: boolean;
};

function normalizeInitialValues(fields: FieldDef[], initial?: Record<string, any>) {
  const base: Record<string, any> = {};
  for (const f of fields) {
    base[f.id] = initial && f.id in initial ? initial[f.id] : f.defaultValue ?? (f.type === "checkbox" ? false : "");
  }
  return base;
}

export function GenericForm({
  fields,
  initialValues,
  endpoint,
  method = "POST",
  onSubmit,
  onSuccess,
  onError,
  submitLabel = "Simpan",
  cancelLabel = "Batal",
  onCancel,
  className,
  contentCard = true,
  disabled,
}: GenericFormProps) {
  const [values, setValues] = useState<Record<string, any>>(() => normalizeInitialValues(fields, initialValues));
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const activeFields = useMemo(() => fields.filter((f) => !f.hidden), [fields]);

  const mutation = endpoint ? useMutation<any, Record<string, any>>(endpoint, method) : null;
  const busy = submitting || Boolean(mutation?.loading) || Boolean(disabled);

  const validateAll = (current: Record<string, any>) => {
    const nextErrors: Record<string, string | null> = {};
    for (const f of fields) {
      const val = current[f.id];
      if (f.required && (val == null || val === "" || (f.type === "checkbox" && val === false))) {
        nextErrors[f.id] = "Wajib diisi";
        continue;
      }
      if (f.validate) {
        try {
          const msg = f.validate(val, current);
          nextErrors[f.id] = msg || null;
        } catch (e) {
          nextErrors[f.id] = "Validasi gagal";
        }
      } else {
        nextErrors[f.id] = null;
      }
    }
    setErrors(nextErrors);
    return nextErrors;
  };

  const hasErrors = (map: Record<string, string | null>) => Object.values(map).some((v) => typeof v === "string" && v.length > 0);

  const handleChange = (id: string, val: any) => {
    setValues((prev) => ({ ...prev, [id]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const nextErrors = validateAll(values);
    if (hasErrors(nextErrors)) return;

    try {
      setSubmitting(true);
      if (mutation) {
        const result = await mutation.mutate(values);
        onSuccess?.(result);
      } else if (onSubmit) {
        const result = await onSubmit(values);
        onSuccess?.(result);
      }
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(String(err));
      setFormError(error.message || "Terjadi kesalahan saat menyimpan");
      onError?.(error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (f: FieldDef) => {
    const commonDisabled = busy || f.disabled;
    const val = values[f.id];
    const err = errors[f.id];

    switch (f.type) {
      case "text":
        return (
          <div className="space-y-2">
            <Label htmlFor={f.id}>{f.label}</Label>
            <Input
              id={f.id}
              value={val ?? ""}
              onChange={(e) => handleChange(f.id, e.target.value)}
              placeholder={f.placeholder}
              disabled={commonDisabled}
            />
            {f.helpText && <p className="text-xs text-muted-foreground">{f.helpText}</p>}
            {err && <p className="text-xs text-destructive">{err}</p>}
          </div>
        );
      case "number":
        return (
          <div className="space-y-2">
            <Label htmlFor={f.id}>{f.label}</Label>
            <Input
              id={f.id}
              type="number"
              value={val ?? ""}
              onChange={(e) => handleChange(f.id, e.target.value === "" ? "" : Number(e.target.value))}
              placeholder={f.placeholder}
              disabled={commonDisabled}
            />
            {f.helpText && <p className="text-xs text-muted-foreground">{f.helpText}</p>}
            {err && <p className="text-xs text-destructive">{err}</p>}
          </div>
        );
      case "textarea":
        return (
          <div className="space-y-2">
            <Label htmlFor={f.id}>{f.label}</Label>
            <Textarea
              id={f.id}
              value={val ?? ""}
              onChange={(e) => handleChange(f.id, e.target.value)}
              placeholder={f.placeholder}
              disabled={commonDisabled}
            />
            {f.helpText && <p className="text-xs text-muted-foreground">{f.helpText}</p>}
            {err && <p className="text-xs text-destructive">{err}</p>}
          </div>
        );
      case "select":
        return (
          <div className="space-y-2">
            <Label htmlFor={f.id}>{f.label}</Label>
            <Select
              value={val ?? ""}
              onValueChange={(v) => handleChange(f.id, v)}
              disabled={commonDisabled}
            >
              <SelectTrigger id={f.id}>
                <SelectValue placeholder={f.placeholder || "Pilih opsi"} />
              </SelectTrigger>
              <SelectContent>
                {(f.options || []).map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {f.helpText && <p className="text-xs text-muted-foreground">{f.helpText}</p>}
            {err && <p className="text-xs text-destructive">{err}</p>}
          </div>
        );
      case "checkbox":
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              id={f.id}
              checked={Boolean(val)}
              onCheckedChange={(checked) => handleChange(f.id, Boolean(checked))}
              disabled={commonDisabled}
            />
            <Label htmlFor={f.id}>{f.label}</Label>
            {f.helpText && <p className="text-xs text-muted-foreground">{f.helpText}</p>}
            {err && <p className="text-xs text-destructive">{err}</p>}
          </div>
        );
      case "date":
        return (
          <div className="space-y-2">
            <Label htmlFor={f.id}>{f.label}</Label>
            <Input
              id={f.id}
              type="date"
              value={val ?? ""}
              onChange={(e) => handleChange(f.id, e.target.value)}
              placeholder={f.placeholder}
              disabled={commonDisabled}
            />
            {f.helpText && <p className="text-xs text-muted-foreground">{f.helpText}</p>}
            {err && <p className="text-xs text-destructive">{err}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  const content = (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeFields.map((f) => (
          <div key={f.id}>{renderField(f)}</div>
        ))}
      </div>

      {formError && (
        <div className="text-sm text-destructive">{formError}</div>
      )}

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={busy}>
          {busy ? "Menyimpan..." : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </Button>
        )}
      </div>
    </form>
  );

  return contentCard ? (
    <Card>
      <CardContent className="pt-6">{content}</CardContent>
    </Card>
  ) : (
    content
  );
}
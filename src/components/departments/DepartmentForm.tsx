"use client"

import * as React from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Department } from "@/hooks/api/v2/departments/all.hook.v2"

import { Button } from "@/components/shadcn/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn/ui/form"
import { Input } from "@/components/shadcn/ui/input"
import { Textarea } from "@/components/shadcn/ui/textarea"
import { Switch } from "@/components/shadcn/ui/switch"

// Schema validasi untuk form departemen
const departmentFormSchema = z.object({
  name: z.string().min(3, {
    message: "Nama departemen harus minimal 3 karakter",
  }),
  code: z.string().min(2, {
    message: "Kode departemen harus minimal 2 karakter",
  }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
})

// Pastikan tipe Department sesuai dengan schema
type DepartmentFormSchema = z.infer<typeof departmentFormSchema>

// Tipe data untuk form departemen
export type DepartmentFormValues = z.infer<typeof departmentFormSchema>

interface DepartmentFormProps {
  initialData?: Department
  onSubmit: (data: DepartmentFormValues) => void
  isLoading?: boolean
}

/**
 * Komponen form untuk membuat atau mengedit departemen
 */
export function DepartmentForm({
  initialData,
  onSubmit,
  isLoading = false,
}: DepartmentFormProps) {
  // Inisialisasi form dengan react-hook-form dan zod resolver
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      code: initialData?.code || "",
      description: initialData?.description || "",
      isActive: initialData?.isActive ?? true,
    },
  })

  // Handler untuk submit form
  const handleSubmit: SubmitHandler<DepartmentFormValues> = (data) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Departemen</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama departemen" {...field} />
              </FormControl>
              <FormDescription>
                Nama lengkap departemen yang akan ditampilkan
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kode Departemen</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan kode departemen" {...field} />
              </FormControl>
              <FormDescription>
                Kode singkat untuk identifikasi departemen
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Masukkan deskripsi departemen"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Deskripsi singkat tentang departemen (opsional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Status Aktif</FormLabel>
                <FormDescription>
                  Aktifkan atau nonaktifkan departemen
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : "Simpan Departemen"}
        </Button>
      </form>
    </Form>
  )
}
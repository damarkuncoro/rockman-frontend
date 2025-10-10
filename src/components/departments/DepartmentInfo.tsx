"use client"

import { IconBuilding, IconEdit, IconTrash, IconRestore, IconClipboard, IconEye, IconEyeOff } from "@tabler/icons-react"
import { Button } from "@/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/shadcn/ui/alert-dialog"
import { toast } from "sonner"
import { useUpdateDepartment } from "@/hooks/api/v2/departments/[id]/update.hook"
import { useDeleteDepartment } from "@/hooks/api/v2/departments/[id]/delete.hook"

interface DepartmentInfoProps {
  department: any
  onEdit: () => void
  onToggleActive?: (department: any) => void
  onDelete?: (department: any) => void
  onRestore?: (department: any) => void
}

/**
 * Komponen untuk menampilkan informasi detail departemen
 */
export function DepartmentInfo({ 
  department, 
  onEdit, 
  onToggleActive, 
  onDelete, 
  onRestore }: DepartmentInfoProps) {
  const isDeleted = Boolean(department?.deletedAt)
  const { updateDepartment } = useUpdateDepartment(department?.id ?? "")
  const { deleteDepartment } = useDeleteDepartment(department?.id ?? "")
  const formatDateTime = (value?: string | Date) => {
    if (!value) return "-"
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'short',
      timeStyle: 'medium',
      timeZone: 'UTC',
    }).format(new Date(value))
  }

  const copyToClipboard = async (value?: string | number) => {
    if (value === undefined || value === null) return
    try {
      await navigator.clipboard.writeText(String(value))
    } catch (e) {
      // noop: clipboard may be unavailable
    }
  }

  const handleToggleActive = async () => {
    if (typeof onToggleActive === 'function') {
      return onToggleActive(department)
    }
    if (!department?.id) return
    try {
      await updateDepartment({ isActive: !department.isActive })
      toast.success(department.isActive ? "Departemen dinonaktifkan" : "Departemen diaktifkan")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal mengubah status departemen"
      toast.error(msg)
    }
  }

  const handleDelete = async () => {
    if (typeof onDelete === 'function') {
      return onDelete(department)
    }
    if (!department?.id) return
    try {
      await deleteDepartment()
      toast.success("Departemen dihapus (soft delete)")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus departemen"
      toast.error(msg)
    }
  }

  const handleRestore = async () => {
    if (typeof onRestore === 'function') {
      return onRestore(department)
    }
    if (!department?.id) return
    try {
      await updateDepartment({ deletedAt: null })
      toast.success("Departemen dipulihkan")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal memulihkan departemen"
      toast.error(msg)
    }
  }

  return (
    <>
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBuilding className="h-5 w-5" style={{ color: department.color || '#888888' }} />
            <span>{department.name}</span>
          </CardTitle>
          <CardDescription>
            Kode: {department.code}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Deskripsi</h3>
            <p className="text-sm text-muted-foreground">
              {department.description || "Tidak ada deskripsi"}
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-1">Status</h3>
            <div className="text-sm text-muted-foreground">
              {`${department.isActive ? "Aktif" : "Tidak Aktif"}, ${isDeleted ? "Dihapus" : "Tidak Dihapus"}`}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 md:flex-row">

          <Button className="w-full md:w-auto" onClick={onEdit} disabled={isDeleted} aria-label="Edit departemen">
            <IconEdit className="mr-2 h-4 w-4" />
            Edit Departemen
          </Button>

        </CardFooter>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Informasi Tambahan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <dl className="text-sm grid grid-cols-1 gap-2">
            <div className="grid grid-cols-4 items-center">
              <dt className="col-span-1 text-muted-foreground">Slug</dt>
              <dd className="col-span-3 font-medium truncate">{department.slug || '-'}</dd>
            </div>
            <div className="grid grid-cols-4 items-center">
              <dt className="col-span-1 text-muted-foreground">Urutan</dt>
              <dd className="col-span-3 font-medium">{department.sortOrder ?? '-'}</dd>
            </div>
            <div className="grid grid-cols-4 items-center">
              <dt className="col-span-1 text-muted-foreground">Dibuat pada</dt>
              <dd className="col-span-3 font-medium flex items-center gap-2">
                <span>{formatDateTime(department.createdAt)}</span>
                <span className="text-xs text-muted-foreground">UTC</span>
              </dd>
            </div>
            <div className="grid grid-cols-4 items-center">
              <dt className="col-span-1 text-muted-foreground">Diperbarui pada</dt>
              <dd className="col-span-3 font-medium flex items-center gap-2">
                <span>{formatDateTime(department.updatedAt)}</span>
                <span className="text-xs text-muted-foreground">UTC</span>
              </dd>
            </div>
            {department.deletedAt ? (
              <div className="grid grid-cols-4 items-center">
                <dt className="col-span-1 text-muted-foreground">Dihapus pada</dt>
                <dd className="col-span-3 font-medium flex items-center gap-2">
                  <span>{formatDateTime(department.deletedAt)}</span>
                  <span className="text-xs text-muted-foreground">UTC</span>
                </dd>
              </div>
            ) : null}
            <div className="grid grid-cols-4 items-center">
              <dt className="col-span-1 text-muted-foreground">deletedAt</dt>
              <dd className="col-span-3 font-mono text-xs">
                {department.deletedAt ? new Date(department.deletedAt).toISOString() : "-"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Action</CardTitle>
          <CardDescription>Aksi cepat untuk departemen ini</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="w-full"
                variant="secondary"
                onClick={() => undefined}
                disabled={isDeleted}
                aria-label={department?.isActive ? 'Nonaktifkan departemen' : 'Aktifkan departemen'}
              >
                {department?.isActive ? (
                  <IconEyeOff className="mr-2 h-4 w-4" />
                ) : (
                  <IconEye className="mr-2 h-4 w-4" />
                )}
                {department?.isActive ? 'Nonaktifkan' : 'Aktifkan'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {department?.isActive ? 'Konfirmasi Nonaktifkan' : 'Konfirmasi Aktifkan'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {department?.isActive
                    ? 'Departemen akan dinonaktifkan. Anda dapat mengaktifkannya kembali nanti.'
                    : 'Departemen akan diaktifkan.'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleToggleActive}>
                  Ya, {department?.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {isDeleted ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="w-full"
                  onClick={() => undefined}
                  disabled={!department?.id}
                  aria-label="Pulihkan departemen"
                >
                  <IconRestore className="mr-2 h-4 w-4" />
                  Pulihkan Departemen
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Konfirmasi Pemulihan</AlertDialogTitle>
                  <AlertDialogDescription>
                    Anda akan memulihkan departemen ini. Tindakan ini akan mengembalikan departemen dari status dihapus.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRestore}>
                    Ya, Pulihkan
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="w-full"
                  variant="destructive"
                  onClick={() => undefined}
                  disabled={!department?.id}
                  aria-label="Hapus departemen"
                >
                  <IconTrash className="mr-2 h-4 w-4" />
                  Hapus Departemen
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini akan menghapus departemen (soft delete). Anda masih dapat memulihkannya nanti.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Ya, Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => copyToClipboard(department?.id)}
            disabled={!department?.id}
            aria-label="Salin ID departemen"
          >
            <IconClipboard className="mr-2 h-4 w-4" />
            Salin ID
          </Button>
          <Button
            variant="outline"
            onClick={() => copyToClipboard(department?.slug)}
            disabled={!department?.slug}
            aria-label="Salin slug departemen"
          >
            <IconClipboard className="mr-2 h-4 w-4" />
            Salin Slug
          </Button>
        </CardFooter>
      </Card>

    </>
  )
}
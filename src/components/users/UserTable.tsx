"use client"

import { User } from "@/hooks/api/v2/users/all.hook.v2"
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react"
import { Badge } from "@/components/shadcn/ui/badge"
import { Button } from "@/components/shadcn/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/ui/table"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/shadcn/ui/dropdown-menu"
import { Skeleton } from "@/components/shadcn/ui/skeleton"
import { Alert, AlertDescription } from "@/components/shadcn/ui/alert"

interface UserTableProps {
  users: User[]
  loading: boolean
  error: Error | null
  onView: (userId: string) => void
  onEdit: (userId: string) => void
  onDelete: (userId: string) => void
}

/**
 * Komponen untuk menampilkan tabel daftar users
 */
export function UserTable({ users, loading, error, onView, onEdit, onDelete }: UserTableProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array(5).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Terjadi kesalahan saat memuat data user. Silakan coba lagi nanti.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Level</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                Tidak ada data user yang ditemukan
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.active ? (
                    <Badge className="bg-green-500 hover:bg-green-600">Aktif</Badge>
                  ) : (
                    <Badge variant="destructive">Nonaktif</Badge>
                  )}
                </TableCell>
                <TableCell>{user.region || "-"}</TableCell>
                <TableCell>{user.level}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Aksi
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(user.id)}>
                        <IconEye className="mr-2 h-4 w-4" />
                        Lihat Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(user.id)}>
                        <IconEdit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(user.id)}
                        className="text-destructive"
                      >
                        <IconTrash className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
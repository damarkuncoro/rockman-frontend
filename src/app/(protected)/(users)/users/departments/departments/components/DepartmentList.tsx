import * as React from "react"
import { Department } from "@/hooks/api/v2/departments/all.hook.v2"
import { 
  IconBuilding, 
  IconUsers,
  IconEdit,
  IconTrash
} from "@tabler/icons-react"
import { Badge } from "@/components/shadcn/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/ui/table"
import { Button } from "@/components/shadcn/ui/button"

interface DepartmentListProps {
  departments: Department[]
  onViewDepartment: (id: string) => void
  onEditDepartment?: (id: string) => void
  onDeleteDepartment?: (id: string) => void
}

/**
 * Komponen untuk menampilkan daftar departemen dalam bentuk tabel
 */
export function DepartmentList({ 
  departments, 
  onViewDepartment,
  onEditDepartment,
  onDeleteDepartment
}: DepartmentListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama</TableHead>
          <TableHead>Kode</TableHead>
          <TableHead>Jumlah Anggota</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {departments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              Tidak ada departemen yang ditemukan
            </TableCell>
          </TableRow>
        ) : (
          departments.map((department) => (
            <TableRow key={department.id} onClick={() => onViewDepartment(department.id)} className="cursor-pointer">
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <IconBuilding className="mr-2 h-4 w-4 text-muted-foreground" />
                  {department.name}
                </div>
              </TableCell>
              <TableCell>{department.code}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <IconUsers className="mr-2 h-4 w-4 text-muted-foreground" />
                  {department.users?.length || 0}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={department.isActive ? "default" : "outline"}>
                  {department.isActive ? "Aktif" : "Tidak Aktif"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {onEditDepartment && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditDepartment(department.id);
                      }}
                    >
                      <IconEdit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDeleteDepartment && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDepartment(department.id);
                      }}
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
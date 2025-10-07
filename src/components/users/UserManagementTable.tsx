import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/ui/avatar";
import { Badge } from "@/components/shadcn/ui/badge";
import { Button } from "@/components/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu";
import { IconEye, IconEdit, IconTrash, IconUsers, IconFilter } from "@tabler/icons-react";

/**
 * Komponen untuk menampilkan nama departemen
 */
interface DepartmentNameProps {
  userId: string;
  departmentId: string | null;
  departments: any[];
}

const DepartmentName: React.FC<DepartmentNameProps> = ({ userId, departmentId, departments }) => {
  if (!departmentId) return <span>Tidak ada departemen</span>;
  
  const department = departments.find(dept => dept.id === departmentId);
  return <span>{department?.name || 'Departemen tidak ditemukan'}</span>;
};

/**
 * Komponen untuk menampilkan tabel pengguna
 */
interface UserManagementTableProps {
  paginatedUsers: any[];
  filteredUsers: any[];
  totalUsers: number;
  departments: any[];
  getInitials: (name: string) => string;
  handleViewUser: (user: any) => void;
  handleEditUser: (user: any) => void;
  handleDeleteConfirm: (user: any) => void;
  formatDate: (dateString: string) => string;
}

export const UserManagementTable: React.FC<UserManagementTableProps> = ({
  paginatedUsers,
  filteredUsers,
  totalUsers,
  departments,
  getInitials,
  handleViewUser,
  handleEditUser,
  handleDeleteConfirm,
  formatDate,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Pengguna</CardTitle>
        <CardDescription>
          Menampilkan {paginatedUsers.length} dari {filteredUsers.length} pengguna (Total: {totalUsers})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pengguna</TableHead>
                <TableHead>Departemen</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <IconUsers className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Tidak ada pengguna yang ditemukan
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleViewUser(user)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/avatars/${user.id}.jpg`} />
                          <AvatarFallback className="text-xs">
                            {getInitials(user.username)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.username}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        <DepartmentName 
                          userId={user.id} 
                          departmentId={user.departmentId || user.primaryDepartmentId || null} 
                          departments={departments}
                        />
                      </Badge>
                    </TableCell>
                    <TableCell>{user.region || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.level && user.level >= 8 ? "default" : "secondary"}
                      >
                        {user.level ? `Level ${user.level}` : "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.active ? "default" : "destructive"}
                        className={user.active ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                      >
                        {user.active ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild suppressHydrationWarning>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <IconFilter className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            handleViewUser(user)
                          }}>
                            <IconEye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            handleEditUser(user)
                          }}>
                            <IconEdit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteConfirm(user)
                            }}
                            className="text-red-600 focus:text-red-600"
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
      </CardContent>
    </Card>
  );
};
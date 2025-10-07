import { IconEye, IconEdit, IconTrash, IconFilter, IconUsers } from "@tabler/icons-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/ui/avatar";
import { Badge } from "@/components/shadcn/ui/badge";
import { Button } from "@/components/shadcn/ui/button";
import { User } from "../../user-management/types";
import { MouseEvent } from "react";

// Komponen untuk menampilkan nama departemen
export function DepartmentName({ userId, departmentId }: { userId: string; departmentId: string | null }) {
  if (!departmentId) return <span>Tidak Ada</span>;
  
  // Hardcoded departemen untuk demo
  const departments = {
    "dept-001": "IT",
    "dept-002": "HR",
    "dept-003": "Finance",
    "dept-004": "Marketing",
    "dept-005": "Operations",
  };
  
  return <span>{departments[departmentId as keyof typeof departments] || "Unknown"}</span>;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  goToFirstPage: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToLastPage: () => void;
}

/**
 * Komponen untuk menampilkan kontrol pagination
 */
export function UserManagementPagination({
  currentPage,
  totalPages,
  goToFirstPage,
  goToPreviousPage,
  goToNextPage,
  goToLastPage,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={goToFirstPage}
        disabled={currentPage === 1}
      >
        Pertama
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
      >
        Sebelumnya
      </Button>
      <div className="text-sm font-medium">
        Halaman {currentPage} dari {totalPages}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
      >
        Berikutnya
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={goToLastPage}
        disabled={currentPage === totalPages}
      >
        Terakhir
      </Button>
    </div>
  );
}

interface UserTableProps {
  paginatedUsers: User[];
  filteredUsers: User[];
  totalUsers: number;
  getInitials: (name: string) => string;
  formatDate: (date: string) => string;
  handleViewUser: (user: User) => void;
  handleEditUser: (user: User) => void;
  handleDeleteUser: (user: User) => void;
  currentPage: number;
  totalPages: number;
  goToFirstPage: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToLastPage: () => void;
}

/**
 * Komponen untuk menampilkan tabel pengguna dengan fitur pagination dan aksi
 */
export function UserTable({
  paginatedUsers,
  filteredUsers,
  totalUsers,
  getInitials,
  formatDate,
  handleViewUser,
  handleEditUser,
  handleDeleteUser,
  currentPage,
  totalPages,
  goToFirstPage,
  goToPreviousPage,
  goToNextPage,
  goToLastPage,
}: UserTableProps) {
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
                        <DepartmentName userId={user.id} departmentId={user.departmentId || user.primaryDepartmentId || null} />
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
                            onClick={(e: MouseEvent) => e.stopPropagation()}
                          >
                            <IconFilter className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e: MouseEvent) => {
                            e.stopPropagation()
                            handleViewUser(user)
                          }}>
                            <IconEye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e: MouseEvent) => {
                            e.stopPropagation()
                            handleEditUser(user)
                          }}>
                            <IconEdit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e: MouseEvent) => {
                              e.stopPropagation()
                              handleDeleteUser(user)
                            }}
                            className="text-red-600"
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

        {/* Pagination Controls */}
        {filteredUsers.length > 0 && (
          <UserManagementPagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToFirstPage={goToFirstPage}
            goToPreviousPage={goToPreviousPage}
            goToNextPage={goToNextPage}
            goToLastPage={goToLastPage}
          />
        )}
      </CardContent>
    </Card>
  );
}
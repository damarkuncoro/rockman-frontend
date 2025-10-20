import React from "react";
import { Button } from "@/components/shadcn/ui/button";
import { Badge } from "@/components/shadcn/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/ui/avatar";
import { IconEye, IconEdit, IconTrash, IconSettings } from "@tabler/icons-react";

import { DataTable, ColumnDef, TableFilter } from "@/components/generic/DataTable";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/shadcn/ui/dropdown-menu";
import {
  UserManagementStats
} from "@/components/users/UserManagementStats";


interface UserManagementTableProps {
  filteredUsers: any[];
  totalUsers: number;
  departments: any[];
  getInitials: (name: string) => string;
  handleViewUser: (user: any) => void;
  handleEditUser: (user: any) => void;
  handleDeleteConfirm: (user: any) => void;
  formatDate: (dateString: string) => string;
  // Stats
  stats: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    departments: number;
  };
  // Filter state yang sebelumnya berada di UserManagementFilters
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  levelFilter: string;
  setLevelFilter: (value: string) => void;
  uniqueDepartments: { id: string; name: string }[];
  uniqueLevels: any[];
}

export const UserManagementTable: React.FC<UserManagementTableProps> = ({
  filteredUsers,
  totalUsers,
  departments,
  getInitials,
  handleViewUser,
  handleEditUser,
  handleDeleteConfirm,
  formatDate,
  stats,
  searchTerm,
  setSearchTerm,
  departmentFilter,
  setDepartmentFilter,
  statusFilter,
  setStatusFilter,
  levelFilter,
  setLevelFilter,
  uniqueDepartments,
  uniqueLevels,
}) => {
  const columns: ColumnDef<any>[] = [
    {
      id: "pengguna",
      header: "Pengguna",
      sortable: false,
      cell: (user: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`/avatars/${user.id}.jpg`} />
            <AvatarFallback className="text-xs">{getInitials(user.username)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.username}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      id: "departemen",
      header: "Departemen",
      cell: (user: any) => (

        <Badge variant="outline">

          {user.primaryDepartment?.name || "N/A"}
        </Badge>
      ),
    },
    {
      id: "region",
      header: "Region",
      cell: (user: any) => user.region || "N/A"
    },
    {
      id: "level",
      header: "Level",
      cell: (user: any) => (
        <Badge variant={user.level && user.level >= 8 ? "default" : "secondary"}>
          {user.level ? `Level ${user.level}` : "N/A"}
        </Badge>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (user: any) => (
        <Badge
          variant={user.active ? "default" : "destructive"}
          className={user.active ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
        >
          {user.active ? "Aktif" : "Nonaktif"}
        </Badge>
      ),
    },
    {
      id: "createdAt",
      header: "Dibuat",
      cell: (user: any) => (
        <span className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</span>
      ),
      sortable: true,
      sortValue: (user: any) => new Date(user.createdAt).getTime(),
    },
    {
      id: "aksi",
      header: "",
      className: "text-right",
      cell: (user: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <IconSettings className="h-4 w-4" />
              <span className="sr-only">Pengaturan</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleViewUser(user)}>
              <IconEye className="mr-2 h-4 w-4" />
              Lihat Detail
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditUser(user)}>
              <IconEdit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteConfirm(user)} className="text-destructive">
              <IconTrash className="mr-2 h-4 w-4" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filters: TableFilter<any>[] = [
    {
      id: "search",
      type: "search",
      placeholder: "Cari nama, email, atau departemen...",
      accessorKeys: ["username", "email", "primaryDepartment.name"],
      value: searchTerm,
      onChange: setSearchTerm,
    },
    {
      id: "department",
      type: "select",
      label: "Departemen",
      options: uniqueDepartments.map((dept) => ({ label: dept.name, value: dept.id })),
      accessorKeys: ["primaryDepartmentId"],
      value: departmentFilter,
      onChange: setDepartmentFilter,
    },
    {
      id: "status",
      type: "select",
      label: "Status",
      options: [
        { label: "Aktif", value: "active" },
        { label: "Nonaktif", value: "inactive" },
      ],
      predicate: (user, v) => (v === "active" ? !!user.active : !user.active),
      value: statusFilter,
      onChange: setStatusFilter,
    },
    {
      id: "level",
      type: "select",
      label: "Level",
      options: uniqueLevels.map((lvl) => ({ label: `Level ${lvl}`, value: String(lvl) })),
      accessorKeys: ["level"],
      value: levelFilter,
      onChange: setLevelFilter,
    },
  ];

  return (
    <div className="space-y-2">
      <div>
        <h2 className="text-lg font-semibold">Daftar Pengguna</h2>
        <p className="text-muted-foreground">
          Menampilkan {filteredUsers.length} pengguna (Total: {totalUsers})
        </p>
      </div>
      <DataTable
        data={filteredUsers}
        columns={columns}
        filters={filters}
        applyFiltersInternally={false}
        renderStats={<UserManagementStats stats={stats} />}
        emptyMessage={"Tidak ada pengguna yang ditemukan"}
        enablePagination={true}
        enableSorting={false}
        className="rounded-md border"
      />
    </div>
  );
};
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/ui/card";
import { Input } from "@/components/shadcn/ui/input";
import { Button } from "@/components/shadcn/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/ui/select";
import { IconPlus, IconSearch } from "@tabler/icons-react";

/**
 * Komponen untuk filter dan pencarian pengguna
 */
interface UserManagementFiltersProps {
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
  handleAddUser: () => void;
}

export const UserManagementFilters: React.FC<UserManagementFiltersProps> = ({
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
  handleAddUser,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter dan Pencarian</CardTitle>
        <CardDescription>
          Gunakan filter untuk menemukan pengguna dengan cepat
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {/* Pencarian */}
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nama, email, atau departemen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Departemen */}
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Departemen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Departemen</SelectItem>
              {uniqueDepartments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filter Status */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Nonaktif</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter Level */}
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Level</SelectItem>
              {uniqueLevels.map((level) => (
                <SelectItem key={level} value={level.toString()}>
                  Level {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Tombol Tambah Pengguna */}
          <Button onClick={handleAddUser} className="w-full md:w-auto">
            <IconPlus className="mr-2 h-4 w-4" />
            Tambah Pengguna
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
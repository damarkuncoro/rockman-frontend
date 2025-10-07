import { IconPlus, IconSearch } from "@tabler/icons-react";
import { Card, CardContent } from "@/components/shadcn/ui/card";
import { Input } from "@/components/shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/ui/select";
import { Button } from "@/components/shadcn/ui/button";
import { Department } from "../types";
import { ChangeEvent } from "react";

interface UserFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
  departments: Department[];
  handleAddUser: () => void;
}

/**
 * Komponen untuk menampilkan filter dan pencarian pengguna
 */
export function UserFilters({
  searchQuery,
  setSearchQuery,
  selectedDepartment,
  setSelectedDepartment,
  selectedStatus,
  setSelectedStatus,
  selectedLevel,
  setSelectedLevel,
  departments,
  handleAddUser,
}: UserFiltersProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari pengguna..."
              className="pl-8"
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger>
              <SelectValue placeholder="Departemen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Semua Departemen</SelectItem>
              {departments.map((department) => (
                <SelectItem key={department.id} value={department.id}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Semua Status</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Nonaktif</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Semua Level</SelectItem>
              <SelectItem value="1">Level 1</SelectItem>
              <SelectItem value="2">Level 2</SelectItem>
              <SelectItem value="3">Level 3</SelectItem>
              <SelectItem value="4">Level 4</SelectItem>
              <SelectItem value="5">Level 5</SelectItem>
              <SelectItem value="6">Level 6</SelectItem>
              <SelectItem value="7">Level 7</SelectItem>
              <SelectItem value="8">Level 8</SelectItem>
              <SelectItem value="9">Level 9</SelectItem>
              <SelectItem value="10">Level 10</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAddUser} className="w-full">
            <IconPlus className="mr-2 h-4 w-4" />
            Tambah Pengguna
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
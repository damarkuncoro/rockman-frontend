import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/ui/card";
import { IconUsers, IconUserCheck, IconUserX, IconCalendar } from "@tabler/icons-react";

/**
 * Komponen untuk menampilkan statistik pengguna
 */
interface UserManagementStatsProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    departments: number;
  };
}

export const UserManagementStats: React.FC<UserManagementStatsProps> = ({ stats }) => {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
          <IconUsers className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            Semua pengguna terdaftar
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pengguna Aktif</CardTitle>
          <IconUserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% dari total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pengguna Nonaktif</CardTitle>
          <IconUserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.inactiveUsers}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.inactiveUsers / stats.totalUsers) * 100).toFixed(1)}% dari total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Departemen</CardTitle>
          <IconCalendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.departments}</div>
          <p className="text-xs text-muted-foreground">
            Departemen aktif
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
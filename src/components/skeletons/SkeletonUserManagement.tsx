import React from 'react';
import { Skeleton } from "@/components/shadcn/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/shadcn/ui/card";

/**
 * Komponen skeleton untuk halaman manajemen pengguna
 * Menampilkan placeholder loading untuk statistik, filter, dan tabel
 */
export const SkeletonUserManagement = () => {
  return (
    <div className="space-y-6">
      {/* Skeleton untuk statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-[120px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px]" />
              <Skeleton className="h-4 w-[100px] mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skeleton untuk filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 w-full md:w-auto">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Skeleton className="h-10 w-[120px]" />
          <Skeleton className="h-10 w-[120px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>

      {/* Skeleton untuk tabel */}
      <div className="border rounded-md">
        <div className="p-4">
          <div className="grid grid-cols-6 gap-4">
            <Skeleton className="h-6 col-span-1" />
            <Skeleton className="h-6 col-span-2" />
            <Skeleton className="h-6 col-span-1" />
            <Skeleton className="h-6 col-span-1" />
            <Skeleton className="h-6 col-span-1" />
          </div>
        </div>
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="p-4 border-t">
            <div className="grid grid-cols-6 gap-4">
              <Skeleton className="h-6 col-span-1" />
              <Skeleton className="h-6 col-span-2" />
              <Skeleton className="h-6 col-span-1" />
              <Skeleton className="h-6 col-span-1" />
              <Skeleton className="h-6 col-span-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Skeleton untuk pagination */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-[100px]" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </div>
  );
};
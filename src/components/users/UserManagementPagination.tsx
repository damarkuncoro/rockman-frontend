import React from 'react';
import { Button } from "@/components/shadcn/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/ui/select";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";

/**
 * Komponen untuk pagination pada manajemen pengguna
 */
interface UserManagementPaginationProps {
  currentPage: number;
  totalPages: number;
  goToFirstPage: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToLastPage: () => void;
  itemsPerPage?: number;
  onItemsPerPageChange?: (size: number) => void;
}

export const UserManagementPagination: React.FC<UserManagementPaginationProps> = ({
  currentPage,
  totalPages,
  goToFirstPage,
  goToPreviousPage,
  goToNextPage,
  goToLastPage,
  itemsPerPage,
  onItemsPerPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-2">
        <div className="text-sm text-muted-foreground">
          Halaman {currentPage} dari {totalPages}
        </div>
        {typeof itemsPerPage === "number" && onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Baris per halaman</span>
            <Select value={String(itemsPerPage)} onValueChange={(v) => onItemsPerPageChange(Number(v))}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Baris" />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50].map((opt) => (
                  <SelectItem key={opt} value={String(opt)}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={goToFirstPage}
          disabled={currentPage === 1}
        >
          <IconChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        >
          <IconChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          <IconChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={goToLastPage}
          disabled={currentPage === totalPages}
        >
          <IconChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
/**
 * Interface untuk data departemen
 */
export interface Department {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  code: string;
  color: string;
  icon: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

/**
 * Interface untuk data pembuatan departemen baru
 */
export interface CreateDepartmentData {
  name: string;
  description?: string;
  slug?: string;
  code: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
}

/**
 * Interface untuk data update departemen
 */
export interface UpdateDepartmentData {
  name?: string;
  description?: string;
  slug?: string;
  code?: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
}

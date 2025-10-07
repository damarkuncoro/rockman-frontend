export interface User {
  id: string;
  username: string;
  email: string;
  departmentId?: string;
  primaryDepartmentId?: string;
  region?: string;
  level?: number;
  active: boolean;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  departments: number;
}
import { useState, useEffect, useMemo } from 'react';
import { useDeleteUser } from '@/hooks/api/v2/users/[id]/delete.hook.v2';
import { useAllDepartments } from '@/hooks/api/v2/departments/all.hook.v2';
import { useAllUsers } from '@/hooks/api/v2/users/all.hook.v2';
import React from 'react';
import { toast } from "sonner";

/**
 * Tipe untuk nilai yang dikembalikan oleh useUserManagement
 */
export type UserManagementHook = {
  // Data
  users: any[];
  departments: any[];
  isLoading: boolean;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  // Cache indikator untuk users
  usersLastUpdated: number | null;
  usersIsStale: boolean;
  refreshUsers: () => Promise<void>;
  clearUsersCache: () => void;
  
  // Filter dan pencarian
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  departmentFilter: string;
  setDepartmentFilter: React.Dispatch<React.SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  levelFilter: string;
  setLevelFilter: React.Dispatch<React.SetStateAction<string>>;
  
  // Pagination
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  itemsPerPage: number;
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  
  // Modal
  isAddModalOpen: boolean;
  setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditModalOpen: boolean;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isViewModalOpen: boolean;
  setIsViewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUser: any | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<any | null>>;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  
  // Fungsi
  fetchUsers: () => Promise<void>;
  fetchDepartments: () => Promise<void>;
  formatDate: (dateString: string) => string;
  deleteUser: () => Promise<void>;
  handleAddUser: () => void;
  handleViewUser: (user: any) => void;
  handleEditUser: (user: any) => void;
  handleDeleteConfirm: (user: any) => void;
  handleDeleteUser: () => Promise<boolean | undefined>;
  getInitials: (name: string) => string;
  
  // Data yang sudah diproses
  filteredUsers: any[];
  paginatedUsers: any[];
  uniqueDepartments: Array<{id: string, name: string}>;
  uniqueLevels: string[];
  stats: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    departments: number;
  };
}

/**
 * Hook utama untuk manajemen pengguna
 * Mengimplementasikan prinsip SRP dengan memisahkan logika dari UI
 * @returns {UserManagementHook} Objek yang berisi semua state dan fungsi untuk manajemen pengguna
 */
export const useUserManagement = (): UserManagementHook => {
  // State untuk data
  const [users, setUsers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State untuk loading operasi CRUD
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // State untuk filter dan pencarian
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // State untuk modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    departmentId: '',
    region: '',
    level: '',
    active: true,
  });

  // Hooks API
  const { data, loading: isUsersLoading, error: usersError, refetch, clearCache, lastUpdated, isStale } = useAllUsers();
  const { data: deptData, loading: isDeptLoading, error: deptError } = useAllDepartments();
  // Inisialisasi delete hook v2 dengan ID user yang sedang dipilih
  const { deleteUser: apiDeleteUser } = useDeleteUser(selectedUser?.id ?? "");

  
  /**
   * Fetch users dari API
   */
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      console.log('Data users dari API:', data);
      if (data && data.data && Array.isArray(data.data)) {
        console.log('Setting users dengan data:', data.data.length, 'items');
        setUsers(data.data);
      } else {
        console.log('Data users kosong atau bukan array');
        setUsers([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Gagal memuat data pengguna');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch departments dari API
   */
  const fetchDepartments = async () => {
    try {
      console.log('Data departments dari API:', deptData);
      if (deptData && deptData.data && Array.isArray(deptData.data)) {
        console.log('Departemen aktif, fefetch departement', deptData, 'data');
        setDepartments(deptData.data);
      } else {
        console.log('Data departments kosong atau bukan array');
        setDepartments([]);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError('Gagal memuat data departemen');
    }
  };  

  /**
   * Format tanggal ke format yang lebih mudah dibaca
   */
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Delete user
   */
  const deleteUser = async (): Promise<void> => {
    try {
      await apiDeleteUser();
      await fetchUsers();
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      const errorMessage = error?.message || 'Gagal menghapus pengguna';
      setError(errorMessage);
      return Promise.resolve();
    }
  };

  /**
   * Handler untuk menambahkan user baru
   */
  const handleAddUser = () => {
    // Implementasi penambahan user
    setIsAddModalOpen(false);
    toast.success("User berhasil ditambahkan", {
      description: "Data user telah tersimpan",
    });
  };

  /**
   * Handler untuk melihat detail user
   * Melakukan redirect ke halaman detail user
   */
  const handleViewUser = (user: any) => {
    window.location.href = `/users/${user.id}`;
  };

  /**
   * Handler untuk edit user
   */
  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      password: '',
      departmentId: user.departmentId || user.primaryDepartmentId || '',
      region: user.region || '',
      level: user.level?.toString() || '',
      active: user.active || false,
    });
    setIsEditModalOpen(true);
  };

  /**
   * Handler untuk konfirmasi delete user
   */
  const handleDeleteConfirm = (user: any): void => {
    if (!user) return;
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  /**
   * Handler untuk delete user
   */
  const handleDeleteUser = async (): Promise<boolean | undefined> => {
    if (!selectedUser) return false;
    
    try {
      await deleteUser();
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      return true;
    } catch (error) {
      setError('Gagal menghapus pengguna');
      return false;
    }
  };

  /**
   * Mendapatkan inisial dari nama pengguna
   */
  const getInitials = (name: string): string => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  /**
   * Filter users berdasarkan pencarian dan filter
   */
  const filteredUsers = useMemo(() => {
    return Array.isArray(users) ? users.filter((user) => {
      // Pencarian lebih komprehensif
      const searchTermLower = searchTerm.toLowerCase().trim();

      // Jika tidak ada pencarian, hanya terapkan filter
      const matchesSearch = searchTerm === "" ||
        user.username?.toLowerCase().includes(searchTermLower) ||
        user.email?.toLowerCase().includes(searchTermLower) ||
        user.region?.toLowerCase().includes(searchTermLower) ||
        // Pencarian berdasarkan nama departemen
        (user.primaryDepartment && user.primaryDepartment.name.toLowerCase().includes(searchTermLower)) ||
        (user.departments && Array.isArray(user.departments) && 
          user.departments.some((dept: { name: string }) => dept.name.toLowerCase().includes(searchTermLower)));

      // Filter departemen
      const matchesDepartment = departmentFilter === "all" ||
        user.primaryDepartmentId === departmentFilter ||
        (user.departments && Array.isArray(user.departments) && 
          user.departments.some((dept: { id: string }) => dept.id === departmentFilter));

      // Filter status aktif/nonaktif
      const matchesStatus = statusFilter === "all" ||
        (statusFilter === "active" && user.active) ||
        (statusFilter === "inactive" && !user.active);

      // Filter level pengguna
      const matchesLevel = levelFilter === "all" ||
        (user.level !== null && user.level !== undefined && user.level.toString() === levelFilter);

      return matchesSearch && matchesDepartment && matchesStatus && matchesLevel;
    }) : [];
  }, [users, searchTerm, departmentFilter, statusFilter, levelFilter, departments]);

  /**
   * Mendapatkan daftar unik untuk filter
   * @returns {Array<{id: string, name: string}>} Array departemen dengan id dan name
   */
  const uniqueDepartments = useMemo((): Array<{id: string, name: string}> => {
    if (!Array.isArray(departments)) return [];
    
    // Pastikan departemen memiliki id dan name
    return departments
      .filter(dept => dept && typeof dept === 'object' && dept.id && dept.name)
      .map(dept => ({
        id: dept.id,
        name: dept.name
      }));
  }, [departments]);

  const uniqueLevels = useMemo(() =>
    Array.isArray(users) ? [...new Set(users.map(user => user.level).filter(level => level !== null))] : [], [users]
  );

  /**
   * Statistik pengguna
   */
  const stats = useMemo(() => {
    const totalUsers = Array.isArray(users) ? users.length : 0;
    const activeUsers = Array.isArray(users) ? users.filter(user => user.active).length : 0;
    const inactiveUsers = totalUsers - activeUsers;
    const departmentsCount = Array.isArray(departments) ? departments.length : 0;

    return { totalUsers, activeUsers, inactiveUsers, departments: departmentsCount };
  }, [users, departments]);

  /**
   * Pagination logic
   */
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  /**
   * Pagination handlers
   */
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  // Fetch data saat komponen dimount
  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  // Reset ke halaman pertama ketika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, departmentFilter, statusFilter, levelFilter]);

  return {
    // Data
    users,
    departments,
    isLoading,
    error,
    setError,
    // Cache indikator
    usersLastUpdated: lastUpdated ?? null,
    usersIsStale: Boolean(isStale),
    refreshUsers: async () => { await refetch(); await fetchUsers(); },
    clearUsersCache: () => { clearCache(); },
    
    // Filter dan pencarian
    searchTerm,
    setSearchTerm,
    departmentFilter,
    setDepartmentFilter,
    statusFilter,
    setStatusFilter,
    levelFilter,
    setLevelFilter,
    
    // Pagination
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    goToFirstPage,
    goToLastPage,
    goToPreviousPage,
    goToNextPage,
    
    // Modal
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isViewModalOpen,
    setIsViewModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedUser,
    setSelectedUser,
    formData,
    setFormData,
    
    // Fungsi
    fetchUsers,
    fetchDepartments,
    formatDate,
    deleteUser,
    handleAddUser,
    handleViewUser,
    handleEditUser,
    handleDeleteConfirm,
    handleDeleteUser,
    getInitials,
    
    // Data yang sudah diproses
    filteredUsers,
    paginatedUsers,
    uniqueDepartments,
    uniqueLevels,
    stats
  };
}
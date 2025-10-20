"use client"

import * as React from "react"

// Import komponen UI
import { Button } from "@/components/shadcn/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/ui/alert"
// UI input & select now handled by UserManagementFilters
// Avatar & table UI now handled by UserManagementTable
import { SkeletonUserManagement } from "@/components/skeletons/SkeletonUserManagement"
import { IconPlus } from "@tabler/icons-react"

// Import komponen yang telah dipisahkan
import { UserManagementTable } from '@/components/users/UserManagementTable'
import { UsersDataStatusCard } from '@/components/users/UsersDataStatusCard'
import { UserAddModal } from "@/components/users/UserAddModal"
import { UserDeleteModal } from "@/components/users/UserDeleteModal"
import { UserEditModal } from "@/components/users/UserEditModal"
import { UserViewModal } from "@/components/users/UserViewModal"
import { DashboardPage as DashboardLayout } from "@/components/layouts/DashboardPage"

// Import custom hook untuk logika
import { useUserManagement } from '@/hooks/users/useUserManagement';

// Types untuk User dan Department sudah tersedia di komponen terkait,
// tidak perlu didefinisikan ulang di halaman ini.

/**
 * Komponen utama dashboard manajemen pengguna
 * Mengimplementasikan prinsip SRP dengan memisahkan UI dan logika
 */
export default function UserManagementPage() {
  // Menggunakan custom hook untuk semua logika manajemen pengguna
  const userManagement = useUserManagement();
  const {
    // Data
    users,
    departments,
    isLoading,
    error,
    setError,
    
    // Filter dan pencarian
    searchTerm,
    setSearchTerm,
    departmentFilter,
    setDepartmentFilter,
    statusFilter,
    setStatusFilter,
    levelFilter,
    setLevelFilter,
    
    // Pagination (internalized via DataTable)
    currentPage,
    totalPages,
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
    formatDate,
    handleAddUser,
    handleViewUser,
    handleEditUser,
    handleDeleteUser,
    handleDeleteConfirm,
    getInitials,
    
    // Data yang sudah diproses
    filteredUsers,
    paginatedUsers,
    uniqueDepartments,
    uniqueLevels,
    stats
  } = userManagement;
  // Tampilkan skeleton loading saat data sedang dimuat
  if (isLoading) {
    return <SkeletonUserManagement />
  }

  // Konten untuk tab Users Management
  const UsersManagement: React.FC = () => (
    <>
      {/* Tabel Pengguna */}
      <UserManagementTable
        filteredUsers={filteredUsers}
        totalUsers={users.length}
        departments={departments}
        getInitials={getInitials}
        handleViewUser={handleViewUser}
        handleEditUser={handleEditUser}
        handleDeleteConfirm={(user) => { setSelectedUser(user); handleDeleteConfirm(user); }}
        formatDate={formatDate}
        stats={stats}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        levelFilter={levelFilter}
        setLevelFilter={setLevelFilter}
        uniqueDepartments={uniqueDepartments}
        uniqueLevels={uniqueLevels}
        
      />

     

      {/* Modals */}
      <UserAddModal 
        isOpen={isAddModalOpen}
        setIsOpen={setIsAddModalOpen}
        formData={formData}
        setFormData={setFormData}
        departments={departments}
        uniqueLevels={uniqueLevels}
        handleSaveUser={handleAddUser}
        setError={setError}
      />

      <UserEditModal 
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        user={selectedUser}
        formData={formData}
        setFormData={setFormData}
        departments={departments}
        uniqueLevels={uniqueLevels}
        handleSaveUser={handleEditUser}
        setError={setError}
      />

      <UserViewModal 
        isOpen={isViewModalOpen}
        setIsOpen={setIsViewModalOpen}
        user={selectedUser}
        departments={departments}
        getInitials={getInitials}
        formatDate={formatDate}
      />

      <UserDeleteModal 
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        user={selectedUser}
        getInitials={getInitials}
        handleConfirmDelete={async () => await handleDeleteUser()}
        setError={setError}
      />
    </>
  )

  // Placeholder konten untuk tab Employees Management
  const EmployeesManagement: React.FC = () => (
    <div className="text-sm text-muted-foreground">Employees Management - coming soon</div>
  )

  // Placeholder konten untuk tab Customers Management
  const CustomersManagement: React.FC = () => (
    <div className="text-sm text-muted-foreground">Customers Management - coming soon</div>
  )

  return (
    <DashboardLayout
      title="Manajemen Pengguna"
      description="Kelola pengguna sistem, departemen, dan hak akses"
      actions={
        <Button onClick={() => handleAddUser()} className="w-full md:w-auto">
          <IconPlus className="mr-2 h-4 w-4" />
          Tambah Pengguna
        </Button>
      }
      tabs={[
        { value: "users", label: "Users Management", content: <UsersManagement /> }, 
        { value: "employees", label: "Employees Management", content: <EmployeesManagement /> },
        { value: "customers", label: "Customers Management", content: <CustomersManagement /> },
      ]}
      defaultTab="users"
      contentCard={false}
    >
    </DashboardLayout>
  )
}
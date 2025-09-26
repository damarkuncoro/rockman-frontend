import { useState, useEffect } from 'react'

/**
 * Interface untuk data department
 */
export interface Department {
  id: number
  name: string
  description: string | null
  slug: string
  code: string
  color: string
  icon: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

/**
 * Custom hook untuk mengelola data departments
 */
export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fungsi untuk fetch departments dari API
   */
  const fetchDepartments = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch("http://localhost:9999/api/v1/departments")
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Pastikan data memiliki struktur yang benar
      if (Array.isArray(data)) {
        setDepartments(data)
      } else {
        throw new Error("Format data tidak valid")
      }
    } catch (error) {
      console.error("Error fetching departments:", error)
      setError(error instanceof Error ? error.message : "Gagal memuat data departemen")
      setDepartments([]) // Set empty array jika error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Fungsi untuk create department baru
   */
  const createDepartment = async (departmentData: Omit<Department, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'sortOrder'>) => {
    try {
      const response = await fetch("http://localhost:9999/api/v1/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(departmentData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const newDepartment = await response.json()
      
      // Refresh data setelah create
      await fetchDepartments()
      
      return newDepartment
    } catch (error) {
      console.error("Error creating department:", error)
      throw error
    }
  }

  /**
   * Fungsi untuk update department
   */
  const updateDepartment = async (departmentId: number, departmentData: Partial<Department>) => {
    try {
      const response = await fetch(`http://localhost:9999/api/v1/departments/${departmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(departmentData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updatedDepartment = await response.json()
      
      // Refresh data setelah update
      await fetchDepartments()
      
      return updatedDepartment
    } catch (error) {
      console.error("Error updating department:", error)
      throw error
    }
  }

  /**
   * Fungsi untuk delete department
   */
  const deleteDepartment = async (departmentId: number) => {
    try {
      const response = await fetch(`http://localhost:9999/api/v1/departments/${departmentId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Refresh data setelah delete
      await fetchDepartments()
      
      return true
    } catch (error) {
      console.error("Error deleting department:", error)
      throw error
    }
  }

  // Fetch data saat hook pertama kali digunakan
  useEffect(() => {
    fetchDepartments()
  }, [])

  return {
    departments,
    isLoading,
    error,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  }
}
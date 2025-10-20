import * as React from "react"
import { useAllDepartments, Department } from "@/hooks/api/v2/departments/all.hook.v2"

interface UseDepartmentsProps {
  initialSearch?: string
  initialIsActive?: boolean | undefined
}

interface UseDepartmentsReturn {
  departments: Department[]
  loading: boolean
  error: string | Error | null
  search: string
  isActive: boolean | undefined
  setSearch: (value: string) => void
  setIsActive: (value: boolean | undefined) => void
  refetch: () => void
}

/**
 * Custom hook untuk mengelola data departemen
 * Filter dilakukan pada data yang sudah di-fetch, bukan re-fetch
 */
export function useDepartments({
  initialSearch = "",
  initialIsActive = true
}: UseDepartmentsProps = {}): UseDepartmentsReturn {
  const [search, setSearch] = React.useState(initialSearch)
  const [isActive, setIsActive] = React.useState<boolean | undefined>(initialIsActive)
  
  // Menggunakan hook API untuk mengambil semua data departemen
  const { data: departmentsResponse, loading, error, refetch } = useAllDepartments({
    sortBy: "name",
    sortOrder: "asc"
  })
  
  // Filter data departemen berdasarkan search dan isActive
  const filteredDepartments = React.useMemo(() => {
    if (!departmentsResponse?.data) return []
    
    return departmentsResponse.data.filter(department => {
      // Filter berdasarkan status aktif
      if (isActive !== undefined && department.isActive !== isActive) {
        return false
      }
      
      // Filter berdasarkan pencarian
      if (search && search.trim() !== "") {
        const searchLower = search.toLowerCase()
        return (
          department.name.toLowerCase().includes(searchLower) ||
          department.code.toLowerCase().includes(searchLower) ||
          (department.description && department.description.toLowerCase().includes(searchLower))
        )
      }
      
      return true
    })
  }, [departmentsResponse?.data, search, isActive])

  return {
    departments: filteredDepartments,
    loading,
    error,
    search,
    isActive,
    setSearch,
    setIsActive,
    refetch
  }
}
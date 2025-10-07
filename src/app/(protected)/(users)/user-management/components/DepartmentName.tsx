'use client';

import { useEffect, useState } from 'react';
import { useUserDepartments } from '@/hooks/api/v2/users/[id]/departments/index.hook';
import { Department } from '@/hooks/api/v2/departments/types';

interface DepartmentNameProps {
  userId: string | null;
  departmentId: string | null;
}

/**
 * Komponen untuk menampilkan nama departemen berdasarkan ID
 * @param {string | null} userId - ID pengguna untuk mengambil data departemen
 * @param {string | null} departmentId - ID departemen yang akan ditampilkan
 */
export const DepartmentName = ({ userId, departmentId }: DepartmentNameProps) => {
  const [departmentName, setDepartmentName] = useState<string>("Memuat...");
  const [isPrimary, setIsPrimary] = useState<boolean>(false);
  const [otherDepartments, setOtherDepartments] = useState<Department[]>([]);
  const { departments, loading, error, fetchUserDepartments } = useUserDepartments();

  useEffect(() => {
    const getDepartmentName = async () => {
      if (!userId) {
        setDepartmentName("Tidak ada departemen");
        return;
      }

      try {
        console.log("Fetching departments for userId:", userId);
        await fetchUserDepartments(userId);
      } catch (error) {
        console.error("Error fetching department data:", error);
        setDepartmentName("Error");
      }
    };

    getDepartmentName();
  }, [userId, fetchUserDepartments]);

  useEffect(() => {
    console.log("DepartmentName state:", { 
      loading, 
      departmentsLength: departments.length, 
      departmentId,
      departments: departments
    });

    if (!loading) {
      if (error) {
        setDepartmentName("Error");
        return;
      }
      
      if (departments.length === 0) {
        setDepartmentName("Tidak ada departemen");
        setOtherDepartments([]);
        return;
      }
      
      if (departmentId) {
        const department = departments.find((dept: Department) => dept.id === departmentId);
        if (department) {
          setDepartmentName(department.name);
          setIsPrimary(true);
          // Simpan departemen lain selain yang primary
          setOtherDepartments(departments.filter((dept: Department) => dept.id !== departmentId));
        } else {
          setDepartmentName("Departemen tidak ditemukan");
          setIsPrimary(false);
          setOtherDepartments(departments);
        }
      } else if (departments.length > 0) {
        // Jika tidak ada departmentId tapi ada departments, tampilkan departemen pertama
        setDepartmentName(departments[0].name);
        setIsPrimary(false);
        setOtherDepartments(departments.slice(1));
      }
    }
  }, [departments, loading, error, departmentId]);

  // Render departemen dengan informasi tambahan
  if (loading) return "Memuat...";
  if (error) return "Error";
  if (departments.length === 0) return "Tidak ada departemen";
  
  return (
    <>
      <span className={isPrimary ? "font-bold text-blue-600" : ""}>
        {departmentName}
        {isPrimary && <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">Primary</span>}
      </span>
      {otherDepartments.length > 0 && (
        <span className="text-xs text-gray-600 ml-1">
          (+ {otherDepartments.map(dept => dept.name).join(', ')})
        </span>
      )}
    </>
  );
};

export default DepartmentName;
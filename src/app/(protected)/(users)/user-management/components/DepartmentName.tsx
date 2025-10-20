'use client';

import * as React from 'react';

type Department = {
  id: string;
  name: string;
};

type UserLike = {
  primaryDepartmentId?: string | null;
  primaryDepartment?: Department | null;
  departments?: Department[];
};

interface DepartmentNameProps {
  user?: UserLike;
  departmentId?: string | null;
  departments?: Department[];
}

export const DepartmentName = ({ user, departmentId, departments }: DepartmentNameProps) => {
  const allDepartments: Department[] = user?.departments ?? departments ?? [];

  const primary = user?.primaryDepartment ?? (allDepartments.find(d => d.id === user?.primaryDepartmentId!) ?? null);

  let name = '';
  let isPrimary = false;
  let others: Department[] = [];

  if (primary?.name) {
    name = primary.name;
    isPrimary = true;
    others = allDepartments.filter(d => d.id !== primary!.id);
  } else if (departmentId) {
    const match = allDepartments.find(d => d.id === departmentId);
    if (match) {
      name = match.name;
      isPrimary = user?.primaryDepartmentId === match.id;
      others = allDepartments.filter(d => d.id !== match.id);
    }
  } else if (allDepartments.length > 0) {
    name = allDepartments[0].name;
    others = allDepartments.slice(1);
  }

  if (!name) {
    return <>Tidak ada departemen</>;
  }

  return (
    <>
      <span className={isPrimary ? 'font-bold text-blue-600' : ''}>
        {name}
        {isPrimary ? (
          <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">Primary</span>
        ) : null}
      </span>
      {others.length > 0 ? (
        <span className="text-xs text-gray-600 ml-1">(+ {others.map(d => d.name).join(', ')})</span>
      ) : null}
    </>
  );
};

export default DepartmentName;
import React from 'react';
import { SelectItem as ShadcnSelectItem } from "@/components/shadcn/ui/select";

/**
 * Pure UI komponen untuk SelectItem
 * Mengimplementasikan prinsip SRP dengan fokus hanya pada presentasi UI
 */
interface SelectItemUIProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const SelectItemUI: React.FC<SelectItemUIProps> = ({
  value,
  children,
  className,
  disabled
}) => {
  return (
    <ShadcnSelectItem
      value={value}
      className={className}
      disabled={disabled}
    >
      {children}
    </ShadcnSelectItem>
  );
};
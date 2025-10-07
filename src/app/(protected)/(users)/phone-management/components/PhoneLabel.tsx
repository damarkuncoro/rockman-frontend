"use client"

import * as React from "react"
import { IconPhone, IconStar, IconStarFilled } from "@tabler/icons-react"
import { Badge } from "@/components/shadcn/ui/badge"

interface PhoneLabelProps {
  label: string
  isDefault: boolean
  isVerified: boolean
}

/**
 * Komponen untuk menampilkan label nomor telepon dengan indikator default dan verifikasi
 */
export function PhoneLabel({ label, isDefault, isVerified }: PhoneLabelProps) {
  return (
    <>
      <span className={isDefault ? "font-bold text-blue-600" : ""}>
        {label}
        {isDefault && <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">Default</span>}
      </span>
      {isVerified && (
        <span className="text-xs text-gray-600 ml-1">
          <Badge variant="outline" className="ml-1 bg-green-50 text-green-700 border-green-200">
            Terverifikasi
          </Badge>
        </span>
      )}
    </>
  )
}
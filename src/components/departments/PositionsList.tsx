"use client"

import { IconBuilding } from "@tabler/icons-react"
import { Badge } from "@/components/shadcn/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/ui/table"

interface PositionsListProps {
  positions: any[]
}

/**
 * Komponen untuk menampilkan daftar posisi dalam departemen
 */
export function PositionsList({ positions }: PositionsListProps) {
  return (
    <Card className="md:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconBuilding className="h-5 w-5" />
          <span>Posisi dalam Departemen</span>
        </CardTitle>
        <CardDescription>
          Total: {positions?.length || 0} posisi
        </CardDescription>
      </CardHeader>
      <CardContent>
        {positions && positions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((position) => (
                <TableRow key={position.id}>
                  <TableCell>{position.name}</TableCell>
                  <TableCell>{position.description || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={position.isActive ? "default" : "outline"}>
                      {position.isActive ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Tidak ada posisi dalam departemen ini
          </div>
        )}
      </CardContent>
    </Card>
  )
}
"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface Column<T> {
  header: string
  accessorKey: keyof T
  cell?: (item: T) => React.ReactNode
  className?: string
}

interface ResponsiveTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyField: keyof T
  emptyMessage?: string
}

export function ResponsiveTable<T>({
  data,
  columns,
  keyField,
  emptyMessage = "Nenhum dado encontrado",
}: ResponsiveTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">{emptyMessage}</CardContent>
      </Card>
    )
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.accessorKey)} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={String(item[keyField])}>
                {columns.map((column) => (
                  <TableCell
                    key={`${String(item[keyField])}-${String(column.accessorKey)}`}
                    className={column.className}
                  >
                    {column.cell ? column.cell(item) : String(item[column.accessorKey] || "")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {data.map((item) => {
          const id = String(item[keyField])
          const isExpanded = expandedRows[id]

          return (
            <Card key={id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {/* Mostrar primeira coluna como título */}
                    {columns[0].cell ? columns[0].cell(item) : String(item[columns[0].accessorKey] || "")}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => toggleRow(id)}>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>

                {/* Mostrar segunda coluna sempre visível */}
                {columns.length > 1 && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {columns[1].cell ? columns[1].cell(item) : String(item[columns[1].accessorKey] || "")}
                  </div>
                )}

                {/* Mostrar colunas restantes quando expandido */}
                {isExpanded && (
                  <div className="mt-4 space-y-2 pt-2 border-t">
                    {columns.slice(2).map((column) => (
                      <div key={String(column.accessorKey)} className="grid grid-cols-2 gap-2 text-sm">
                        <div className="font-medium">{column.header}:</div>
                        <div>{column.cell ? column.cell(item) : String(item[column.accessorKey] || "")}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}

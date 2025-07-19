"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
  className?: string
}

interface ResponsiveTableProps {
  data: any[]
  columns: Column[]
  keyField: string
  mobileCardRender?: (row: any, index: number) => React.ReactNode
  emptyMessage?: string
}

export function ResponsiveTable({
  data,
  columns,
  keyField,
  mobileCardRender,
  emptyMessage = "Nenhum item encontrado",
}: ResponsiveTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
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
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={row[keyField] || index}>
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-2">
        {data.map((row, index) => {
          const rowId = row[keyField] || index.toString()
          const isExpanded = expandedRows.has(rowId)

          return (
            <Card key={rowId}>
              <CardContent className="p-3">
                {mobileCardRender ? (
                  mobileCardRender(row, index)
                ) : (
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {columns.slice(0, 2).map((column) => (
                          <div key={column.key} className="text-sm">
                            <span className="font-medium">{column.label}: </span>
                            {column.render ? column.render(row[column.key], row) : row[column.key]}
                          </div>
                        ))}
                      </div>
                      {columns.length > 2 && (
                        <Button variant="ghost" size="sm" onClick={() => toggleRow(rowId)} className="h-6 w-6 p-0">
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>
                    {isExpanded && columns.length > 2 && (
                      <div className="mt-2 pt-2 border-t space-y-1">
                        {columns.slice(2).map((column) => (
                          <div key={column.key} className="text-sm">
                            <span className="font-medium">{column.label}: </span>
                            {column.render ? column.render(row[column.key], row) : row[column.key]}
                          </div>
                        ))}
                      </div>
                    )}
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

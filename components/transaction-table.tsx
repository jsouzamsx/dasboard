"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TransactionFilters } from "@/components/transaction-filters"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, FileText } from "lucide-react"

export function TransactionTable() {
  const allTransactions = [
    {
      date: "quinta-feira, março 20, 2025",
      type: "Saída",
      description: "Aluguel",
      value: 1000.0,
      category: "Sistema",
    },
    {
      date: "quinta-feira, março 20, 2025",
      type: "Saída",
      description: "Gás",
      value: 100.0,
      category: "Saída",
    },
    {
      date: "quinta-feira, março 20, 2025",
      type: "Saída",
      description: "mistura",
      value: 170.0,
      category: "Sistema",
    },
    {
      date: "quinta-feira, março 20, 2025",
      type: "Entrada",
      description: "vale",
      value: 1000.0,
      category: "Cartão",
    },
    {
      date: "sexta-feira, março 21, 2025",
      type: "Entrada",
      description: "emprestimo",
      value: 243.0,
      category: "Diversos",
    },
    {
      date: "sexta-feira, março 21, 2025",
      type: "Entrada",
      description: "latinhas",
      value: 31.0,
      category: "Valores",
    },
    {
      date: "sábado, março 22, 2025",
      type: "Saída",
      description: "pão",
      value: 4.0,
      category: "Saída",
    },
    {
      date: "sexta-feira, março 28, 2025",
      type: "Saída",
      description: "mercado cafe",
      value: 34.0,
      category: "Saída",
    },
    {
      date: "sexta-feira, março 28, 2025",
      type: "Saída",
      description: "emanuel",
      value: 100.0,
      category: "Saída",
    },
    {
      date: "sábado, março 29, 2025",
      type: "Saída",
      description: "mercado",
      value: 154.0,
      category: "Saída",
    },
    {
      date: "domingo, março 30, 2025",
      type: "Saída",
      description: "padaria",
      value: 28.0,
      category: "Saída",
    },
  ]

  const [transactions, setTransactions] = useState(allTransactions)
  const [filters, setFilters] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    applyFilters()
  }, [filters, currentPage, itemsPerPage])

  const applyFilters = () => {
    let filteredTransactions = [...allTransactions]

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredTransactions = filteredTransactions.filter(
        (transaction) =>
          transaction.description.toLowerCase().includes(searchLower) ||
          transaction.category.toLowerCase().includes(searchLower) ||
          transaction.date.toLowerCase().includes(searchLower),
      )
    }

    // Apply type filter
    if (filters.type && filters.type !== "all") {
      filteredTransactions = filteredTransactions.filter((transaction) => transaction.type === filters.type)
    }

    // Apply category filter
    if (filters.category && filters.category !== "all") {
      filteredTransactions = filteredTransactions.filter((transaction) => transaction.category === filters.category)
    }

    // Apply date range filters
    if (filters.startDate) {
      const startDate = new Date(filters.startDate)
      filteredTransactions = filteredTransactions.filter((transaction) => {
        const transactionDate = parseTransactionDate(transaction.date)
        return transactionDate >= startDate
      })
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate)
      endDate.setHours(23, 59, 59, 999) // End of day
      filteredTransactions = filteredTransactions.filter((transaction) => {
        const transactionDate = parseTransactionDate(transaction.date)
        return transactionDate <= endDate
      })
    }

    // Apply value range filters
    if (filters.minValue) {
      filteredTransactions = filteredTransactions.filter((transaction) => transaction.value >= filters.minValue)
    }

    if (filters.maxValue) {
      filteredTransactions = filteredTransactions.filter((transaction) => transaction.value <= filters.maxValue)
    }

    // Calculate total pages
    setTotalPages(Math.ceil(filteredTransactions.length / itemsPerPage))

    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage)

    setTransactions(paginatedTransactions)
  }

  // Helper function to parse the date string
  const parseTransactionDate = (dateString) => {
    // Extract the date part: "quinta-feira, março 20, 2025" -> "março 20, 2025"
    const datePart = dateString.split(", ").slice(1).join(", ")

    // Map Portuguese month names to English
    const monthMap = {
      janeiro: "January",
      fevereiro: "February",
      março: "March",
      abril: "April",
      maio: "May",
      junho: "June",
      julho: "July",
      agosto: "August",
      setembro: "September",
      outubro: "October",
      novembro: "November",
      dezembro: "December",
    }

    // Replace Portuguese month with English month
    let englishDate = datePart
    Object.entries(monthMap).forEach(([ptMonth, enMonth]) => {
      englishDate = englishDate.replace(ptMonth, enMonth)
    })

    return new Date(englishDate)
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value))
    setCurrentPage(1) // Reset to first page
  }

  // Calculate totals for displayed transactions
  const totalIncome = transactions.filter((t) => t.type === "Entrada").reduce((sum, t) => sum + t.value, 0)

  const totalExpense = transactions.filter((t) => t.type === "Saída").reduce((sum, t) => sum + t.value, 0)

  return (
    <div className="space-y-4">
      <div className="p-4 border-b">
        <TransactionFilters onFilterChange={handleFilterChange} />
      </div>

      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[180px]">Data</TableHead>
              <TableHead className="w-[100px]">Tipo</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-right">Categoria</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <TableRow key={index} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                  <TableCell className="font-medium">{transaction.date}</TableCell>
                  <TableCell>
                    <Badge variant={transaction.type === "Entrada" ? "success" : "destructive"} className="capitalize">
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="text-right">R$ {transaction.value.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{transaction.category}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhuma transação encontrada com os filtros aplicados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Itens por página:</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-500 font-medium">Entradas: R$ {totalIncome.toFixed(2)}</span>
            <span className="text-muted-foreground">|</span>
            <span className="text-red-500 font-medium">Saídas: R$ {totalExpense.toFixed(2)}</span>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={prevPage} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextPage} disabled={currentPage === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-1" />
            Exportar
          </Button>
        </div>
      </div>
    </div>
  )
}


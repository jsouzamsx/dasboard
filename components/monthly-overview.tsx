"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit2, Check, X, Plus, Trash2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

export function MonthlyOverview() {
  // Dados de exemplo baseados na planilha
  const [dailyTransactions, setDailyTransactions] = useState([
    {
      id: 1,
      date: "20/03/2025",
      dayOfWeek: "quinta-feira",
      income: 1000.0,
      expense: 1270.0,
      balance: -270.0,
      editing: false,
    },
    {
      id: 2,
      date: "21/03/2025",
      dayOfWeek: "sexta-feira",
      income: 274.0,
      expense: 0.0,
      balance: 274.0,
      editing: false,
    },
    {
      id: 3,
      date: "22/03/2025",
      dayOfWeek: "sábado",
      income: 0.0,
      expense: 4.0,
      balance: -4.0,
      editing: false,
    },
    {
      id: 4,
      date: "28/03/2025",
      dayOfWeek: "sexta-feira",
      income: 0.0,
      expense: 234.0,
      balance: -234.0,
      editing: false,
    },
    {
      id: 5,
      date: "29/03/2025",
      dayOfWeek: "sábado",
      income: 0.0,
      expense: 294.0,
      balance: -294.0,
      editing: false,
    },
    {
      id: 6,
      date: "30/03/2025",
      dayOfWeek: "domingo",
      income: 0.0,
      expense: 28.0,
      balance: -28.0,
      editing: false,
    },
  ])

  const [editValues, setEditValues] = useState({
    date: null,
    income: "",
    expense: "",
  })

  const [showAddForm, setShowAddForm] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    date: new Date(),
    income: "",
    expense: "",
  })

  // Calculate totals
  const totalIncome = dailyTransactions.reduce((sum, day) => sum + day.income, 0)
  const totalExpense = dailyTransactions.reduce((sum, day) => sum + day.expense, 0)
  const totalBalance = dailyTransactions.reduce((sum, day) => sum + day.balance, 0)

  const startEditing = (id) => {
    const updatedTransactions = dailyTransactions.map((transaction) => {
      if (transaction.id === id) {
        setEditValues({
          date: parseDate(transaction.date),
          income: transaction.income.toString(),
          expense: transaction.expense.toString(),
        })
        return { ...transaction, editing: true }
      }
      return { ...transaction, editing: false }
    })

    setDailyTransactions(updatedTransactions)
    setShowAddForm(false)
  }

  const cancelEditing = () => {
    const updatedTransactions = dailyTransactions.map((transaction) => ({
      ...transaction,
      editing: false,
    }))

    setDailyTransactions(updatedTransactions)
    setEditValues({
      date: null,
      income: "",
      expense: "",
    })
  }

  const saveEditing = (id) => {
    const updatedTransactions = dailyTransactions.map((transaction) => {
      if (transaction.id === id) {
        const income = Number.parseFloat(editValues.income) || 0
        const expense = Number.parseFloat(editValues.expense) || 0
        const balance = income - expense
        const date = editValues.date ? formatDate(editValues.date) : transaction.date
        const dayOfWeek = editValues.date ? getDayOfWeek(editValues.date) : transaction.dayOfWeek

        return {
          ...transaction,
          date: date,
          dayOfWeek: dayOfWeek,
          income: income,
          expense: expense,
          balance: balance,
          editing: false,
        }
      }
      return transaction
    })

    setDailyTransactions(updatedTransactions)
    setEditValues({
      date: null,
      income: "",
      expense: "",
    })
  }

  const handleInputChange = (field, value) => {
    setEditValues({
      ...editValues,
      [field]: value,
    })
  }

  const handleNewTransactionChange = (field, value) => {
    setNewTransaction({
      ...newTransaction,
      [field]: value,
    })
  }

  const addNewTransaction = () => {
    if (newTransaction.date) {
      const income = Number.parseFloat(newTransaction.income) || 0
      const expense = Number.parseFloat(newTransaction.expense) || 0
      const balance = income - expense

      const newTransactionItem = {
        id: Date.now(), // Use timestamp as unique ID
        date: formatDate(newTransaction.date),
        dayOfWeek: getDayOfWeek(newTransaction.date),
        income: income,
        expense: expense,
        balance: balance,
        editing: false,
      }

      setDailyTransactions([...dailyTransactions, newTransactionItem])
      setNewTransaction({
        date: new Date(),
        income: "",
        expense: "",
      })
      setShowAddForm(false)
    }
  }

  const deleteTransaction = (id) => {
    setDailyTransactions(dailyTransactions.filter((transaction) => transaction.id !== id))
  }

  // Helper function to format date
  const formatDate = (date) => {
    return format(date, "dd/MM/yyyy")
  }

  // Helper function to parse date string to Date object
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("/")
    return new Date(year, month - 1, day)
  }

  // Helper function to get day of week in Portuguese
  const getDayOfWeek = (date) => {
    const daysOfWeek = [
      "domingo",
      "segunda-feira",
      "terça-feira",
      "quarta-feira",
      "quinta-feira",
      "sexta-feira",
      "sábado",
    ]
    return daysOfWeek[date.getDay()]
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Visão Mensal</CardTitle>
            <CardDescription>Transações por dia - Março 2025</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowAddForm(!showAddForm)
              cancelEditing()
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Nova
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <div className="mb-4 p-3 border rounded-md bg-muted/20">
            <h3 className="text-sm font-medium mb-2">Nova Transação</h3>
            <div className="space-y-2">
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-start text-left font-normal h-8">
                      {newTransaction.date ? formatDate(newTransaction.date) : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newTransaction.date}
                      onSelect={(date) => handleNewTransactionChange("date", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Entrada (R$)"
                  value={newTransaction.income}
                  onChange={(e) => handleNewTransactionChange("income", e.target.value)}
                  className="h-8"
                />
                <Input
                  type="number"
                  placeholder="Saída (R$)"
                  value={newTransaction.expense}
                  onChange={(e) => handleNewTransactionChange("expense", e.target.value)}
                  className="h-8"
                />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
                <Button size="sm" onClick={addNewTransaction}>
                  Adicionar
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[120px]">Data</TableHead>
                <TableHead className="w-[150px]">Dia</TableHead>
                <TableHead className="text-right">Entradas</TableHead>
                <TableHead className="text-right">Saídas</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
                <TableHead className="w-[80px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dailyTransactions.map((day, index) => (
                <TableRow key={day.id} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                  {day.editing ? (
                    <>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full h-7">
                              {editValues.date ? formatDate(editValues.date) : day.date}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={editValues.date}
                              onSelect={(date) => handleInputChange("date", date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>{editValues.date ? getDayOfWeek(editValues.date) : day.dayOfWeek}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={editValues.income}
                          onChange={(e) => handleInputChange("income", e.target.value)}
                          className="h-7 text-right"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={editValues.expense}
                          onChange={(e) => handleInputChange("expense", e.target.value)}
                          className="h-7 text-right"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        R${" "}
                        {(
                          Number.parseFloat(editValues.income || 0) - Number.parseFloat(editValues.expense || 0)
                        ).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => saveEditing(day.id)}>
                            <Check className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={cancelEditing}>
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => deleteTransaction(day.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-medium">{day.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{day.dayOfWeek}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-green-500">
                        {day.income > 0 ? `R$ ${day.income.toFixed(2)}` : "-"}
                      </TableCell>
                      <TableCell className="text-right text-red-500">
                        {day.expense > 0 ? `R$ ${day.expense.toFixed(2)}` : "-"}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${day.balance >= 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        R$ {day.balance.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEditing(day.id)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
              <TableRow className="bg-muted/30 font-bold">
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell className="text-right text-green-500">R$ {totalIncome.toFixed(2)}</TableCell>
                <TableCell className="text-right text-red-500">R$ {totalExpense.toFixed(2)}</TableCell>
                <TableCell className={`text-right ${totalBalance >= 0 ? "text-green-500" : "text-red-500"}`}>
                  R$ {totalBalance.toFixed(2)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}


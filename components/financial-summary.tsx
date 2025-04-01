"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, MinusCircle, PlusCircle, Edit2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { AddTransactionDialog } from "@/components/add-transaction-dialog"
import { Input } from "@/components/ui/input"

export function FinancialSummary() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [transactionType, setTransactionType] = useState("Entrada")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const [summaryData, setSummaryData] = useState({
    income: 1951.0,
    expense: 1901.0,
    balance: 50.0,
    sistema: 0,
    cartao: 0,
    diversos: 0,
    valores: 50.0,
  })

  const [editValues, setEditValues] = useState({
    income: "",
    expense: "",
    sistema: "",
    cartao: "",
    diversos: "",
    valores: "",
  })

  const openAddIncomeDialog = () => {
    setTransactionType("Entrada")
    setIsDialogOpen(true)
  }

  const openAddExpenseDialog = () => {
    setTransactionType("Saída")
    setIsDialogOpen(true)
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const startEditing = () => {
    setEditValues({
      income: summaryData.income.toString(),
      expense: summaryData.expense.toString(),
      sistema: summaryData.sistema.toString(),
      cartao: summaryData.cartao.toString(),
      diversos: summaryData.diversos.toString(),
      valores: summaryData.valores.toString(),
    })
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setIsEditing(false)
  }

  const saveEditing = () => {
    const income = Number.parseFloat(editValues.income) || 0
    const expense = Number.parseFloat(editValues.expense) || 0
    const sistema = Number.parseFloat(editValues.sistema) || 0
    const cartao = Number.parseFloat(editValues.cartao) || 0
    const diversos = Number.parseFloat(editValues.diversos) || 0
    const valores = Number.parseFloat(editValues.valores) || 0

    setSummaryData({
      income: income,
      expense: expense,
      balance: income - expense,
      sistema: sistema,
      cartao: cartao,
      diversos: diversos,
      valores: valores,
    })

    setIsEditing(false)
  }

  const handleInputChange = (field, value) => {
    setEditValues({
      ...editValues,
      [field]: value,
    })
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Resumo Financeiro</CardTitle>
            <CardDescription>Março 2025</CardDescription>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={saveEditing}>
                  <Check className="h-4 w-4 text-green-500" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={cancelEditing}>
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-500 border-green-500 hover:bg-green-50"
                  onClick={openAddIncomeDialog}
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Entrada
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 border-red-500 hover:bg-red-50"
                  onClick={openAddExpenseDialog}
                >
                  <MinusCircle className="h-4 w-4 mr-1" />
                  Saída
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={startEditing}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleCollapse}>
                  {isCollapsed ? "+" : "-"}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      {!isCollapsed && (
        <CardContent className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Entrada</span>
              {isEditing ? (
                <Input
                  type="number"
                  value={editValues.income}
                  onChange={(e) => handleInputChange("income", e.target.value)}
                  className="h-8"
                />
              ) : (
                <div className="flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-xl font-bold">R$ {summaryData.income.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Saída</span>
              {isEditing ? (
                <Input
                  type="number"
                  value={editValues.expense}
                  onChange={(e) => handleInputChange("expense", e.target.value)}
                  className="h-8"
                />
              ) : (
                <div className="flex items-center gap-1">
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                  <span className="text-xl font-bold">R$ {summaryData.expense.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg bg-muted p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Saldo Final</p>
                <p className="text-lg font-bold">R$ {summaryData.balance.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {summaryData.balance >= 0 ? "Saldo Positivo" : "Saldo Negativo"}
                </p>
                <p
                  className={`text-base font-semibold ${summaryData.balance >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  R$ {Math.abs(summaryData.balance).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Sistema</span>
              {isEditing ? (
                <Input
                  type="number"
                  value={editValues.sistema}
                  onChange={(e) => handleInputChange("sistema", e.target.value)}
                  className="h-8"
                />
              ) : (
                <span className="text-base font-semibold">
                  {summaryData.sistema > 0 ? `R$ ${summaryData.sistema.toFixed(2)}` : "R$ -"}
                </span>
              )}
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Cartão</span>
              {isEditing ? (
                <Input
                  type="number"
                  value={editValues.cartao}
                  onChange={(e) => handleInputChange("cartao", e.target.value)}
                  className="h-8"
                />
              ) : (
                <span className="text-base font-semibold">
                  {summaryData.cartao > 0 ? `R$ ${summaryData.cartao.toFixed(2)}` : "R$ -"}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Diversos</span>
              {isEditing ? (
                <Input
                  type="number"
                  value={editValues.diversos}
                  onChange={(e) => handleInputChange("diversos", e.target.value)}
                  className="h-8"
                />
              ) : (
                <span className="text-base font-semibold">
                  {summaryData.diversos > 0 ? `R$ ${summaryData.diversos.toFixed(2)}` : "R$ -"}
                </span>
              )}
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Valores</span>
              {isEditing ? (
                <Input
                  type="number"
                  value={editValues.valores}
                  onChange={(e) => handleInputChange("valores", e.target.value)}
                  className="h-8"
                />
              ) : (
                <span className="text-base font-semibold">
                  {summaryData.valores > 0 ? `R$ ${summaryData.valores.toFixed(2)}` : "R$ -"}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      )}

      <AddTransactionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        transactionType={transactionType}
      />
    </Card>
  )
}


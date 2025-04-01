"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Edit2, Check, X, Upload, Plus, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PayrollSummary() {
  const [payrollItems, setPayrollItems] = useState([
    { code: 1, description: "HORAS NORMAIS", reference: "220.00", amount: 2501.65, type: "Entrada", editing: false },
    {
      code: 19,
      description: "DIFERENÇA DE SALÁRIOS",
      reference: "113.89",
      amount: 113.89,
      type: "Entrada",
      editing: false,
    },
    {
      code: 8125,
      description: "REFLEXO HORAS EXTRAS DSR",
      reference: "0.00",
      amount: 18.48,
      type: "Entrada",
      editing: false,
    },
    { code: 150, description: "HORAS EXTRAS", reference: "6:30", amount: 110.87, type: "Entrada", editing: false },
    { code: 9382, description: "DESC.VALE REFEIÇÃO", reference: "57.92", amount: 57.92, type: "Saída", editing: false },
    { code: 998, description: "I.N.S.S.", reference: "8.16", amount: 222.34, type: "Saída", editing: false },
    {
      code: 981,
      description: "DESC.ADIANT.SALARIAL",
      reference: "1000.66",
      amount: 1000.66,
      type: "Saída",
      editing: false,
    },
    {
      code: 8069,
      description: "HORAS FALTAS PARCIAL",
      reference: "1:53",
      amount: 21.38,
      type: "Saída",
      editing: false,
    },
  ])

  const [editValues, setEditValues] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importText, setImportText] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newItem, setNewItem] = useState({
    code: "",
    description: "",
    reference: "",
    amount: "",
    type: "Entrada",
  })

  const [vaInfo, setVaInfo] = useState({
    days: 20,
    dailyValue: 33.5,
    total: 670,
  })

  const [editingVa, setEditingVa] = useState(false)
  const [vaEditValues, setVaEditValues] = useState({
    days: "",
    dailyValue: "",
  })

  // Calculate totals
  const totalReceived = payrollItems
    .filter((item) => item.type === "Entrada")
    .reduce((sum, item) => sum + item.amount, 0)

  const totalDeduction = payrollItems
    .filter((item) => item.type === "Saída")
    .reduce((sum, item) => sum + item.amount, 0)

  const netPayment = totalReceived - totalDeduction + vaInfo.total

  const startEditing = () => {
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setIsEditing(false)

    // Reset all items editing state
    const updatedItems = payrollItems.map((item) => ({
      ...item,
      editing: false,
    }))

    setPayrollItems(updatedItems)
    setEditValues({})
  }

  const startEditingItem = (code) => {
    const updatedItems = payrollItems.map((item) => {
      if (item.code === code) {
        return { ...item, editing: true }
      }
      return { ...item, editing: false }
    })

    setPayrollItems(updatedItems)

    // Initialize edit values with current values
    const item = payrollItems.find((item) => item.code === code)
    setEditValues({
      reference: item.reference,
      amount: item.amount,
    })
  }

  const saveEditingItem = (code) => {
    const updatedItems = payrollItems.map((item) => {
      if (item.code === code) {
        return {
          ...item,
          reference: editValues.reference || item.reference,
          amount: Number.parseFloat(editValues.amount) || item.amount,
          editing: false,
        }
      }
      return item
    })

    setPayrollItems(updatedItems)
    setEditValues({})
  }

  const handleInputChange = (field, value) => {
    setEditValues({
      ...editValues,
      [field]: value,
    })
  }

  const handleNewItemChange = (field, value) => {
    setNewItem({
      ...newItem,
      [field]: value,
    })
  }

  const addNewItem = () => {
    if (newItem.code && newItem.description && newItem.amount) {
      const newPayrollItem = {
        code: Number.parseInt(newItem.code),
        description: newItem.description,
        reference: newItem.reference || "0",
        amount: Number.parseFloat(newItem.amount),
        type: newItem.type,
        editing: false,
      }

      setPayrollItems([...payrollItems, newPayrollItem])
      setNewItem({
        code: "",
        description: "",
        reference: "",
        amount: "",
        type: "Entrada",
      })
      setShowAddDialog(false)
    }
  }

  const deleteItem = (code) => {
    setPayrollItems(payrollItems.filter((item) => item.code !== code))
  }

  const startEditingVa = () => {
    setEditingVa(true)
    setVaEditValues({
      days: vaInfo.days.toString(),
      dailyValue: vaInfo.dailyValue.toString(),
    })
  }

  const saveEditingVa = () => {
    const days = Number.parseInt(vaEditValues.days) || vaInfo.days
    const dailyValue = Number.parseFloat(vaEditValues.dailyValue) || vaInfo.dailyValue
    const total = days * dailyValue

    setVaInfo({
      days,
      dailyValue,
      total,
    })

    setEditingVa(false)
  }

  const cancelEditingVa = () => {
    setEditingVa(false)
  }

  const handleVaInputChange = (field, value) => {
    setVaEditValues({
      ...vaEditValues,
      [field]: value,
    })
  }

  const importHolerite = () => {
    if (!importText.trim()) return

    try {
      // Parse the imported text
      const lines = importText.split("\n").filter((line) => line.trim())
      const newItems = []

      // Skip header lines and process data lines
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (line.includes("Código") || line.includes("TOTAL HOLERITE")) continue

        // Split by tabs or multiple spaces
        const parts = line.split(/\t+|\s{2,}/).filter((part) => part.trim())
        if (parts.length >= 5) {
          const code = Number.parseInt(parts[0])
          const description = parts[1]
          const reference = parts[2]
          const isEntrada = parts[3] && parts[3].trim() !== ""
          const amount = Number.parseFloat((isEntrada ? parts[3] : parts[4]).replace(".", "").replace(",", "."))

          if (!isNaN(code) && !isNaN(amount)) {
            newItems.push({
              code,
              description,
              reference,
              amount,
              type: isEntrada ? "Entrada" : "Saída",
              editing: false,
            })
          }
        }

        // Check for VA info
        if (line.includes("Va") && line.includes("Dias")) {
          const vaParts = line.split(/\s+/)
          const days = Number.parseInt(vaParts[2])
          const dailyValue = Number.parseFloat(vaParts[4].replace(",", "."))
          const total = Number.parseFloat(vaParts[7].replace(",", "."))

          if (!isNaN(days) && !isNaN(dailyValue) && !isNaN(total)) {
            setVaInfo({ days, dailyValue, total })
          }
        }
      }

      if (newItems.length > 0) {
        setPayrollItems(newItems)
      }

      setShowImportDialog(false)
      setImportText("")
    } catch (error) {
      console.error("Erro ao importar holerite:", error)
      alert("Erro ao processar o holerite. Verifique o formato e tente novamente.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Folha de Pagamento</CardTitle>
            <CardDescription>Resumo de holerite</CardDescription>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={cancelEditing}>
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}>
                  <Upload className="h-4 w-4 mr-1" />
                  Importar
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={startEditing}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Total Recebido</span>
              <span className="text-lg font-bold">R$ {totalReceived.toFixed(2)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Total de Desconto</span>
              <span className="text-lg font-bold text-red-500">R$ {totalDeduction.toFixed(2)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Pagamento a Receber</span>
              <span className="text-lg font-bold text-green-500">R$ {netPayment.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center p-2 border rounded-md mb-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">VA</span>
              {editingVa ? (
                <>
                  <span>Dias:</span>
                  <Input
                    type="number"
                    value={vaEditValues.days}
                    onChange={(e) => handleVaInputChange("days", e.target.value)}
                    className="w-16 h-8"
                  />
                  <span>x</span>
                  <Input
                    type="number"
                    step="0.01"
                    value={vaEditValues.dailyValue}
                    onChange={(e) => handleVaInputChange("dailyValue", e.target.value)}
                    className="w-20 h-8"
                  />
                </>
              ) : (
                <>
                  <span>
                    Dias: {vaInfo.days} x {vaInfo.dailyValue}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium">Total: R$ {vaInfo.total.toFixed(2)}</span>

              {isEditing &&
                (editingVa ? (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={saveEditingVa}>
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={cancelEditingVa}>
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={startEditingVa}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                ))}
            </div>
          </div>
        </div>

        <div className="border-t">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[80px]">Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Referência</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Tipo</TableHead>
                {isEditing && <TableHead className="w-[100px] text-right">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollItems.map((item) => (
                <TableRow key={item.code}>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">
                    {item.editing ? (
                      <Input
                        value={editValues.reference}
                        onChange={(e) => handleInputChange("reference", e.target.value)}
                        className="w-24 h-8 text-right ml-auto"
                      />
                    ) : (
                      item.reference
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.editing ? (
                      <Input
                        type="number"
                        value={editValues.amount}
                        onChange={(e) => handleInputChange("amount", e.target.value)}
                        className="w-24 h-8 text-right ml-auto"
                        step="0.01"
                      />
                    ) : (
                      `R$ ${item.amount.toFixed(2)}`
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={item.type === "Entrada" ? "text-green-500" : "text-red-500"}>{item.type}</span>
                  </TableCell>
                  {isEditing && (
                    <TableCell className="text-right">
                      {item.editing ? (
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => saveEditingItem(item.code)}
                          >
                            <Check className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={cancelEditing}>
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => startEditingItem(item.code)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteItem(item.code)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Importar Holerite</DialogTitle>
            <DialogDescription>
              Cole os dados do holerite no formato tabular para importação automática.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Label htmlFor="import-text">Dados do Holerite</Label>
            <textarea
              id="import-text"
              className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Cole os dados do holerite aqui..."
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={importHolerite}>Importar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Item Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Item</DialogTitle>
            <DialogDescription>Adicione um novo item à folha de pagamento.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="item-code">Código</Label>
                <Input
                  id="item-code"
                  type="number"
                  value={newItem.code}
                  onChange={(e) => handleNewItemChange("code", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="item-type">Tipo</Label>
                <Select value={newItem.type} onValueChange={(value) => handleNewItemChange("type", value)}>
                  <SelectTrigger id="item-type">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entrada">Entrada</SelectItem>
                    <SelectItem value="Saída">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="item-description">Descrição</Label>
              <Input
                id="item-description"
                value={newItem.description}
                onChange={(e) => handleNewItemChange("description", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="item-reference">Referência</Label>
                <Input
                  id="item-reference"
                  value={newItem.reference}
                  onChange={(e) => handleNewItemChange("reference", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="item-amount">Valor (R$)</Label>
                <Input
                  id="item-amount"
                  type="number"
                  step="0.01"
                  value={newItem.amount}
                  onChange={(e) => handleNewItemChange("amount", e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={addNewItem}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}


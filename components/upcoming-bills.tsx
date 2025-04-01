"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarClock, AlertCircle, Edit2, Check, X, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

export function UpcomingBills() {
  const [bills, setBills] = useState([
    {
      id: 1,
      name: "Aluguel",
      amount: 1000.0,
      dueDate: "05/04/2025",
      status: "pending",
      daysLeft: 5,
      editing: false,
    },
    {
      id: 2,
      name: "Internet",
      amount: 120.0,
      dueDate: "10/04/2025",
      status: "pending",
      daysLeft: 10,
      editing: false,
    },
    {
      id: 3,
      name: "Energia",
      amount: 230.0,
      dueDate: "15/04/2025",
      status: "pending",
      daysLeft: 15,
      editing: false,
    },
    {
      id: 4,
      name: "Cartão de Crédito",
      amount: 1500.0,
      dueDate: "20/04/2025",
      status: "pending",
      daysLeft: 20,
      editing: false,
    },
    {
      id: 5,
      name: "Água",
      amount: 80.0,
      dueDate: "25/04/2025",
      status: "pending",
      daysLeft: 25,
      editing: false,
    },
  ])

  const [editValues, setEditValues] = useState({
    name: "",
    amount: "",
    dueDate: null,
  })

  const [showAddForm, setShowAddForm] = useState(false)
  const [newBill, setNewBill] = useState({
    name: "",
    amount: "",
    dueDate: new Date(),
  })

  // Calculate total
  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0)

  const startEditing = (id) => {
    const updatedBills = bills.map((bill) => {
      if (bill.id === id) {
        setEditValues({
          name: bill.name,
          amount: bill.amount.toString(),
          dueDate: parseDate(bill.dueDate),
        })
        return { ...bill, editing: true }
      }
      return { ...bill, editing: false }
    })

    setBills(updatedBills)
    setShowAddForm(false)
  }

  const cancelEditing = () => {
    const updatedBills = bills.map((bill) => ({
      ...bill,
      editing: false,
    }))

    setBills(updatedBills)
    setEditValues({
      name: "",
      amount: "",
      dueDate: null,
    })
  }

  const saveEditing = (id) => {
    const updatedBills = bills.map((bill) => {
      if (bill.id === id) {
        const dueDate = editValues.dueDate ? formatDate(editValues.dueDate) : bill.dueDate
        // Calculate days left based on due date
        const dueDateObj = parseDate(dueDate)
        const today = new Date()
        const diffTime = dueDateObj.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        return {
          ...bill,
          name: editValues.name || bill.name,
          amount: Number.parseFloat(editValues.amount) || bill.amount,
          dueDate: dueDate,
          daysLeft: diffDays > 0 ? diffDays : 0,
          editing: false,
        }
      }
      return bill
    })

    setBills(updatedBills)
    setEditValues({
      name: "",
      amount: "",
      dueDate: null,
    })
  }

  const handleInputChange = (field, value) => {
    setEditValues({
      ...editValues,
      [field]: value,
    })
  }

  const handleNewBillChange = (field, value) => {
    setNewBill({
      ...newBill,
      [field]: value,
    })
  }

  const addNewBill = () => {
    if (newBill.name && newBill.amount && newBill.dueDate) {
      // Calculate days left based on due date
      const today = new Date()
      const diffTime = newBill.dueDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      const newBillItem = {
        id: Date.now(), // Use timestamp as unique ID
        name: newBill.name,
        amount: Number.parseFloat(newBill.amount),
        dueDate: formatDate(newBill.dueDate),
        status: "pending",
        daysLeft: diffDays > 0 ? diffDays : 0,
        editing: false,
      }

      setBills([...bills, newBillItem])
      setNewBill({
        name: "",
        amount: "",
        dueDate: new Date(),
      })
      setShowAddForm(false)
    }
  }

  const deleteBill = (id) => {
    setBills(bills.filter((bill) => bill.id !== id))
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

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Contas a Pagar</CardTitle>
            <CardDescription>Próximos 30 dias</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-muted-foreground" />
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
        </div>
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <div className="mb-4 p-3 border rounded-md bg-muted/20">
            <h3 className="text-sm font-medium mb-2">Nova Conta</h3>
            <div className="space-y-2">
              <div>
                <Input
                  placeholder="Nome da conta"
                  value={newBill.name}
                  onChange={(e) => handleNewBillChange("name", e.target.value)}
                  className="h-8"
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Valor (R$)"
                  value={newBill.amount}
                  onChange={(e) => handleNewBillChange("amount", e.target.value)}
                  className="h-8"
                />
              </div>
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-start text-left font-normal h-8">
                      {newBill.dueDate ? formatDate(newBill.dueDate) : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newBill.dueDate}
                      onSelect={(date) => handleNewBillChange("dueDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
                <Button size="sm" onClick={addNewBill}>
                  Adicionar
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {bills.map((bill) => (
            <div key={bill.id} className="flex items-center justify-between border-b pb-2 last:border-0">
              {bill.editing ? (
                <div className="flex-1 pr-2">
                  <Input
                    value={editValues.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mb-1 h-7"
                  />
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={editValues.amount}
                      onChange={(e) => handleInputChange("amount", e.target.value)}
                      className="h-7 w-24"
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7">
                          {editValues.dueDate ? formatDate(editValues.dueDate) : bill.dueDate}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={editValues.dueDate}
                          onSelect={(date) => handleInputChange("dueDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="font-medium">{bill.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Vencimento: {bill.dueDate}
                    {bill.dueDate === "20/04/2025" && (
                      <span className="ml-1 text-amber-500 font-medium">(Prioridade)</span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-1">
                {bill.editing ? (
                  <>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => saveEditing(bill.id)}>
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={cancelEditing}>
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteBill(bill.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-end">
                    <div className="font-bold">R$ {bill.amount.toFixed(2)}</div>
                    <div className="flex items-center gap-2">
                      {bill.daysLeft <= 7 ? (
                        <div className="flex items-center text-xs text-red-500">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {bill.daysLeft} dias
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">{bill.daysLeft} dias</div>
                      )}
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => startEditing(bill.id)}>
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-md bg-muted p-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total a pagar:</span>
            <span className="font-bold">R$ {totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


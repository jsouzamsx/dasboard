"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function AddTransactionDialog({ isOpen, onClose, transactionType }) {
  const [date, setDate] = useState(new Date())
  const [description, setDescription] = useState("")
  const [value, setValue] = useState("")
  const [category, setCategory] = useState("")

  const categories = transactionType === "Entrada" ? ["Cartão", "Diversos", "Valores"] : ["Sistema", "Saída"]

  const handleSubmit = (e) => {
    e.preventDefault()

    // Here you would typically save the transaction to your data store
    const newTransaction = {
      date: formatDateToPtBr(date),
      type: transactionType,
      description,
      value: Number.parseFloat(value),
      category,
    }

    console.log("New transaction:", newTransaction)

    // Reset form and close dialog
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setDate(new Date())
    setDescription("")
    setValue("")
    setCategory("")
  }

  const formatDateToPtBr = (date) => {
    const dayOfWeek = format(date, "EEEE", { locale: ptBR })
    const month = format(date, "MMMM", { locale: ptBR })
    const day = format(date, "d", { locale: ptBR })
    const year = format(date, "yyyy", { locale: ptBR })

    return `${dayOfWeek}, ${month} ${day}, ${year}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{transactionType === "Entrada" ? "Adicionar Entrada" : "Adicionar Saída"}</DialogTitle>
          <DialogDescription>Preencha os detalhes da {transactionType.toLowerCase()} abaixo.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="date">Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Salário, Aluguel, etc."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="value">Valor (R$)</Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              min="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0,00"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className={
                transactionType === "Entrada" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
              }
            >
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


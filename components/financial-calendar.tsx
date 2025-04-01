"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"

export function FinancialCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Exemplo de eventos financeiros
  const financialEvents = [
    { date: new Date(2025, 3, 5), description: "Pagamento de Aluguel", amount: -1200 },
    { date: new Date(2025, 3, 10), description: "Recebimento de Salário", amount: 5800 },
    { date: new Date(2025, 3, 15), description: "Fatura do Cartão", amount: -1500 },
    { date: new Date(2025, 3, 20), description: "Dividendos", amount: 350 },
  ]

  // Filtrar eventos para a data selecionada
  const selectedDateEvents = financialEvents.filter(
    (event) => date && event.date.toDateString() === date.toDateString(),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendário Financeiro</CardTitle>
        <CardDescription>Acompanhe suas receitas e despesas programadas</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
        </div>
        <div className="md:w-1/2">
          <h3 className="font-medium mb-4">
            {date
              ? date.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })
              : "Selecione uma data"}
          </h3>
          {selectedDateEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedDateEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                  <span>{event.description}</span>
                  <span className={`font-medium ${event.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                    {event.amount > 0 ? "+" : ""}
                    {event.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhum evento financeiro para esta data.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function BudgetPlanner() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Orçamento Mensal</CardTitle>
        <CardDescription>Planeje seus gastos mensais</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Orçamento Total</p>
              <p className="text-2xl font-bold">R$ 4.200</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Restante</p>
              <p className="text-lg font-semibold text-green-500">R$ 1.000</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-md bg-muted/50 p-2">
            <span>Moradia</span>
            <span className="font-medium">R$ 1.500</span>
          </div>
          <div className="flex items-center justify-between rounded-md bg-muted/50 p-2">
            <span>Alimentação</span>
            <span className="font-medium">R$ 1.000</span>
          </div>
          <div className="flex items-center justify-between rounded-md bg-muted/50 p-2">
            <span>Transporte</span>
            <span className="font-medium">R$ 500</span>
          </div>
          <div className="flex items-center justify-between rounded-md bg-muted/50 p-2">
            <span>Lazer</span>
            <span className="font-medium">R$ 400</span>
          </div>
        </div>
        <Button variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Categoria
        </Button>
      </CardContent>
    </Card>
  )
}


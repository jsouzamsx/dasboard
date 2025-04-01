import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp } from "lucide-react"

export function FinancialOverview() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Visão Geral</CardTitle>
        <CardDescription>Resumo da sua situação financeira atual</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Saldo Total</span>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">R$ 12.500</span>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Patrimônio Líquido</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">R$ 45.200</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Receitas</span>
            <div className="flex items-center gap-1">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <span className="text-xl font-semibold">R$ 5.800</span>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Despesas</span>
            <div className="flex items-center gap-1">
              <ArrowDownRight className="h-4 w-4 text-red-500" />
              <span className="text-xl font-semibold">R$ 3.200</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


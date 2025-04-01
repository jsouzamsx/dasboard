import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function ExpenseTracker() {
  const categories = [
    { name: "Moradia", amount: 1200, total: 1500, color: "bg-blue-500" },
    { name: "Alimentação", amount: 800, total: 1000, color: "bg-green-500" },
    { name: "Transporte", amount: 400, total: 500, color: "bg-yellow-500" },
    { name: "Lazer", amount: 300, total: 400, color: "bg-purple-500" },
    { name: "Outros", amount: 500, total: 800, color: "bg-gray-500" },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Despesas por Categoria</CardTitle>
        <CardDescription>Acompanhe seus gastos mensais</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category) => (
          <div key={category.name} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{category.name}</span>
              <span className="text-sm text-muted-foreground">
                R$ {category.amount} / R$ {category.total}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={(category.amount / category.total) * 100} className={`h-2 ${category.color}`} />
              <span className="text-xs text-muted-foreground">
                {Math.round((category.amount / category.total) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}


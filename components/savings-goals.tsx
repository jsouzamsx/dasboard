import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function SavingsGoals() {
  const goals = [
    { name: "Viagem", current: 3000, target: 5000, date: "Dez 2025" },
    { name: "Reserva de Emergência", current: 8000, target: 15000, date: "Jun 2026" },
    { name: "Novo Carro", current: 12000, target: 40000, date: "Jan 2027" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metas de Economia</CardTitle>
        <CardDescription>Acompanhe o progresso das suas metas financeiras</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {goals.map((goal) => (
          <div key={goal.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{goal.name}</h4>
                <p className="text-sm text-muted-foreground">Meta: {goal.date}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  R$ {goal.current} <span className="text-muted-foreground">/ R$ {goal.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {Math.round((goal.current / goal.target) * 100)}% concluído
                </p>
              </div>
            </div>
            <Progress value={(goal.current / goal.target) * 100} className="h-2" />
          </div>
        ))}
        <Button variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Nova Meta
        </Button>
      </CardContent>
    </Card>
  )
}


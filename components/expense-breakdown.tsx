import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ExpenseBreakdown() {
  // Dados de exemplo para o gráfico
  const expenseData = [
    { name: "Moradia", value: 1270, color: "#3b82f6" },
    { name: "Alimentação", value: 320, color: "#10b981" },
    { name: "Transporte", value: 150, color: "#f59e0b" },
    { name: "Lazer", value: 100, color: "#8b5cf6" },
    { name: "Outros", value: 61, color: "#6b7280" },
  ]

  const incomeData = [
    { name: "Salário", value: 1500, color: "#3b82f6" },
    { name: "Freelance", value: 400, color: "#10b981" },
    { name: "Investimentos", value: 51, color: "#f59e0b" },
  ]

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Análise Financeira</CardTitle>
        <CardDescription>Distribuição de receitas e despesas</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="expenses">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expenses">Despesas</TabsTrigger>
            <TabsTrigger value="income">Receitas</TabsTrigger>
          </TabsList>
          <TabsContent value="expenses" className="mt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`R$ ${value}`, "Valor"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-md bg-muted p-2">
                <div className="text-sm font-medium">Total de Despesas</div>
                <div className="text-xl font-bold text-red-500">R$ 1.901,00</div>
              </div>
              <div className="rounded-md bg-muted p-2">
                <div className="text-sm font-medium">Maior Categoria</div>
                <div className="text-xl font-bold">Moradia</div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="income" className="mt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`R$ ${value}`, "Valor"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-md bg-muted p-2">
                <div className="text-sm font-medium">Total de Receitas</div>
                <div className="text-xl font-bold text-green-500">R$ 1.951,00</div>
              </div>
              <div className="rounded-md bg-muted p-2">
                <div className="text-sm font-medium">Maior Fonte</div>
                <div className="text-xl font-bold">Salário</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}


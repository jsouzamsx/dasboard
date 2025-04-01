import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export function InvestmentPortfolio() {
  const investments = [
    { name: "Ações", value: 15000, color: "#3b82f6" },
    { name: "Renda Fixa", value: 20000, color: "#10b981" },
    { name: "Fundos Imobiliários", value: 8000, color: "#f59e0b" },
    { name: "Criptomoedas", value: 2200, color: "#8b5cf6" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfólio de Investimentos</CardTitle>
        <CardDescription>Distribuição dos seus investimentos</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={investments}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {investments.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`R$ ${value}`, "Valor"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}


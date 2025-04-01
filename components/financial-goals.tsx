"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Target, Edit2, Check, X, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function FinancialGoals() {
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: "Reserva de Emergência",
      current: 3500,
      target: 10000,
      percentage: 35,
      deadline: "Dezembro 2025",
      deadlineDate: new Date(2025, 11, 31),
      editing: false,
    },
    {
      id: 2,
      name: "Viagem de Férias",
      current: 2800,
      target: 5000,
      percentage: 56,
      deadline: "Julho 2025",
      deadlineDate: new Date(2025, 6, 31),
      editing: false,
    },
    {
      id: 3,
      name: "Novo Notebook",
      current: 1200,
      target: 4000,
      percentage: 30,
      deadline: "Setembro 2025",
      deadlineDate: new Date(2025, 8, 30),
      editing: false,
    },
  ])

  const [editValues, setEditValues] = useState({
    name: "",
    current: "",
    target: "",
    deadlineDate: null,
  })

  const [showAddForm, setShowAddForm] = useState(false)
  const [newGoal, setNewGoal] = useState({
    name: "",
    current: "",
    target: "",
    deadlineDate: new Date(),
  })

  // Calculate total saved
  const totalSaved = goals.reduce((sum, goal) => sum + goal.current, 0)

  const startEditing = (id) => {
    const updatedGoals = goals.map((goal) => {
      if (goal.id === id) {
        setEditValues({
          name: goal.name,
          current: goal.current.toString(),
          target: goal.target.toString(),
          deadlineDate: goal.deadlineDate,
        })
        return { ...goal, editing: true }
      }
      return { ...goal, editing: false }
    })

    setGoals(updatedGoals)
    setShowAddForm(false)
  }

  const cancelEditing = () => {
    const updatedGoals = goals.map((goal) => ({
      ...goal,
      editing: false,
    }))

    setGoals(updatedGoals)
    setEditValues({
      name: "",
      current: "",
      target: "",
      deadlineDate: null,
    })
  }

  const saveEditing = (id) => {
    const updatedGoals = goals.map((goal) => {
      if (goal.id === id) {
        const current = Number.parseFloat(editValues.current) || goal.current
        const target = Number.parseFloat(editValues.target) || goal.target
        const percentage = Math.round((current / target) * 100)
        const deadlineDate = editValues.deadlineDate || goal.deadlineDate
        const deadline = formatDeadline(deadlineDate)

        return {
          ...goal,
          name: editValues.name || goal.name,
          current: current,
          target: target,
          percentage: percentage,
          deadline: deadline,
          deadlineDate: deadlineDate,
          editing: false,
        }
      }
      return goal
    })

    setGoals(updatedGoals)
    setEditValues({
      name: "",
      current: "",
      target: "",
      deadlineDate: null,
    })
  }

  const handleInputChange = (field, value) => {
    setEditValues({
      ...editValues,
      [field]: value,
    })
  }

  const handleNewGoalChange = (field, value) => {
    setNewGoal({
      ...newGoal,
      [field]: value,
    })
  }

  const addNewGoal = () => {
    if (newGoal.name && newGoal.target && newGoal.deadlineDate) {
      const current = Number.parseFloat(newGoal.current) || 0
      const target = Number.parseFloat(newGoal.target)
      const percentage = Math.round((current / target) * 100)

      const newGoalItem = {
        id: Date.now(), // Use timestamp as unique ID
        name: newGoal.name,
        current: current,
        target: target,
        percentage: percentage,
        deadline: formatDeadline(newGoal.deadlineDate),
        deadlineDate: newGoal.deadlineDate,
        editing: false,
      }

      setGoals([...goals, newGoalItem])
      setNewGoal({
        name: "",
        current: "",
        target: "",
        deadlineDate: new Date(),
      })
      setShowAddForm(false)
    }
  }

  const deleteGoal = (id) => {
    setGoals(goals.filter((goal) => goal.id !== id))
  }

  // Helper function to format deadline
  const formatDeadline = (date) => {
    const month = format(date, "MMMM", { locale: ptBR })
    const year = format(date, "yyyy")
    return `${month} ${year}`
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Metas Financeiras</CardTitle>
            <CardDescription>Progresso das suas metas</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-muted-foreground" />
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
            <h3 className="text-sm font-medium mb-2">Nova Meta</h3>
            <div className="space-y-2">
              <div>
                <Input
                  placeholder="Nome da meta"
                  value={newGoal.name}
                  onChange={(e) => handleNewGoalChange("name", e.target.value)}
                  className="h-8"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Valor atual (R$)"
                  value={newGoal.current}
                  onChange={(e) => handleNewGoalChange("current", e.target.value)}
                  className="h-8"
                />
                <Input
                  type="number"
                  placeholder="Valor alvo (R$)"
                  value={newGoal.target}
                  onChange={(e) => handleNewGoalChange("target", e.target.value)}
                  className="h-8"
                />
              </div>
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-start text-left font-normal h-8">
                      {newGoal.deadlineDate ? formatDeadline(newGoal.deadlineDate) : "Prazo"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newGoal.deadlineDate}
                      onSelect={(date) => handleNewGoalChange("deadlineDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
                <Button size="sm" onClick={addNewGoal}>
                  Adicionar
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              {goal.editing ? (
                <div className="p-2 border rounded-md bg-muted/20">
                  <Input
                    value={editValues.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mb-2 h-7"
                  />
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <Input
                      type="number"
                      placeholder="Valor atual"
                      value={editValues.current}
                      onChange={(e) => handleInputChange("current", e.target.value)}
                      className="h-7"
                    />
                    <Input
                      type="number"
                      placeholder="Valor alvo"
                      value={editValues.target}
                      onChange={(e) => handleInputChange("target", e.target.value)}
                      className="h-7"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7">
                          {editValues.deadlineDate ? formatDeadline(editValues.deadlineDate) : goal.deadline}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={editValues.deadlineDate}
                          onSelect={(date) => handleInputChange("deadlineDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => saveEditing(goal.id)}>
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={cancelEditing}>
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteGoal(goal.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="font-medium">{goal.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">{goal.deadline}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => startEditing(goal.id)}>
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={goal.percentage} className="h-2" />
                    <span className="text-xs font-medium">{goal.percentage}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>R$ {goal.current.toLocaleString("pt-BR")}</span>
                    <span className="text-muted-foreground">de R$ {goal.target.toLocaleString("pt-BR")}</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-md bg-muted p-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total economizado:</span>
            <span className="font-bold">R$ {totalSaved.toLocaleString("pt-BR")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


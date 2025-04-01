"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock } from "lucide-react"

export function DateTimeDisplay() {
  const [dateTime, setDateTime] = useState(new Date())

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setDateTime(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  // Format date as "DD/MM/YYYY"
  const formattedDate = dateTime.toLocaleDateString("pt-BR")

  // Get day of week in Portuguese
  const daysOfWeek = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ]
  const dayOfWeek = daysOfWeek[dateTime.getDay()]

  // Format time as "HH:MM:SS"
  const formattedTime = dateTime.toLocaleTimeString("pt-BR")

  return (
    <div className="hidden md:flex flex-col items-end text-sm">
      <div className="flex items-center gap-1">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span>{formattedDate}</span>
        <span className="text-muted-foreground">({dayOfWeek})</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span>{formattedTime}</span>
      </div>
    </div>
  )
}


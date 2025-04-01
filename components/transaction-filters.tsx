"use client"

import { useState } from "react"
import { Search, Calendar, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function TransactionFilters({ onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [transactionType, setTransactionType] = useState("")
  const [category, setCategory] = useState("")
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [minValue, setMinValue] = useState("")
  const [maxValue, setMaxValue] = useState("")
  const [activeFilters, setActiveFilters] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const categories = ["Sistema", "Cartão", "Diversos", "Valores", "Saída"]

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    updateFilters("search", e.target.value)
  }

  const handleTypeChange = (value) => {
    setTransactionType(value)
    updateFilters("type", value)
  }

  const handleCategoryChange = (value) => {
    setCategory(value)
    updateFilters("category", value)
  }

  const handleDateChange = (date, isStart = true) => {
    if (isStart) {
      setStartDate(date)
      updateFilters("startDate", date)
    } else {
      setEndDate(date)
      updateFilters("endDate", date)
    }
  }

  const handleValueChange = (value, isMin = true) => {
    if (isMin) {
      setMinValue(value)
      updateFilters("minValue", value)
    } else {
      setMaxValue(value)
      updateFilters("maxValue", value)
    }
  }

  const updateFilters = (filterType, value) => {
    // Remove existing filter of the same type
    const updatedFilters = activeFilters.filter((filter) => filter.type !== filterType)

    // Add new filter if value is not empty
    if (value) {
      updatedFilters.push({ type: filterType, value })
    }

    setActiveFilters(updatedFilters)

    // Call the parent component's filter handler
    if (onFilterChange) {
      const filterObject = {
        search: searchTerm,
        type: transactionType,
        category: category,
        startDate: startDate,
        endDate: endDate,
        minValue: minValue ? Number.parseFloat(minValue) : null,
        maxValue: maxValue ? Number.parseFloat(maxValue) : null,
        ...updatedFilters.reduce((acc, filter) => {
          acc[filter.type] = filter.value
          return acc
        }, {}),
      }

      onFilterChange(filterObject)
    }
  }

  const removeFilter = (filterType) => {
    const updatedFilters = activeFilters.filter((filter) => filter.type !== filterType)
    setActiveFilters(updatedFilters)

    // Reset the corresponding state
    switch (filterType) {
      case "search":
        setSearchTerm("")
        break
      case "type":
        setTransactionType("")
        break
      case "category":
        setCategory("")
        break
      case "startDate":
        setStartDate(null)
        break
      case "endDate":
        setEndDate(null)
        break
      case "minValue":
        setMinValue("")
        break
      case "maxValue":
        setMaxValue("")
        break
    }

    // Call the parent component's filter handler with updated filters
    if (onFilterChange) {
      const filterObject = {
        search: filterType === "search" ? "" : searchTerm,
        type: filterType === "type" ? "" : transactionType,
        category: filterType === "category" ? "" : category,
        startDate: filterType === "startDate" ? null : startDate,
        endDate: filterType === "endDate" ? null : endDate,
        minValue: filterType === "minValue" ? null : minValue ? Number.parseFloat(minValue) : null,
        maxValue: filterType === "maxValue" ? null : maxValue ? Number.parseFloat(maxValue) : null,
      }

      onFilterChange(filterObject)
    }
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setTransactionType("")
    setCategory("")
    setStartDate(null)
    setEndDate(null)
    setMinValue("")
    setMaxValue("")
    setActiveFilters([])

    if (onFilterChange) {
      onFilterChange({})
    }
  }

  const getFilterLabel = (filter) => {
    switch (filter.type) {
      case "search":
        return `Busca: ${filter.value}`
      case "type":
        return `Tipo: ${filter.value}`
      case "category":
        return `Categoria: ${filter.value}`
      case "startDate":
        return `A partir de: ${format(filter.value, "dd/MM/yyyy", { locale: ptBR })}`
      case "endDate":
        return `Até: ${format(filter.value, "dd/MM/yyyy", { locale: ptBR })}`
      case "minValue":
        return `Valor mín: R$ ${filter.value}`
      case "maxValue":
        return `Valor máx: R$ ${filter.value}`
      default:
        return ""
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar transações..." className="pl-8" value={searchTerm} onChange={handleSearch} />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={transactionType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Entrada">Entrada</SelectItem>
              <SelectItem value="Saída">Saída</SelectItem>
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" className="w-[140px]" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <Filter className="mr-2 h-4 w-4" />
            Mais Filtros
          </Button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md bg-muted/10">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Período</h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm w-16">De:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      {startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => handleDateChange(date, true)}
                      disabled={(date) => endDate && date > endDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm w-16">Até:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      {endDate ? format(endDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => handleDateChange(date, false)}
                      disabled={(date) => startDate && date < startDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Faixa de Valor</h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm w-16">Mínimo:</span>
                <Input
                  type="number"
                  placeholder="R$ 0,00"
                  value={minValue}
                  onChange={(e) => handleValueChange(e.target.value, true)}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm w-16">Máximo:</span>
                <Input
                  type="number"
                  placeholder="R$ 0,00"
                  value={maxValue}
                  onChange={(e) => handleValueChange(e.target.value, false)}
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(false)}>
              Aplicar Filtros
            </Button>
          </div>
        </div>
      )}

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-2 border-t">
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          {activeFilters.map((filter, index) => (
            <Badge key={index} variant="outline" className="flex items-center gap-1">
              {getFilterLabel(filter)}
              <button className="ml-1 rounded-full hover:bg-muted p-0.5" onClick={() => removeFilter(filter.type)}>
                <span className="sr-only">Remover</span>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-7 text-xs">
            Limpar todos
          </Button>
        </div>
      )}
    </div>
  )
}


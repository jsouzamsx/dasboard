import { Button } from "@/components/ui/button"
import { PlusCircle, FileText, Download, Upload, BarChart4 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function QuickActions() {
  return (
    <div className="flex gap-2">
      <Button size="sm" className="bg-primary">
        <PlusCircle className="h-4 w-4 mr-2" />
        Nova Transação
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Ações Rápidas
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações Financeiras</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <FileText className="h-4 w-4 mr-2" />
            Gerar Relatório
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Download className="h-4 w-4 mr-2" />
            Exportar Dados
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Upload className="h-4 w-4 mr-2" />
            Importar Transações
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BarChart4 className="h-4 w-4 mr-2" />
            Análise Financeira
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}


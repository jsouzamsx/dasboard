import { FileSpreadsheet, Bell, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DateTimeDisplay } from "@/components/date-time-display"

export function FinancialHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-6 w-6" />
          <h2 className="text-xl font-bold">Planilha Financeira</h2>
        </div>
        <div className="flex items-center gap-4">
          <DateTimeDisplay />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notificações</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Configurações</span>
          </Button>
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}


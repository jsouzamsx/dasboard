import { FinancialHeader } from "@/components/financial-header"
import { TransactionTable } from "@/components/transaction-table"
import { FinancialSummary } from "@/components/financial-summary"
import { PayrollSummary } from "@/components/payroll-summary"
import { MonthlyOverview } from "@/components/monthly-overview"
import { UpcomingBills } from "@/components/upcoming-bills"
import { FinancialGoals } from "@/components/financial-goals"
import { ExpenseBreakdown } from "@/components/expense-breakdown"
import { QuickActions } from "@/components/quick-actions"

export default function FinancialTracker() {
  return (
    <div className="flex min-h-screen flex-col">
      <FinancialHeader />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold">Controle Financeiro</h1>
            <QuickActions />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FinancialSummary />
            <PayrollSummary />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <MonthlyOverview />
            </div>
            <div>
              <UpcomingBills />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <ExpenseBreakdown />
            </div>
            <div>
              <FinancialGoals />
            </div>
          </div>

          <div className="rounded-md border bg-card">
            <TransactionTable />
          </div>
        </div>
      </main>
    </div>
  )
}


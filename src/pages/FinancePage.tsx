import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import { financeService } from '@/services/finance'
import type { TransactionType, TransactionStatus } from '@/types/database.types'
import {
  PlusIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import TransactionForm from '@/components/finance/TransactionForm'
import TransactionList from '@/components/finance/TransactionList'

interface DashboardStats {
  totalIncome: number
  totalExpenses: number
  balance: number
  paidIncome: number
  pendingIncome: number
  overdueIncome: number
  incomeByCategory: Record<string, number>
  expensesByCategory: Record<string, number>
  transactionsCount: number
}

export default function FinancePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<TransactionStatus | 'all'>('all')
  const [dateRange, setDateRange] = useState<'month' | 'year' | 'all'>('month')

  const loadStats = async () => {
    try {
      setLoading(true)
      let startDate: string | undefined
      let endDate: string | undefined

      if (dateRange === 'month') {
        const now = new Date()
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()
      } else if (dateRange === 'year') {
        const now = new Date()
        startDate = new Date(now.getFullYear(), 0, 1).toISOString()
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59).toISOString()
      }

      const data = await financeService.getDashboardStats(startDate, endDate)
      setStats(data)
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [dateRange])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const handleTransactionSaved = () => {
    setIsModalOpen(false)
    loadStats()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as 'month' | 'year' | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="month">Este Mês</option>
            <option value="year">Este Ano</option>
            <option value="all">Todo Período</option>
          </select>
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusIcon className="w-5 h-5 mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Dashboard Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Receitas */}
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Receitas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(stats.totalIncome)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            {/* Despesas */}
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Despesas</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(stats.totalExpenses)}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <ArrowTrendingDownIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </Card>

            {/* Saldo */}
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Saldo</p>
                  <p
                    className={`text-2xl font-bold ${
                      stats.balance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {formatCurrency(stats.balance)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            {/* A Receber */}
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">A Receber</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {formatCurrency(stats.pendingIncome)}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <ClockIcon className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Cards Secundários */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Recebido */}
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Recebido</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatCurrency(stats.paidIncome)}
                  </p>
                </div>
                <div className="text-green-600">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </Card>

            {/* Atrasado */}
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Atrasado</p>
                  <p className="text-xl font-semibold text-red-600">
                    {formatCurrency(stats.overdueIncome)}
                  </p>
                </div>
                <div className="text-red-600">
                  <ExclamationTriangleIcon className="w-8 h-8" />
                </div>
              </div>
            </Card>

            {/* Total de Transações */}
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Transações</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {stats.transactionsCount}
                  </p>
                </div>
                <div className="text-primary-600">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </Card>
          </div>
        </>
      ) : null}

      {/* Lista de Transações */}
      <Card>
        <div className="mb-4 flex gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as TransactionType | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Todos os Tipos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as TransactionStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Todos os Status</option>
            <option value="paid">Pago</option>
            <option value="pending">Pendente</option>
            <option value="overdue">Atrasado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>

        <TransactionList
          filterType={filterType === 'all' ? undefined : filterType}
          filterStatus={filterStatus === 'all' ? undefined : filterStatus}
          onUpdate={loadStats}
        />
      </Card>

      {/* Modal de Nova Transação */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Transação"
      >
        <TransactionForm onSave={handleTransactionSaved} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  )
}

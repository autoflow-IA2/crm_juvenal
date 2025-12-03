import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import { clientsService } from '@/services/clients'
import { appointmentsService } from '@/services/appointments'
import { financeService } from '@/services/finance'
import {
  UserGroupIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

interface DashboardStats {
  totalClients: number
  sessionsToday: number
  monthlyRevenue: number
  upcomingSessions: number
}

interface TodayAppointment {
  id: string
  date: string
  clients: {
    name: string
  }
  type: string
  status: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    sessionsToday: 0,
    monthlyRevenue: 0,
    upcomingSessions: 0,
  })
  const [todayAppointments, setTodayAppointments] = useState<TodayAppointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Buscar total de clientes
      const clients = await clientsService.getAll()
      const totalClients = clients.length

      // Buscar sessões de hoje
      const today = new Date()
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()
      const todayAppts = await appointmentsService.getByDateRange(startOfDay, endOfDay)
      const sessionsToday = todayAppts.length

      // Buscar receita mensal
      const now = new Date()
      const monthlyReport = await financeService.getMonthlyReport(
        now.getFullYear(),
        now.getMonth() + 1
      )
      const monthlyRevenue = monthlyReport.totalIncome

      // Buscar próximas sessões (próximos 7 dias)
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)
      const upcoming = await appointmentsService.getUpcoming(10)
      const upcomingSessions = upcoming.length

      setStats({
        totalClients,
        sessionsToday,
        monthlyRevenue,
        upcomingSessions,
      })

      setTodayAppointments(todayAppts as any)
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getSessionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      individual_therapy: 'Terapia Individual',
      coaching: 'Coaching',
      couples_therapy: 'Terapia de Casais',
      group_session: 'Sessão em Grupo',
      first_consultation: 'Primeira Consulta',
      follow_up: 'Acompanhamento',
    }
    return labels[type] || type
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-red-100 text-red-800',
    }

    const labels: Record<string, string> = {
      scheduled: 'Agendado',
      confirmed: 'Confirmado',
      in_progress: 'Em Progresso',
      completed: 'Concluído',
      cancelled: 'Cancelado',
      no_show: 'Faltou',
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Bem-vindo ao Juvenal CRM</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Bem-vindo ao Juvenal CRM</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total de Clientes</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalClients}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserGroupIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Sessões Hoje</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.sessionsToday}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Receita Mensal</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(stats.monthlyRevenue)}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Próximas Sessões</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.upcomingSessions}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sessões de Hoje</h2>
        {todayAppointments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhuma sessão agendada para hoje</p>
        ) : (
          <div className="space-y-3">
            {todayAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg">
                    <CalendarIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{appointment.clients.name}</p>
                    <p className="text-sm text-gray-600">{getSessionTypeLabel(appointment.type)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-900">
                    {formatTime(appointment.date)}
                  </span>
                  {getStatusBadge(appointment.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

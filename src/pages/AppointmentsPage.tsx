import { useState, useEffect } from 'react'
import { PlusIcon, CalendarIcon, ListBulletIcon } from '@heroicons/react/24/outline'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { appointmentsService } from '@/services/appointments'
import { clientsService } from '@/services/clients'
import type { Database } from '@/types/database.types'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Calendar from '@/components/appointments/Calendar'
import AppointmentForm from '@/components/appointments/AppointmentForm'

type Client = Database['public']['Tables']['clients']['Row']

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
  no_show: 'bg-red-200 text-red-900',
}

const statusLabels: Record<string, string> = {
  scheduled: 'Agendado',
  confirmed: 'Confirmado',
  in_progress: 'Em Andamento',
  completed: 'Concluído',
  cancelled: 'Cancelado',
  no_show: 'Faltou',
}

const sessionTypeLabels: Record<string, string> = {
  individual_therapy: 'Terapia Individual',
  coaching: 'Coaching',
  couples_therapy: 'Terapia de Casal',
  group_session: 'Sessão em Grupo',
  first_consultation: 'Primeira Consulta',
  follow_up: 'Retorno',
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'calendar' | 'list'>('calendar')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [appointmentsData, clientsData] = await Promise.all([
        appointmentsService.getAll(),
        clientsService.getAll(),
      ])
      setAppointments(appointmentsData)
      setClients(clientsData)
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = (date?: Date) => {
    setSelectedAppointment(null)
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  const handleEdit = (appointment: any) => {
    setSelectedAppointment(appointment)
    setSelectedDate(undefined)
    setIsModalOpen(true)
  }

  const handleSubmit = async (data: any) => {
    try {
      if (selectedAppointment) {
        await appointmentsService.update(selectedAppointment.id, data)
      } else {
        await appointmentsService.create(data)
      }
      setIsModalOpen(false)
      setSelectedAppointment(null)
      setSelectedDate(undefined)
      await loadData()
    } catch (error) {
      throw error
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      return
    }

    try {
      await appointmentsService.delete(id)
      await loadData()
    } catch (error: any) {
      console.error('Erro ao excluir agendamento:', error)
      alert('Erro ao excluir agendamento: ' + error.message)
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await appointmentsService.updateStatus(id, status as any)
      await loadData()
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-gray-600 mt-1">{appointments.length} agendamentos</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('calendar')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                view === 'calendar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CalendarIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                view === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ListBulletIcon className="h-5 w-5" />
            </button>
          </div>
          <Button onClick={() => handleCreate()}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      {view === 'calendar' && (
        <Calendar
          appointments={appointments}
          onDateClick={(date) => handleCreate(date)}
          onAppointmentClick={(apt) => handleEdit(apt)}
        />
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum agendamento</h3>
                <p className="mt-1 text-sm text-gray-500">Comece criando um novo agendamento</p>
                <div className="mt-6">
                  <Button onClick={() => handleCreate()}>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Novo Agendamento
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            appointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.clients?.full_name || 'Cliente não encontrado'}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[appointment.appointment_status]}`}>
                        {statusLabels[appointment.appointment_status]}
                      </span>
                      {appointment.is_pro_bono && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                          Pro Bono
                        </span>
                      )}
                      {appointment.payment_status === 'paid' && !appointment.is_pro_bono && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Pago
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Data:</span>{' '}
                        {format(parseISO(appointment.date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                          locale: ptBR,
                        })}
                      </p>
                      <p>
                        <span className="font-medium">Duração:</span> {appointment.duration} minutos
                      </p>
                      <p>
                        <span className="font-medium">Tipo:</span>{' '}
                        {sessionTypeLabels[appointment.session_type] || appointment.session_type}
                      </p>
                      <p>
                        <span className="font-medium">Valor:</span>{' '}
                        {appointment.is_pro_bono ? (
                          <span className="text-purple-600 font-medium">Gratuito</span>
                        ) : (
                          `R$ ${appointment.price.toFixed(2)}`
                        )}
                      </p>
                      {appointment.notes && (
                        <p>
                          <span className="font-medium">Observações:</span> {appointment.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" onClick={() => handleEdit(appointment)}>
                      Editar
                    </Button>
                    <select
                      value={appointment.appointment_status}
                      onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                      className="text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleDelete(appointment.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedAppointment(null)
          setSelectedDate(undefined)
        }}
        title={selectedAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}
        size="xl"
      >
        <AppointmentForm
          appointment={selectedAppointment}
          clients={clients}
          selectedDate={selectedDate}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false)
            setSelectedAppointment(null)
            setSelectedDate(undefined)
          }}
        />
      </Modal>
    </div>
  )
}

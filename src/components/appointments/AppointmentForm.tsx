import { useState, FormEvent, useEffect } from 'react'
import { format } from 'date-fns'
import type { Database, SessionType, AppointmentStatus } from '@/types/database.types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'

type Client = Database['public']['Tables']['clients']['Row']

interface AppointmentFormProps {
  appointment?: any | null
  clients: Client[]
  selectedDate?: Date
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
}

const sessionTypeOptions = [
  { value: 'individual_therapy', label: 'Terapia Individual' },
  { value: 'coaching', label: 'Coaching' },
  { value: 'couples_therapy', label: 'Terapia de Casal' },
  { value: 'group_session', label: 'Sessão em Grupo' },
  { value: 'first_consultation', label: 'Primeira Consulta' },
  { value: 'follow_up', label: 'Retorno' },
]

const statusOptions = [
  { value: 'scheduled', label: 'Agendado' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'in_progress', label: 'Em Andamento' },
  { value: 'completed', label: 'Concluído' },
  { value: 'cancelled', label: 'Cancelado' },
  { value: 'no_show', label: 'Faltou' },
]

const durationOptions = [
  { value: '30', label: '30 minutos' },
  { value: '45', label: '45 minutos' },
  { value: '60', label: '1 hora' },
  { value: '90', label: '1 hora e 30 minutos' },
  { value: '120', label: '2 horas' },
]

export default function AppointmentForm({
  appointment,
  clients,
  selectedDate,
  onSubmit,
  onCancel,
}: AppointmentFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const defaultDate = selectedDate
    ? format(selectedDate, "yyyy-MM-dd'T'HH:mm")
    : format(new Date(), "yyyy-MM-dd'T'HH:mm")

  const [formData, setFormData] = useState({
    client_id: '',
    date: defaultDate,
    duration: 60,
    type: 'individual_therapy' as SessionType,
    status: 'scheduled' as AppointmentStatus,
    price: 0,
    notes: '',
    session_notes: '',
    is_paid: false,
    is_pro_bono: false,
  })

  useEffect(() => {
    if (appointment) {
      setFormData({
        client_id: appointment.client_id || '',
        date: appointment.date ? format(new Date(appointment.date), "yyyy-MM-dd'T'HH:mm") : defaultDate,
        duration: appointment.duration || 60,
        type: appointment.type || 'individual_therapy',
        status: appointment.status || 'scheduled',
        price: appointment.price || 0,
        notes: appointment.notes || '',
        session_notes: appointment.session_notes || '',
        is_paid: appointment.is_paid || false,
        is_pro_bono: appointment.is_pro_bono || false,
      })
    }
  }, [appointment, defaultDate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Convert datetime-local to ISO string
      const dateObj = new Date(formData.date)
      await onSubmit({
        ...formData,
        date: dateObj.toISOString(),
        duration: Number(formData.duration),
        price: Number(formData.price),
      })
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar agendamento')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    if (field === 'is_pro_bono' && value === true) {
      setFormData((prev) => ({ ...prev, [field]: value, price: 0, is_paid: false }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const clientOptions = [
    { value: '', label: 'Selecione um cliente' },
    ...clients.map((client) => ({
      value: client.id,
      label: client.name,
    })),
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cliente e Data/Hora */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Informações Básicas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Select
              label="Cliente"
              value={formData.client_id}
              onChange={(e) => handleChange('client_id', e.target.value)}
              options={clientOptions}
              required
            />
          </div>
          <Input
            label="Data e Hora"
            type="datetime-local"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            required
          />
          <Select
            label="Duração"
            value={String(formData.duration)}
            onChange={(e) => handleChange('duration', e.target.value)}
            options={durationOptions}
            required
          />
        </div>
      </div>

      {/* Tipo e Status */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Detalhes da Sessão</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Tipo de Sessão"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            options={sessionTypeOptions}
            required
          />
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={statusOptions}
            required
          />
          <div className="flex items-center pt-7">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_pro_bono}
                onChange={(e) => handleChange('is_pro_bono', e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">Atendimento Pro Bono</span>
            </label>
          </div>
          {!formData.is_pro_bono && (
            <>
              <Input
                label="Valor (R$)"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                required
              />
              <div className="flex items-center pt-7">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_paid}
                    onChange={(e) => handleChange('is_paid', e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Pagamento recebido</span>
                </label>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Observações */}
      <div className="space-y-4">
        <Textarea
          label="Observações"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
          placeholder="Informações adicionais sobre o agendamento..."
        />
        {appointment && (
          <Textarea
            label="Notas da Sessão"
            value={formData.session_notes}
            onChange={(e) => handleChange('session_notes', e.target.value)}
            rows={4}
            placeholder="Anotações sobre o que foi discutido na sessão..."
          />
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={loading}>
          {appointment ? 'Atualizar' : 'Criar'} Agendamento
        </Button>
      </div>
    </form>
  )
}

import { useState, FormEvent, useEffect } from 'react'
import type { Database, ClientStatus } from '@/types/database.types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'

type Client = Database['public']['Tables']['clients']['Row']

interface ClientFormProps {
  client?: Client | null
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
}

const statusOptions = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
  { value: 'archived', label: 'Arquivado' },
]

export default function ClientForm({ client, onSubmit, onCancel }: ClientFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birth_date: '',
    cpf: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    emergency_contact: '',
    emergency_phone: '',
    notes: '',
    status: 'active' as ClientStatus,
  })

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        birth_date: client.birth_date || '',
        cpf: client.cpf || '',
        address: client.address || '',
        city: client.city || '',
        state: client.state || '',
        zip_code: client.zip_code || '',
        emergency_contact: client.emergency_contact || '',
        emergency_phone: client.emergency_phone || '',
        notes: client.notes || '',
        status: client.status || 'active',
      })
    }
  }, [client])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await onSubmit(formData)
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar cliente')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Informações Básicas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Nome Completo"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <Input
            label="Telefone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            required
          />
          <Input
            label="Data de Nascimento"
            type="date"
            value={formData.birth_date}
            onChange={(e) => handleChange('birth_date', e.target.value)}
          />
          <Input
            label="CPF"
            value={formData.cpf}
            onChange={(e) => handleChange('cpf', e.target.value)}
            placeholder="000.000.000-00"
          />
        </div>
      </div>

      {/* Endereço */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Endereço</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Endereço"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Rua, número, complemento"
            />
          </div>
          <Input
            label="Cidade"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
          />
          <Input
            label="Estado"
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
            placeholder="SP"
            maxLength={2}
          />
          <Input
            label="CEP"
            value={formData.zip_code}
            onChange={(e) => handleChange('zip_code', e.target.value)}
            placeholder="00000-000"
          />
        </div>
      </div>

      {/* Contato de Emergência */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Contato de Emergência</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome"
            value={formData.emergency_contact}
            onChange={(e) => handleChange('emergency_contact', e.target.value)}
          />
          <Input
            label="Telefone"
            type="tel"
            value={formData.emergency_phone}
            onChange={(e) => handleChange('emergency_phone', e.target.value)}
          />
        </div>
      </div>

      {/* Observações e Status */}
      <div className="space-y-4">
        <Textarea
          label="Observações"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={4}
          placeholder="Informações adicionais sobre o cliente..."
        />
        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          options={statusOptions}
          required
        />
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
          {client ? 'Atualizar' : 'Criar'} Cliente
        </Button>
      </div>
    </form>
  )
}

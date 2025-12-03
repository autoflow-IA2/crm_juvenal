import { useState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { financeService } from '@/services/finance'
import { clientsService } from '@/services/clients'
import type {
  TransactionType,
  TransactionCategory,
  TransactionStatus,
  PaymentMethod,
} from '@/types/database.types'

interface TransactionFormProps {
  transactionId?: string
  onSave: () => void
  onCancel: () => void
}

interface Client {
  id: string
  name: string
}

export default function TransactionForm({ transactionId, onSave, onCancel }: TransactionFormProps) {
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [formData, setFormData] = useState({
    type: 'income' as TransactionType,
    category: 'session' as TransactionCategory,
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    client_id: '',
    payment_method: '' as PaymentMethod | '',
    status: 'pending' as TransactionStatus,
    due_date: '',
  })

  useEffect(() => {
    loadClients()
    if (transactionId) {
      loadTransaction()
    }
  }, [transactionId])

  const loadClients = async () => {
    try {
      const data = await clientsService.getAll()
      setClients(data)
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
    }
  }

  const loadTransaction = async () => {
    if (!transactionId) return
    try {
      setLoading(true)
      const transaction = await financeService.getById(transactionId)
      if (transaction) {
        const txn = transaction as any
        setFormData({
          type: txn.type,
          category: txn.category,
          description: txn.description,
          amount: txn.amount.toString(),
          date: txn.date.split('T')[0],
          client_id: txn.client_id || '',
          payment_method: (txn.payment_method || '') as PaymentMethod | '',
          status: txn.status,
          due_date: txn.due_date ? txn.due_date.split('T')[0] : '',
        })
      }
    } catch (error) {
      console.error('Erro ao carregar transação:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = {
        type: formData.type,
        category: formData.category,
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString(),
        client_id: formData.client_id || null,
        payment_method: formData.payment_method || null,
        status: formData.status,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
      }

      if (transactionId) {
        await financeService.update(transactionId, data)
      } else {
        await financeService.create(data)
      }

      onSave()
    } catch (error) {
      console.error('Erro ao salvar transação:', error)
      alert('Erro ao salvar transação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const categoryOptions = {
    income: [
      { value: 'session', label: 'Sessão' },
      { value: 'package', label: 'Pacote' },
      { value: 'product', label: 'Produto' },
      { value: 'other', label: 'Outro' },
    ],
    expense: [
      { value: 'rent', label: 'Aluguel' },
      { value: 'utilities', label: 'Utilidades' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'software', label: 'Software' },
      { value: 'equipment', label: 'Equipamento' },
      { value: 'other', label: 'Outro' },
    ],
  }

  const paymentMethodOptions = [
    { value: '', label: 'Selecione...' },
    { value: 'cash', label: 'Dinheiro' },
    { value: 'pix', label: 'PIX' },
    { value: 'credit_card', label: 'Cartão de Crédito' },
    { value: 'debit_card', label: 'Cartão de Débito' },
    { value: 'bank_transfer', label: 'Transferência Bancária' },
    { value: 'health_insurance', label: 'Plano de Saúde' },
  ]

  const statusOptions = [
    { value: 'pending', label: 'Pendente' },
    { value: 'paid', label: 'Pago' },
    { value: 'overdue', label: 'Atrasado' },
    { value: 'cancelled', label: 'Cancelado' },
  ]

  const clientOptions = [
    { value: '', label: 'Selecione...' },
    ...clients.map((client) => ({
      value: client.id,
      label: client.name,
    })),
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Tipo"
          required
          value={formData.type}
          onChange={(e) =>
            setFormData({
              ...formData,
              type: e.target.value as TransactionType,
              category: e.target.value === 'income' ? 'session' : 'rent',
            })
          }
          options={[
            { value: 'income', label: 'Receita' },
            { value: 'expense', label: 'Despesa' },
          ]}
        />

        <Select
          label="Categoria"
          required
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as TransactionCategory })}
          options={categoryOptions[formData.type]}
        />
      </div>

      <Input
        label="Descrição"
        required
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Ex: Sessão com João Silva"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Valor"
          type="number"
          step="0.01"
          required
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="0.00"
        />

        <Input
          label="Data"
          type="date"
          required
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </div>

      {formData.type === 'income' && (
        <>
          <Select
            label="Cliente"
            value={formData.client_id}
            onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
            options={clientOptions}
          />

          <Input
            label="Data de Vencimento"
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            helperText="Opcional - para receitas a prazo"
          />
        </>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Método de Pagamento"
          value={formData.payment_method}
          onChange={(e) => setFormData({ ...formData, payment_method: e.target.value as PaymentMethod })}
          options={paymentMethodOptions}
        />

        <Select
          label="Status"
          required
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as TransactionStatus })}
          options={statusOptions}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : transactionId ? 'Atualizar' : 'Salvar'}
        </Button>
      </div>
    </form>
  )
}

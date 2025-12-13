import { useState, useEffect } from 'react'
import Modal from '@/components/ui/Modal'
import { financeService } from '@/services/finance'
import type { TransactionType, TransactionStatus } from '@/types/database.types'
import {
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'
import TransactionForm from './TransactionForm'

interface Transaction {
  id: string
  type: TransactionType
  category: string
  description: string
  amount: number
  date: string
  status: TransactionStatus
  payment_method: string | null
  clients?: {
    id: string
    name: string
  } | null
}

interface TransactionListProps {
  filterType?: TransactionType
  filterStatus?: TransactionStatus
  onUpdate: () => void
}

export default function TransactionList({ filterType, filterStatus, onUpdate }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    loadTransactions()
  }, [filterType, filterStatus])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const filters = {
        type: filterType,
        status: filterStatus,
      }
      const data = await financeService.getAll(filters)
      setTransactions(data)
    } catch (error) {
      console.error('Erro ao carregar transações:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) return

    try {
      await financeService.delete(id)
      loadTransactions()
      onUpdate()
    } catch (error) {
      console.error('Erro ao excluir transação:', error)
      alert('Erro ao excluir transação. Tente novamente.')
    }
  }

  const handleMarkAsPaid = async (id: string) => {
    try {
      await financeService.markAsPaid(id)
      loadTransactions()
      onUpdate()
    } catch (error) {
      console.error('Erro ao marcar como pago:', error)
      alert('Erro ao atualizar transação. Tente novamente.')
    }
  }

  const handleEdit = (id: string) => {
    setEditingId(id)
    setIsEditModalOpen(true)
  }

  const handleEditSave = () => {
    setIsEditModalOpen(false)
    setEditingId(null)
    loadTransactions()
    onUpdate()
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusBadge = (status: TransactionStatus) => {
    const styles = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    }

    const labels = {
      paid: 'Pago',
      pending: 'Pendente',
      overdue: 'Atrasado',
      cancelled: 'Cancelado',
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      session: 'Sessão',
      package: 'Pacote',
      product: 'Produto',
      rent: 'Aluguel',
      utilities: 'Utilidades',
      marketing: 'Marketing',
      software: 'Software',
      equipment: 'Equipamento',
      other: 'Outro',
    }
    return labels[category] || category
  }

  const getPaymentMethodLabel = (method: string | null) => {
    if (!method) return '-'
    const labels: Record<string, string> = {
      cash: 'Dinheiro',
      pix: 'PIX',
      credit_card: 'Cartão de Crédito',
      debit_card: 'Cartão de Débito',
      bank_transfer: 'Transferência',
      health_insurance: 'Plano de Saúde',
    }
    return labels[method] || method
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="mt-2 text-gray-500">Carregando transações...</p>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhuma transação encontrada</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Método
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.clients?.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getCategoryLabel(transaction.category)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getPaymentMethodLabel(transaction.payment_method)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span
                    className={
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(transaction.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    {transaction.type === 'income' && transaction.status === 'pending' && (
                      <button
                        onClick={() => handleMarkAsPaid(transaction.id)}
                        className="text-green-600 hover:text-green-900"
                        title="Marcar como pago"
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(transaction.id)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Editar"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Excluir"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingId(null)
        }}
        title="Editar Transação"
      >
        {editingId && (
          <TransactionForm
            transactionId={editingId}
            onSave={handleEditSave}
            onCancel={() => {
              setIsEditModalOpen(false)
              setEditingId(null)
            }}
          />
        )}
      </Modal>
    </>
  )
}

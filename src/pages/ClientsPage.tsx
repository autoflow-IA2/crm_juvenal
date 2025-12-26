import { useState, useEffect } from 'react'
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, UserIcon } from '@heroicons/react/24/outline'
import { clientsService } from '@/services/clients'
import type { Database } from '@/types/database.types'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import ClientForm from '@/components/clients/ClientForm'

type Client = Database['public']['Tables']['clients']['Row']

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  archived: 'bg-red-100 text-red-800',
}

const statusLabels = {
  active: 'Ativo',
  inactive: 'Inativo',
  archived: 'Arquivado',
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<'all' | 'name' | 'phone'>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    loadClients()
  }, [])

  useEffect(() => {
    filterClients()
  }, [clients, searchQuery, searchType, statusFilter])

  const loadClients = async () => {
    try {
      setLoading(true)
      const data = await clientsService.getAll()
      setClients(data)
    } catch (error: any) {
      console.error('Erro ao carregar clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterClients = () => {
    let filtered = clients

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((client) => client.status === statusFilter)
    }

    // Filter by search query and search type
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((client) => {
        switch (searchType) {
          case 'name':
            return client.name.toLowerCase().includes(query)
          case 'phone':
            return client.phone.toLowerCase().includes(query)
          case 'all':
          default:
            return (
              client.name.toLowerCase().includes(query) ||
              client.email?.toLowerCase().includes(query) ||
              client.phone.toLowerCase().includes(query)
            )
        }
      })
    }

    setFilteredClients(filtered)
  }

  const handleCreate = () => {
    setSelectedClient(null)
    setIsModalOpen(true)
  }

  const handleEdit = (client: Client) => {
    setSelectedClient(client)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id)
      return
    }

    try {
      await clientsService.delete(id)
      await loadClients()
      setDeleteConfirm(null)
    } catch (error: any) {
      console.error('Erro ao excluir cliente:', error)
      alert('Erro ao excluir cliente: ' + error.message)
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      if (selectedClient) {
        await clientsService.update(selectedClient.id, data)
      } else {
        await clientsService.create(data)
      }
      setIsModalOpen(false)
      setSelectedClient(null)
      await loadClients()
    } catch (error) {
      throw error
    }
  }

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
    return phone
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
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-1">{filteredClients.length} clientes encontrados</p>
        </div>
        <Button onClick={handleCreate}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="sm:w-48">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'all' | 'name' | 'phone')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Buscar em todos</option>
              <option value="name">Buscar por nome</option>
              <option value="phone">Buscar por telefone</option>
            </select>
          </div>
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder={
                  searchType === 'name'
                    ? "Digite o nome do cliente..."
                    : searchType === 'phone'
                    ? "Digite o telefone..."
                    : "Buscar por nome, email ou telefone..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Todos os status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
              <option value="archived">Arquivados</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Clients List */}
      {filteredClients.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum cliente encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || statusFilter !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando um novo cliente'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <div className="mt-6">
                <Button onClick={handleCreate}>
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Novo Cliente
                </Button>
              </div>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[client.status]}`}>
                      {statusLabels[client.status]}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    {client.email && (
                      <p>
                        <span className="font-medium">Email:</span> {client.email}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Telefone:</span> {formatPhone(client.phone)}
                    </p>
                    {client.city && client.state && (
                      <p>
                        <span className="font-medium">Localização:</span> {client.city}/{client.state}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(client)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      deleteConfirm === client.id
                        ? 'text-white bg-red-600 hover:bg-red-700'
                        : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'
                    }`}
                    title={deleteConfirm === client.id ? 'Confirmar exclusão' : 'Excluir'}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedClient(null)
        }}
        title={selectedClient ? 'Editar Cliente' : 'Novo Cliente'}
        size="xl"
      >
        <ClientForm
          client={selectedClient}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false)
            setSelectedClient(null)
          }}
        />
      </Modal>
    </div>
  )
}

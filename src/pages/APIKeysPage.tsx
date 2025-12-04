import { useState, useEffect } from 'react'
import { PlusIcon, KeyIcon } from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import CreateAPIKeyModal from '@/components/api-keys/CreateAPIKeyModal'
import APIKeyCard from '@/components/api-keys/APIKeyCard'
import { listAPIKeys, APIKey } from '@/services/apiKeys'

export default function APIKeysPage() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  useEffect(() => {
    loadAPIKeys()
  }, [])

  const loadAPIKeys = async () => {
    setLoading(true)
    setError(null)
    try {
      const keys = await listAPIKeys()
      setApiKeys(keys)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar API keys')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSuccess = (newKey: APIKey) => {
    setApiKeys((prev) => [newKey, ...prev])
  }

  const handleDelete = (id: string) => {
    setApiKeys((prev) => prev.filter((key) => key.id !== id))
  }

  const handleUpdate = (updatedKey: APIKey) => {
    setApiKeys((prev) => prev.map((key) => (key.id === updatedKey.id ? updatedKey : key)))
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
          <p className="text-gray-600 mt-1">
            Gerencie suas chaves de API para integração com sistemas externos
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Nova API Key
        </Button>
      </div>

      {/* Info card */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <KeyIcon className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Como usar suas API Keys</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Use as chaves para integrar com n8n, Zapier, Make e outras plataformas</li>
              <li>Adicione o header <code className="bg-blue-100 px-1 py-0.5 rounded">X-API-Key</code> em suas requisições</li>
              <li>Consulte a <a href="/api-docs" className="underline hover:text-blue-600">documentação completa</a> para mais detalhes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && apiKeys.length === 0 && (
        <div className="text-center py-12">
          <KeyIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma API key</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comece criando sua primeira chave de API para integração
          </p>
          <div className="mt-6">
            <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Criar primeira API Key
            </Button>
          </div>
        </div>
      )}

      {/* API Keys list */}
      {!loading && !error && apiKeys.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">
              {apiKeys.length} {apiKeys.length === 1 ? 'chave' : 'chaves'} de API
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {apiKeys.map((apiKey) => (
              <APIKeyCard
                key={apiKey.id}
                apiKey={apiKey}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Create modal */}
      <CreateAPIKeyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  )
}

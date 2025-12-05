import { useState } from 'react'
import { CheckIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { createAPIKey, CreateAPIKeyData, APIKey } from '@/services/apiKeys'

interface CreateAPIKeyModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (apiKey: APIKey) => void
}

export default function CreateAPIKeyModal({ isOpen, onClose, onSuccess }: CreateAPIKeyModalProps) {
  const [name, setName] = useState('')
  const [scopes, setScopes] = useState<string[]>(['read'])
  const [expiresInDays, setExpiresInDays] = useState<number | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdKey, setCreatedKey] = useState<APIKey | null>(null)
  const [copied, setCopied] = useState(false)

  const availableScopes = [
    { value: 'read', label: 'Read', description: 'Ver dados (GET)' },
    { value: 'write', label: 'Write', description: 'Criar e atualizar (POST, PUT, PATCH)' },
    { value: 'delete', label: 'Delete', description: 'Deletar dados (DELETE)' },
  ]

  const handleScopeToggle = (scope: string) => {
    setScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Nome é obrigatório')
      return
    }

    if (scopes.length === 0) {
      setError('Selecione pelo menos um escopo')
      return
    }

    setLoading(true)

    try {
      const keyData: CreateAPIKeyData = {
        name: name.trim(),
        scopes,
        expires_in_days: expiresInDays || undefined,
      }

      const newKey = await createAPIKey(keyData)
      setCreatedKey(newKey)
      onSuccess(newKey)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar API key')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (createdKey) {
      await navigator.clipboard.writeText(createdKey.key)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClose = () => {
    setName('')
    setScopes(['read'])
    setExpiresInDays(undefined)
    setError(null)
    setCreatedKey(null)
    setCopied(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Criar Nova API Key">
      {!createdKey ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <Input
            label="Nome da API Key"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Integração n8n"
            required
            helperText="Nome para identificar esta chave"
          />

          {/* Scopes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permissões (Scopes) *
            </label>
            <div className="space-y-2">
              {availableScopes.map((scope) => (
                <label
                  key={scope.value}
                  className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={scopes.includes(scope.value)}
                    onChange={() => handleScopeToggle(scope.value)}
                    className="mt-0.5 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <div className="ml-3">
                    <span className="text-sm font-medium text-gray-900">{scope.label}</span>
                    <p className="text-xs text-gray-500">{scope.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Expiration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiração (opcional)
            </label>
            <select
              value={expiresInDays || ''}
              onChange={(e) => setExpiresInDays(e.target.value ? Number(e.target.value) : undefined)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Nunca expira</option>
              <option value="7">7 dias</option>
              <option value="30">30 dias</option>
              <option value="90">90 dias</option>
              <option value="365">1 ano</option>
            </select>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Criando...' : 'Criar API Key'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {/* Success message */}
          <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckIcon className="h-5 w-5 text-green-600 mr-3" />
            <p className="text-sm text-green-800">API Key criada com sucesso!</p>
          </div>

          {/* Warning */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-medium text-yellow-900 mb-1">⚠️ Importante</p>
            <p className="text-xs text-yellow-700">
              Copie esta chave agora. Por segurança, ela não será mostrada novamente.
            </p>
          </div>

          {/* Key display */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sua API Key</label>
            <div className="relative">
              <code className="block w-full px-3 py-3 bg-gray-900 text-green-400 rounded-lg font-mono text-sm break-all pr-12">
                {createdKey.key}
              </code>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-gray-800"
              >
                {copied ? (
                  <CheckIcon className="h-5 w-5 text-green-400" />
                ) : (
                  <DocumentDuplicateIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Key details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Nome:</span>
              <span className="font-medium">{createdKey.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Permissões:</span>
              <span className="font-medium">{createdKey.scopes.join(', ')}</span>
            </div>
            {createdKey.expires_at && (
              <div className="flex justify-between">
                <span className="text-gray-600">Expira em:</span>
                <span className="font-medium">
                  {new Date(createdKey.expires_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleClose}>Fechar</Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

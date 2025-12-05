import { useState } from 'react'
import {
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  CheckIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { APIKey, maskAPIKey, deleteAPIKey, updateAPIKey } from '@/services/apiKeys'

interface APIKeyCardProps {
  apiKey: APIKey
  onDelete: (id: string) => void
  onUpdate: (apiKey: APIKey) => void
}

export default function APIKeyCard({ apiKey, onDelete, onUpdate }: APIKeyCardProps) {
  const [showKey, setShowKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [toggling, setToggling] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(apiKey.key)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar esta API key? Esta ação não pode ser desfeita.')) {
      return
    }

    setDeleting(true)
    try {
      await deleteAPIKey(apiKey.id)
      onDelete(apiKey.id)
    } catch (err) {
      alert('Erro ao deletar API key')
    } finally {
      setDeleting(false)
    }
  }

  const handleToggleActive = async () => {
    setToggling(true)
    try {
      const updated = await updateAPIKey(apiKey.id, {
        is_active: !apiKey.is_active,
      })
      onUpdate(updated)
    } catch (err) {
      alert('Erro ao atualizar status')
    } finally {
      setToggling(false)
    }
  }

  const isExpired = !!apiKey.expires_at && new Date(apiKey.expires_at) < new Date()

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">{apiKey.name}</h3>
              {!apiKey.is_active && (
                <Badge variant="warning">Inativa</Badge>
              )}
              {isExpired && (
                <Badge variant="error">Expirada</Badge>
              )}
              {apiKey.is_active && !isExpired && (
                <Badge variant="success">Ativa</Badge>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Criada em {new Date(apiKey.created_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50"
            title="Deletar API key"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>

        {/* API Key */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">API Key</label>
          <div className="flex items-center space-x-2">
            <code className="flex-1 px-3 py-2 bg-gray-900 text-green-400 rounded-md font-mono text-sm">
              {showKey ? apiKey.key : maskAPIKey(apiKey.key)}
            </code>
            <button
              onClick={() => setShowKey(!showKey)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title={showKey ? 'Ocultar' : 'Mostrar'}
            >
              {showKey ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
            <button
              onClick={handleCopy}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Copiar"
            >
              {copied ? (
                <CheckIcon className="h-5 w-5 text-green-600" />
              ) : (
                <DocumentDuplicateIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {/* Scopes */}
          <div>
            <span className="block text-xs font-medium text-gray-600 mb-1">Permissões</span>
            <div className="flex flex-wrap gap-1">
              {apiKey.scopes.map((scope) => (
                <Badge key={scope} variant="info">
                  {scope}
                </Badge>
              ))}
            </div>
          </div>

          {/* Last used */}
          <div>
            <span className="block text-xs font-medium text-gray-600 mb-1">Último uso</span>
            <span className="text-sm text-gray-900">
              {apiKey.last_used_at
                ? new Date(apiKey.last_used_at).toLocaleDateString('pt-BR')
                : 'Nunca usada'}
            </span>
          </div>

          {/* Expires */}
          {apiKey.expires_at && (
            <div>
              <span className="block text-xs font-medium text-gray-600 mb-1">Expira em</span>
              <span className={`text-sm ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                {new Date(apiKey.expires_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-gray-200">
          <Button
            variant={apiKey.is_active ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleToggleActive}
            disabled={toggling || isExpired}
          >
            {toggling ? 'Atualizando...' : apiKey.is_active ? 'Desativar' : 'Ativar'}
          </Button>
        </div>
      </div>
    </Card>
  )
}

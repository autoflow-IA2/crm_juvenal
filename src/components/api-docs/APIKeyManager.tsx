import { useState } from 'react'
import { CheckCircleIcon, XCircleIcon, KeyIcon } from '@heroicons/react/24/outline'
import { useAPIKey } from '@/hooks/useAPIKey'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function APIKeyManager() {
  const {
    apiKey,
    setAPIKey,
    validateAPIKey,
    clearAPIKey,
    isValidating,
    validationStatus,
    validationMessage,
    getMaskedKey,
    hasAPIKey,
  } = useAPIKey()

  const [inputValue, setInputValue] = useState('')
  const [showKey, setShowKey] = useState(false)

  const handleSave = async () => {
    await setAPIKey(inputValue)
    setInputValue('')
  }

  const handleTest = async () => {
    await validateAPIKey()
  }

  const handleClear = () => {
    clearAPIKey()
    setInputValue('')
  }

  const displayValue = hasAPIKey && !showKey ? getMaskedKey(apiKey) : apiKey

  return (
    <Card className="mb-6 bg-primary-50 border-primary-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <KeyIcon className="h-6 w-6 text-primary-600" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            API Key
          </h3>
          <p className="text-sm text-gray-700 mb-4">
            Insira sua API key para testar os endpoints. As keys começam com <code className="px-1 bg-white rounded text-primary-600">jcrm_live_</code> ou <code className="px-1 bg-white rounded text-primary-600">jcrm_test_</code>
          </p>

          {hasAPIKey ? (
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <Input
                value={displayValue}
                readOnly
                className="flex-1 font-mono text-sm"
              />

              {/* Botões em grid responsivo */}
              <div className="grid grid-cols-2 sm:flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? 'Ocultar' : 'Mostrar'}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleTest}
                  isLoading={isValidating}
                >
                  Testar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleClear}
                  className="col-span-2 sm:col-span-1"
                >
                  Limpar
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 mb-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="jcrm_live_abc123..."
                className="flex-1 font-mono text-sm"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={!inputValue}
              >
                Salvar
              </Button>
            </div>
          )}

          {/* Validation Status */}
          {validationMessage && (
            <div
              className={`
                flex items-center gap-2 text-sm py-2 px-3 rounded-lg
                ${
                  validationStatus === 'valid'
                    ? 'bg-green-100 text-green-700'
                    : validationStatus === 'invalid'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }
              `}
            >
              {validationStatus === 'valid' && (
                <CheckCircleIcon className="h-5 w-5" />
              )}
              {validationStatus === 'invalid' && (
                <XCircleIcon className="h-5 w-5" />
              )}
              <span>{validationMessage}</span>
            </div>
          )}

          {/* Help Text */}
          {!hasAPIKey && (
            <p className="text-xs text-gray-700 mt-2">
              💡 Crie uma API key no painel de administração ou use uma existente para testar os endpoints
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}

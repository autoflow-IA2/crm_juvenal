import { useState, useEffect } from 'react'

const API_KEY_STORAGE_KEY = 'juvenal_crm_api_key'
const API_KEY_REGEX = /^jcrm_(live|test)_[a-zA-Z0-9]{32,}$/

export interface APIKeyValidation {
  isValid: boolean
  message: string
}

export function useAPIKey() {
  const [apiKey, setApiKeyState] = useState<string>('')
  const [isValidating, setIsValidating] = useState(false)
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle')
  const [validationMessage, setValidationMessage] = useState('')

  // Load API key from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(API_KEY_STORAGE_KEY)
    if (stored) {
      setApiKeyState(stored)
    }
  }, [])

  // Validate API key format
  const validateFormat = (key: string): APIKeyValidation => {
    if (!key) {
      return { isValid: false, message: '' }
    }

    if (!API_KEY_REGEX.test(key)) {
      return {
        isValid: false,
        message: 'Formato inválido. Deve ser jcrm_live_* ou jcrm_test_*',
      }
    }

    return { isValid: true, message: '' }
  }

  // Test API key with a simple request
  const testAPIKey = async (key: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/health', {
        headers: {
          'X-API-Key': key,
        },
      })

      return response.ok
    } catch (error) {
      console.error('Error testing API key:', error)
      return false
    }
  }

  // Set API key and save to localStorage
  const setAPIKey = async (key: string) => {
    setApiKeyState(key)

    if (!key) {
      localStorage.removeItem(API_KEY_STORAGE_KEY)
      setValidationStatus('idle')
      setValidationMessage('')
      return
    }

    // Validate format
    const formatValidation = validateFormat(key)
    if (!formatValidation.isValid) {
      setValidationStatus('invalid')
      setValidationMessage(formatValidation.message)
      return
    }

    // Save to localStorage
    localStorage.setItem(API_KEY_STORAGE_KEY, key)

    // Test with API (optional, can be done separately)
    setValidationStatus('valid')
    setValidationMessage('API key salva com sucesso')
  }

  // Validate API key with actual API call
  const validateAPIKey = async () => {
    if (!apiKey) {
      setValidationStatus('invalid')
      setValidationMessage('Nenhuma API key fornecida')
      return false
    }

    setIsValidating(true)
    setValidationMessage('Testando conexão...')

    try {
      const isValid = await testAPIKey(apiKey)

      if (isValid) {
        setValidationStatus('valid')
        setValidationMessage('✓ API key válida e funcional')
        return true
      } else {
        setValidationStatus('invalid')
        setValidationMessage('✗ API key inválida ou sem permissão')
        return false
      }
    } catch (error) {
      setValidationStatus('invalid')
      setValidationMessage('✗ Erro ao testar API key')
      return false
    } finally {
      setIsValidating(false)
    }
  }

  // Clear API key
  const clearAPIKey = () => {
    setApiKeyState('')
    localStorage.removeItem(API_KEY_STORAGE_KEY)
    setValidationStatus('idle')
    setValidationMessage('')
  }

  // Get masked API key for display
  const getMaskedKey = (key: string): string => {
    if (!key || key.length < 20) return key
    const prefix = key.substring(0, 10)
    const suffix = key.substring(key.length - 6)
    return `${prefix}...${suffix}`
  }

  return {
    apiKey,
    setAPIKey,
    validateAPIKey,
    clearAPIKey,
    isValidating,
    validationStatus,
    validationMessage,
    getMaskedKey,
    hasAPIKey: !!apiKey,
  }
}

import { useState, useCallback } from 'react'
import { executeAPIRequest, APIRequestConfig, APIResponse } from '@/utils/apiClient'

interface UseAPIRequestState {
  loading: boolean
  response: APIResponse | null
  error: string | null
}

interface UseAPIRequestReturn extends UseAPIRequestState {
  execute: (config: APIRequestConfig) => Promise<APIResponse>
  reset: () => void
}

/**
 * Hook to execute API requests with loading/error state management
 */
export function useAPIRequest(): UseAPIRequestReturn {
  const [state, setState] = useState<UseAPIRequestState>({
    loading: false,
    response: null,
    error: null,
  })

  const execute = useCallback(async (config: APIRequestConfig): Promise<APIResponse> => {
    // Reset state and start loading
    setState({
      loading: true,
      response: null,
      error: null,
    })

    try {
      const response = await executeAPIRequest(config)

      // Update state with response
      setState({
        loading: false,
        response,
        error: response.error || null,
      })

      return response
    } catch (error) {
      // Handle unexpected errors
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

      setState({
        loading: false,
        response: null,
        error: errorMessage,
      })

      throw error
    }
  }, [])

  const reset = useCallback(() => {
    setState({
      loading: false,
      response: null,
      error: null,
    })
  }, [])

  return {
    loading: state.loading,
    response: state.response,
    error: state.error,
    execute,
    reset,
  }
}

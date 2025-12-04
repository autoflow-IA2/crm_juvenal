import { PlayIcon } from '@heroicons/react/24/solid'
import Button from '@/components/ui/Button'
import { APIEndpoint } from '@/types/api-endpoints'
import { RequestValues } from './RequestBuilder'

interface TryItButtonProps {
  endpoint: APIEndpoint
  values: RequestValues
  apiKey: string | null
  onExecute: () => void
  loading?: boolean
  disabled?: boolean
}

export default function TryItButton({
  endpoint,
  values,
  apiKey,
  onExecute,
  loading = false,
  disabled = false,
}: TryItButtonProps) {
  // Check if API key is provided for authenticated endpoints
  const needsAuth = endpoint.authentication
  const hasApiKey = !!apiKey

  // Check if required parameters are filled
  const requiredParams = endpoint.parameters.filter((p) => p.required)
  const hasRequiredParams = requiredParams.every((param) => {
    if (param.in === 'path') {
      return values.pathParams[param.name] !== undefined && values.pathParams[param.name] !== ''
    }
    if (param.in === 'query') {
      return values.queryParams[param.name] !== undefined && values.queryParams[param.name] !== ''
    }
    if (param.in === 'body') {
      try {
        const body = JSON.parse(values.body)
        return body[param.name] !== undefined && body[param.name] !== ''
      } catch {
        return false
      }
    }
    return true
  })

  // Determine if button should be disabled
  const isDisabled = disabled || loading || (needsAuth && !hasApiKey) || !hasRequiredParams

  // Get tooltip message
  const getTooltip = (): string | undefined => {
    if (needsAuth && !hasApiKey) {
      return 'API key required for this endpoint'
    }
    if (!hasRequiredParams) {
      return 'Please fill all required parameters'
    }
    return undefined
  }

  const tooltip = getTooltip()

  return (
    <div className="relative group">
      <Button
        onClick={onExecute}
        disabled={isDisabled}
        variant="primary"
        size="md"
        className="w-full sm:w-auto"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Sending...
          </>
        ) : (
          <>
            <PlayIcon className="h-4 w-4 mr-2" />
            Try It
          </>
        )}
      </Button>

      {/* Tooltip on hover */}
      {tooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900" />
          </div>
        </div>
      )}
    </div>
  )
}

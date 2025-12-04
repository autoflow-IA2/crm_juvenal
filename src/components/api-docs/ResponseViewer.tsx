import { useState, useRef, useEffect } from 'react'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { APIResponse } from '@/utils/apiClient'
import HTTPStatusBadge from './HTTPStatusBadge'
import CopyCodeButton from '@/components/markdown/CopyCodeButton'
import { formatJSON } from '@/utils/jsonFormatter'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'

// Register JSON language
hljs.registerLanguage('json', json)

interface ResponseViewerProps {
  response: APIResponse | null
  loading?: boolean
  className?: string
}

export default function ResponseViewer({
  response,
  loading = false,
  className = '',
}: ResponseViewerProps) {
  const [showHeaders, setShowHeaders] = useState(false)
  const codeRef = useRef<HTMLElement>(null)

  // Highlight JSON when response changes
  useEffect(() => {
    if (codeRef.current && response?.data) {
      delete codeRef.current.dataset.highlighted
      hljs.highlightElement(codeRef.current)
    }
  }, [response])

  // Loading state
  if (loading) {
    return (
      <div className={`border border-gray-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-center space-x-3">
          <svg
            className="animate-spin h-5 w-5 text-primary-600"
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
          <span className="text-sm text-gray-600">Sending request...</span>
        </div>
      </div>
    )
  }

  // Empty state
  if (!response) {
    return (
      <div className={`border border-gray-200 rounded-lg p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <p className="text-sm">Click "Try It" to see the response</p>
        </div>
      </div>
    )
  }

  // Format response body
  const formattedData =
    typeof response.data === 'string' ? response.data : formatJSON(response.data)

  const headerEntries = Object.entries(response.headers)

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Response Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <HTTPStatusBadge status={response.status} />
            <span className="text-sm text-gray-600">{response.statusText}</span>
            <span className="text-xs text-gray-500">
              {response.responseTime}ms
            </span>
          </div>

          {/* Headers toggle */}
          {headerEntries.length > 0 && (
            <button
              onClick={() => setShowHeaders(!showHeaders)}
              className="flex items-center text-xs text-gray-600 hover:text-gray-900 transition-colors"
            >
              {showHeaders ? (
                <ChevronDownIcon className="h-4 w-4 mr-1" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 mr-1" />
              )}
              Headers ({headerEntries.length})
            </button>
          )}
        </div>

        {/* Error message */}
        {response.error && (
          <div className="mt-2 px-3 py-2 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{response.error}</p>
          </div>
        )}
      </div>

      {/* Headers Section (collapsible) */}
      {showHeaders && headerEntries.length > 0 && (
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Response Headers</h4>
          <div className="space-y-1">
            {headerEntries.map(([key, value]) => (
              <div key={key} className="flex text-xs">
                <span className="font-mono font-medium text-gray-700 min-w-[150px]">
                  {key}:
                </span>
                <span className="font-mono text-gray-600 break-all">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Response Body */}
      <div className="relative">
        <CopyCodeButton code={formattedData} />
        <pre className="bg-white p-4 overflow-x-auto text-sm max-h-[500px] overflow-y-auto">
          <code ref={codeRef} className="language-json">
            {formattedData}
          </code>
        </pre>
      </div>
    </div>
  )
}

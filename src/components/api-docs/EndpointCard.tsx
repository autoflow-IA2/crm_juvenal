import { useState, useMemo } from 'react'
import { APIEndpoint } from '@/types/api-endpoints'
import Card from '@/components/ui/Card'
import Tabs from '@/components/ui/Tabs'
import EndpointHeader from './EndpointHeader'
import LanguageSelector from './LanguageSelector'
import CodeExample from './CodeExample'
import RequestBuilder, { RequestValues } from './RequestBuilder'
import TryItButton from './TryItButton'
import ResponseViewer from './ResponseViewer'
import { useCodeLanguage } from '@/hooks/useCodeLanguage'
import { useAPIRequest } from '@/hooks/useAPIRequest'
import { generateCode } from '@/utils/codeGenerators'
import { parseJSON } from '@/utils/jsonFormatter'

interface EndpointCardProps {
  endpoint: APIEndpoint
  apiKey: string | null
  className?: string
}

export default function EndpointCard({ endpoint, apiKey, className = '' }: EndpointCardProps) {
  const { language, setLanguage } = useCodeLanguage()
  const { loading, response, execute } = useAPIRequest()

  // Request values state
  const [requestValues, setRequestValues] = useState<RequestValues>({
    pathParams: {},
    queryParams: {},
    body: '',
  })

  // Active tab state
  const [activeTab, setActiveTab] = useState('request')

  // Generate code based on current language and values
  const generatedCode = useMemo(() => {
    // Parse body JSON
    let bodyObject: any = undefined
    if (requestValues.body.trim()) {
      bodyObject = parseJSON(requestValues.body)
    }

    return generateCode(language, {
      method: endpoint.method,
      baseUrl: 'http://localhost:3001/api/v1',
      path: endpoint.path,
      pathParams: requestValues.pathParams,
      queryParams: requestValues.queryParams,
      body: bodyObject,
      apiKey: apiKey || 'your_api_key_here',
    })
  }, [language, endpoint, requestValues, apiKey])

  // Handle Try It execution
  const handleTryIt = async () => {
    if (!apiKey && endpoint.authentication) {
      return
    }

    // Parse body if present
    let bodyObject: any = undefined
    if (requestValues.body.trim()) {
      bodyObject = parseJSON(requestValues.body)
      if (!bodyObject) {
        // Invalid JSON - should be caught by validation
        return
      }
    }

    await execute({
      method: endpoint.method,
      path: endpoint.path,
      pathParams: requestValues.pathParams,
      queryParams: requestValues.queryParams,
      body: bodyObject,
      apiKey: apiKey || '',
    })
  }

  // Get example response
  const exampleResponse = endpoint.examples[0]?.response

  return (
    <Card id={endpoint.id} className={`scroll-mt-4 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <EndpointHeader endpoint={endpoint} />

        {/* Tabs */}
        <Tabs
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={[
            {
              id: 'request',
              label: 'Request',
              content: (
                <div className="space-y-4">
                  {/* Language Selector */}
                  <LanguageSelector language={language} onChange={setLanguage} />

                  {/* Generated Code */}
                  <CodeExample code={generatedCode} language={language} />
                </div>
              ),
            },
            {
              id: 'response',
              label: 'Response',
              content: (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Example response:</p>
                  {exampleResponse ? (
                    <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto text-sm">
                      <code>{JSON.stringify(exampleResponse, null, 2)}</code>
                    </pre>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No example response available</p>
                  )}
                </div>
              ),
            },
            {
              id: 'try-it',
              label: 'Try It',
              content: (
                <div className="space-y-4">
                  {/* Request Builder */}
                  <RequestBuilder endpoint={endpoint} onValuesChange={setRequestValues} />

                  {/* Try It Button */}
                  <div className="flex justify-center pt-2">
                    <TryItButton
                      endpoint={endpoint}
                      values={requestValues}
                      apiKey={apiKey}
                      onExecute={handleTryIt}
                      loading={loading}
                    />
                  </div>

                  {/* Response Viewer */}
                  <div className="pt-2">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Response</h4>
                    <ResponseViewer response={response} loading={loading} />
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
    </Card>
  )
}

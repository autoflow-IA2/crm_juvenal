import { useState, useEffect } from 'react'
import { APIEndpoint } from '@/types/api-endpoints'
import ParameterInput from './ParameterInput'
import JSONEditor from './JSONEditor'
import { formatJSON } from '@/utils/jsonFormatter'

interface RequestBuilderProps {
  endpoint: APIEndpoint
  onValuesChange: (values: RequestValues) => void
}

export interface RequestValues {
  pathParams: Record<string, any>
  queryParams: Record<string, any>
  body: string
}

export default function RequestBuilder({ endpoint, onValuesChange }: RequestBuilderProps) {
  // Separate parameters by type
  const pathParams = endpoint.parameters.filter((p) => p.in === 'path')
  const queryParams = endpoint.parameters.filter((p) => p.in === 'query')
  const bodyParams = endpoint.parameters.filter((p) => p.in === 'body')

  // Initialize state with example values
  const [pathValues, setPathValues] = useState<Record<string, any>>({})
  const [queryValues, setQueryValues] = useState<Record<string, any>>({})
  const [bodyValue, setBodyValue] = useState<string>('')

  // Initialize with example values on mount
  useEffect(() => {
    const initialPathValues: Record<string, any> = {}
    pathParams.forEach((param) => {
      if (param.example !== undefined) {
        initialPathValues[param.name] = param.example
      }
    })
    setPathValues(initialPathValues)

    const initialQueryValues: Record<string, any> = {}
    queryParams.forEach((param) => {
      if (param.example !== undefined) {
        initialQueryValues[param.name] = param.example
      }
    })
    setQueryValues(initialQueryValues)

    // Initialize body with example from endpoint or from body params
    if (endpoint.requestBodySchema) {
      setBodyValue(formatJSON(endpoint.requestBodySchema))
    } else if (bodyParams.length > 0) {
      const bodyObj: Record<string, any> = {}
      bodyParams.forEach((param) => {
        if (param.example !== undefined) {
          bodyObj[param.name] = param.example
        }
      })
      if (Object.keys(bodyObj).length > 0) {
        setBodyValue(formatJSON(bodyObj))
      }
    }
  }, [endpoint.id])

  // Notify parent of value changes
  useEffect(() => {
    onValuesChange({
      pathParams: pathValues,
      queryParams: queryValues,
      body: bodyValue,
    })
  }, [pathValues, queryValues, bodyValue])

  const handlePathParamChange = (name: string, value: any) => {
    setPathValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleQueryParamChange = (name: string, value: any) => {
    setQueryValues((prev) => ({ ...prev, [name]: value }))
  }

  const hasPathParams = pathParams.length > 0
  const hasQueryParams = queryParams.length > 0
  const hasBody = bodyParams.length > 0 || endpoint.requestBodySchema
  const needsRequestBuilder = hasPathParams || hasQueryParams || hasBody

  if (!needsRequestBuilder) {
    return (
      <div className="text-sm text-gray-500 italic">
        This endpoint does not require any parameters
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Path Parameters */}
      {hasPathParams && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Path Parameters</h4>
          <div className="space-y-2">
            {pathParams.map((param) => (
              <ParameterInput
                key={param.name}
                parameter={param}
                value={pathValues[param.name]}
                onChange={(value) => handlePathParamChange(param.name, value)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Query Parameters */}
      {hasQueryParams && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Query Parameters</h4>
          <div className="space-y-2">
            {queryParams.map((param) => (
              <ParameterInput
                key={param.name}
                parameter={param}
                value={queryValues[param.name]}
                onChange={(value) => handleQueryParamChange(param.name, value)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Request Body */}
      {hasBody && (
        <div>
          <JSONEditor
            label="Request Body"
            value={bodyValue}
            onChange={setBodyValue}
            helperText="Edit the JSON body for this request"
          />
        </div>
      )}
    </div>
  )
}

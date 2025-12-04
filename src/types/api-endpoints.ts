export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type ParamType = 'path' | 'query' | 'body'

export type ParamDataType = 'string' | 'number' | 'boolean' | 'uuid' | 'date' | 'datetime' | 'object' | 'array'

export interface Parameter {
  name: string
  type: ParamDataType
  in: ParamType
  required: boolean
  description: string
  default?: any
  example?: any
  enum?: string[]
  schema?: Record<string, any>
}

export interface EndpointExample {
  title: string
  request?: {
    params?: Record<string, any>
    query?: Record<string, any>
    body?: Record<string, any>
  }
  response: {
    status: number
    body: any
  }
}

export interface APIEndpoint {
  id: string
  method: HTTPMethod
  path: string
  category: string
  title: string
  description: string
  authentication: boolean
  requiredScopes?: string[]
  parameters: Parameter[]
  requestBodySchema?: Record<string, any>
  examples: EndpointExample[]
  notes?: string[]
}

export interface APICategory {
  id: string
  name: string
  description: string
  icon?: string
  endpoints: APIEndpoint[]
}

export type CodeLanguage = 'curl' | 'javascript' | 'python'

export interface CodeGenerationOptions {
  method: HTTPMethod
  baseUrl: string
  path: string
  pathParams?: Record<string, any>
  queryParams?: Record<string, any>
  body?: any
  apiKey?: string
}

export interface APIRequestConfig {
  method: HTTPMethod
  path: string
  pathParams?: Record<string, any>
  queryParams?: Record<string, any>
  body?: any
  apiKey: string
  baseUrl?: string
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any[]
  }
  pagination?: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

export interface APIExecutionResult {
  status: number
  statusText: string
  headers: Record<string, string>
  data: APIResponse
  responseTime: number
}

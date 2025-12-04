import { buildURL } from './urlBuilder'
import { HTTPMethod } from '@/types/api-endpoints'

const API_BASE_URL = 'http://localhost:3001/api/v1'

export interface APIRequestConfig {
  method: HTTPMethod
  path: string
  pathParams?: Record<string, any>
  queryParams?: Record<string, any>
  body?: any
  apiKey: string
}

export interface APIResponse {
  status: number
  statusText: string
  headers: Record<string, string>
  data: any
  responseTime: number
  error?: string
}

export interface APIError {
  message: string
  status?: number
  details?: any
}

/**
 * Execute an API request and return formatted response
 */
export async function executeAPIRequest(config: APIRequestConfig): Promise<APIResponse> {
  const startTime = performance.now()

  try {
    // Build complete URL
    const url = buildURL(API_BASE_URL, config.path, config.pathParams, config.queryParams)

    // Prepare headers
    const headers: Record<string, string> = {
      'X-API-Key': config.apiKey,
    }

    // Add Content-Type for methods with body
    if (config.method !== 'GET' && config.method !== 'DELETE') {
      headers['Content-Type'] = 'application/json'
    }

    // Prepare fetch options
    const options: RequestInit = {
      method: config.method,
      headers,
    }

    // Add body for non-GET/DELETE requests
    if (config.body && config.method !== 'GET' && config.method !== 'DELETE') {
      options.body = typeof config.body === 'string' ? config.body : JSON.stringify(config.body)
    }

    // Execute request
    const response = await fetch(url, options)

    // Calculate response time
    const responseTime = Math.round(performance.now() - startTime)

    // Extract response headers
    const responseHeaders: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value
    })

    // Parse response body
    let responseData: any
    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      responseData = await response.json()
    } else {
      responseData = await response.text()
    }

    // Return formatted response
    return {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      data: responseData,
      responseTime,
      error: response.ok ? undefined : getErrorMessage(response.status, responseData),
    }
  } catch (error) {
    // Handle network errors, CORS errors, etc.
    const responseTime = Math.round(performance.now() - startTime)

    return {
      status: 0,
      statusText: 'Network Error',
      headers: {},
      data: null,
      responseTime,
      error: getNetworkErrorMessage(error),
    }
  }
}

/**
 * Get user-friendly error message based on status code
 */
function getErrorMessage(status: number, data: any): string {
  // Try to extract error message from response
  if (data) {
    if (typeof data === 'string') return data
    if (data.error) return data.error
    if (data.message) return data.message
  }

  // Default messages based on status code
  switch (status) {
    case 400:
      return 'Bad Request - Invalid parameters or request format'
    case 401:
      return 'Unauthorized - Invalid or missing API key'
    case 403:
      return 'Forbidden - Insufficient permissions'
    case 404:
      return 'Not Found - Resource does not exist'
    case 405:
      return 'Method Not Allowed'
    case 409:
      return 'Conflict - Resource already exists'
    case 422:
      return 'Unprocessable Entity - Validation failed'
    case 429:
      return 'Too Many Requests - Rate limit exceeded'
    case 500:
      return 'Internal Server Error'
    case 502:
      return 'Bad Gateway'
    case 503:
      return 'Service Unavailable'
    default:
      return `Request failed with status ${status}`
  }
}

/**
 * Get user-friendly error message for network errors
 */
function getNetworkErrorMessage(error: any): string {
  if (error instanceof TypeError) {
    // Usually a CORS or network connectivity issue
    if (error.message.includes('Failed to fetch')) {
      return 'Network error - Unable to connect to API. Check if the backend is running and CORS is configured.'
    }
    return `Network error: ${error.message}`
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Unknown network error occurred'
}

/**
 * Test API connection with health endpoint
 */
export async function testAPIConnection(apiKey: string): Promise<boolean> {
  try {
    const response = await executeAPIRequest({
      method: 'GET',
      path: '/health',
      apiKey,
    })

    return response.status === 200
  } catch (error) {
    return false
  }
}

import { CodeLanguage, CodeGenerationOptions } from '@/types/api-endpoints'
import { buildQueryString, replacePathParams } from './urlBuilder'

/**
 * Generate code in multiple languages
 */
export function generateCode(language: CodeLanguage, options: CodeGenerationOptions): string {
  switch (language) {
    case 'curl':
      return generateCURL(options)
    case 'javascript':
      return generateJavaScript(options)
    case 'python':
      return generatePython(options)
    default:
      return ''
  }
}

/**
 * Generate cURL command
 */
function generateCURL(options: CodeGenerationOptions): string {
  const { method, baseUrl, path, pathParams, queryParams, body, apiKey } = options

  // Build path with params
  const finalPath = pathParams ? replacePathParams(path, pathParams) : path

  // Build query string
  const queryString = queryParams ? buildQueryString(queryParams) : ''

  // Build full URL
  const fullUrl = `${baseUrl}${finalPath}${queryString}`

  // Build command
  const parts: string[] = []

  parts.push(`curl -X ${method} \\`)

  // Add API key header
  if (apiKey) {
    parts.push(`  -H "X-API-Key: ${apiKey}" \\`)
  }

  // Add content-type for POST/PUT/PATCH
  if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
    parts.push(`  -H "Content-Type: application/json" \\`)
  }

  // Add body
  if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
    const bodyStr = JSON.stringify(body, null, 2)
      .split('\n')
      .map((line, i) => (i === 0 ? line : `  ${line}`))
      .join('\n')

    parts.push(`  -d '${bodyStr}' \\`)
  }

  // Add URL (no trailing backslash)
  parts.push(`  ${fullUrl}`)

  return parts.join('\n')
}

/**
 * Generate JavaScript (fetch) code
 */
function generateJavaScript(options: CodeGenerationOptions): string {
  const { method, baseUrl, path, pathParams, queryParams, body, apiKey } = options

  // Build path with params
  const finalPath = pathParams ? replacePathParams(path, pathParams) : path

  // Build query string
  const queryString = queryParams ? buildQueryString(queryParams) : ''

  // Build full URL
  const fullUrl = `${baseUrl}${finalPath}${queryString}`

  const lines: string[] = []

  lines.push(`const baseUrl = '${baseUrl}';`)
  if (apiKey) {
    lines.push(`const apiKey = '${apiKey}';`)
  }
  lines.push('')

  lines.push(`async function makeRequest() {`)
  lines.push(`  try {`)

  // Build fetch options
  lines.push(`    const response = await fetch(\`${fullUrl}\`, {`)
  lines.push(`      method: '${method}',`)

  // Headers
  const headers: string[] = []
  if (apiKey) {
    headers.push(`        'X-API-Key': apiKey`)
  }
  if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
    headers.push(`        'Content-Type': 'application/json'`)
  }

  if (headers.length > 0) {
    lines.push(`      headers: {`)
    lines.push(headers.join(',\n'))
    lines.push(`      },`)
  }

  // Body
  if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
    const bodyStr = JSON.stringify(body, null, 6)
      .split('\n')
      .map(line => `      ${line}`)
      .join('\n')

    lines.push(`      body: JSON.stringify(${bodyStr})`)
  }

  lines.push(`    });`)
  lines.push('')
  lines.push(`    const data = await response.json();`)
  lines.push('')
  lines.push(`    if (!response.ok) {`)
  lines.push(`      throw new Error(data.error?.message || 'Request failed');`)
  lines.push(`    }`)
  lines.push('')
  lines.push(`    return data;`)
  lines.push(`  } catch (error) {`)
  lines.push(`    console.error('Error:', error);`)
  lines.push(`    throw error;`)
  lines.push(`  }`)
  lines.push(`}`)
  lines.push('')
  lines.push(`makeRequest();`)

  return lines.join('\n')
}

/**
 * Generate Python (requests) code
 */
function generatePython(options: CodeGenerationOptions): string {
  const { method, baseUrl, path, pathParams, queryParams, body, apiKey } = options

  // Build path with params
  const finalPath = pathParams ? replacePathParams(path, pathParams) : path

  const lines: string[] = []

  lines.push(`import requests`)
  lines.push(`from typing import Dict, Any`)
  lines.push('')
  lines.push(`base_url = '${baseUrl}'`)
  if (apiKey) {
    lines.push(`api_key = '${apiKey}'`)
  }
  lines.push('')

  lines.push(`def make_request() -> Dict[str, Any]:`)

  // Headers
  const headers: string[] = []
  if (apiKey) {
    headers.push(`        'X-API-Key': api_key`)
  }
  if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
    headers.push(`        'Content-Type': 'application/json'`)
  }

  if (headers.length > 0) {
    lines.push(`    headers = {`)
    lines.push(headers.join(',\n'))
    lines.push(`    }`)
    lines.push('')
  }

  // Query params
  if (queryParams && Object.keys(queryParams).length > 0) {
    lines.push(`    params = {`)
    Object.entries(queryParams).forEach(([key, value], index, arr) => {
      const comma = index < arr.length - 1 ? ',' : ''
      const valStr = typeof value === 'string' ? `'${value}'` : value
      lines.push(`        '${key}': ${valStr}${comma}`)
    })
    lines.push(`    }`)
    lines.push('')
  }

  // Body
  if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
    const bodyStr = JSON.stringify(body, null, 8)
      .split('\n')
      .map(line => `    ${line}`)
      .join('\n')

    lines.push(`    body = ${bodyStr}`)
    lines.push('')
  }

  // Make request
  const methodLower = method.toLowerCase()
  lines.push(`    response = requests.${methodLower}(`)
  lines.push(`        f'{base_url}${finalPath}',`)

  if (headers.length > 0) {
    lines.push(`        headers=headers,`)
  }
  if (queryParams && Object.keys(queryParams).length > 0) {
    lines.push(`        params=params,`)
  }
  if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
    lines.push(`        json=body`)
  }

  lines.push(`    )`)
  lines.push('')
  lines.push(`    response.raise_for_status()`)
  lines.push(`    return response.json()`)
  lines.push('')
  lines.push(`if __name__ == '__main__':`)
  lines.push(`    result = make_request()`)
  lines.push(`    print(result)`)

  return lines.join('\n')
}

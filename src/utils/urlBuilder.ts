/**
 * Build complete URL with path params and query params
 */
export function buildURL(
  baseUrl: string,
  path: string,
  pathParams?: Record<string, any>,
  queryParams?: Record<string, any>
): string {
  // Replace path parameters
  let finalPath = path
  if (pathParams) {
    Object.entries(pathParams).forEach(([key, value]) => {
      finalPath = finalPath.replace(`:${key}`, encodeURIComponent(String(value)))
    })
  }

  // Build full URL
  const url = new URL(finalPath, baseUrl)

  // Add query parameters
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value))
      }
    })
  }

  return url.toString()
}

/**
 * Build query string from object
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

/**
 * Replace path parameters in a path template
 */
export function replacePathParams(
  path: string,
  params: Record<string, any>
): string {
  let result = path

  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value))
  })

  return result
}

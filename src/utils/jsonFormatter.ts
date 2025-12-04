/**
 * Format JSON string with indentation
 */
export function formatJSON(json: string | object): string {
  try {
    const obj = typeof json === 'string' ? JSON.parse(json) : json
    return JSON.stringify(obj, null, 2)
  } catch (error) {
    return typeof json === 'string' ? json : JSON.stringify(json)
  }
}

/**
 * Validate JSON string
 */
export function isValidJSON(json: string): boolean {
  try {
    JSON.parse(json)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Parse JSON safely
 */
export function parseJSON<T = any>(json: string): T | null {
  try {
    return JSON.parse(json) as T
  } catch (error) {
    return null
  }
}

/**
 * Minify JSON string
 */
export function minifyJSON(json: string | object): string {
  try {
    const obj = typeof json === 'string' ? JSON.parse(json) : json
    return JSON.stringify(obj)
  } catch (error) {
    return typeof json === 'string' ? json : JSON.stringify(json)
  }
}

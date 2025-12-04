import { useState, useEffect } from 'react'
import { formatJSON, isValidJSON } from '@/utils/jsonFormatter'
import Button from '@/components/ui/Button'

interface JSONEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  helperText?: string
  className?: string
}

export default function JSONEditor({
  value,
  onChange,
  placeholder = '{\n  "key": "value"\n}',
  label,
  helperText,
  className = '',
}: JSONEditorProps) {
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState(6)

  // Validate JSON on change
  useEffect(() => {
    if (value.trim() === '') {
      setError(null)
      return
    }

    if (!isValidJSON(value)) {
      setError('Invalid JSON format')
    } else {
      setError(null)
    }
  }, [value])

  // Auto-resize textarea based on content
  useEffect(() => {
    const lineCount = value.split('\n').length
    setRows(Math.max(6, Math.min(lineCount + 1, 20)))
  }, [value])

  const handleFormat = () => {
    try {
      const formatted = formatJSON(value)
      onChange(formatted)
      setError(null)
    } catch (err) {
      setError('Cannot format invalid JSON')
    }
  }

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleFormat}
            disabled={!value.trim() || !!error}
          >
            Format JSON
          </Button>
        </div>
      )}

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm font-mono text-sm
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'}
        `}
        spellCheck={false}
      />

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-700">{helperText}</p>
      )}
    </div>
  )
}

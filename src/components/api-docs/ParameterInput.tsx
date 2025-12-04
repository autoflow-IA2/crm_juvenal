import { Parameter } from '@/types/api-endpoints'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

interface ParameterInputProps {
  parameter: Parameter
  value: any
  onChange: (value: any) => void
}

export default function ParameterInput({ parameter, value, onChange }: ParameterInputProps) {
  const { name, type, required, description, enum: enumValues, example } = parameter

  // Handle enum values with select
  if (enumValues && enumValues.length > 0) {
    const selectOptions = [
      { value: '', label: `Select ${name}` },
      ...enumValues.map((val) => ({ value: val, label: val })),
    ]

    return (
      <div className="mb-3">
        <Select
          label={name}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          options={selectOptions}
          helperText={description}
        />
      </div>
    )
  }

  // Handle different types
  const getInputType = (): string => {
    switch (type) {
      case 'number':
        return 'number'
      case 'date':
        return 'date'
      case 'datetime':
        return 'datetime-local'
      case 'boolean':
        return 'checkbox'
      default:
        return 'text'
    }
  }

  // Checkbox for boolean
  if (type === 'boolean') {
    return (
      <div className="mb-3 flex items-center">
        <input
          type="checkbox"
          id={`param-${name}`}
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor={`param-${name}`} className="ml-2 block text-sm text-gray-700">
          {name}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {description && (
          <p className="text-xs text-gray-700 ml-6">{description}</p>
        )}
      </div>
    )
  }

  // Regular input
  return (
    <Input
      label={name}
      type={getInputType()}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      placeholder={example ? String(example) : `Enter ${name}`}
      helperText={description}
    />
  )
}

import { CodeLanguage } from '@/types/api-endpoints'

interface LanguageSelectorProps {
  language: CodeLanguage
  onChange: (language: CodeLanguage) => void
  className?: string
}

const languages: { value: CodeLanguage; label: string }[] = [
  { value: 'curl', label: 'cURL' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
]

export default function LanguageSelector({ language, onChange, className = '' }: LanguageSelectorProps) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {languages.map((lang) => (
        <button
          key={lang.value}
          onClick={() => onChange(lang.value)}
          className={`
            px-3 py-1.5 rounded-md text-sm font-medium transition-colors
            ${
              language === lang.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}

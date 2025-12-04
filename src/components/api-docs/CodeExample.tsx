import { useRef, useEffect } from 'react'
import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import javascript from 'highlight.js/lib/languages/javascript'
import python from 'highlight.js/lib/languages/python'
import { CodeLanguage } from '@/types/api-endpoints'
import CopyCodeButton from '@/components/markdown/CopyCodeButton'

// Register languages
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('python', python)

interface CodeExampleProps {
  code: string
  language: CodeLanguage
  className?: string
}

const languageMap: Record<CodeLanguage, string> = {
  curl: 'bash',
  javascript: 'javascript',
  python: 'python',
}

export default function CodeExample({ code, language, className = '' }: CodeExampleProps) {
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (codeRef.current) {
      delete codeRef.current.dataset.highlighted
      hljs.highlightElement(codeRef.current)
    }
  }, [code, language])

  const hljsLanguage = languageMap[language]

  return (
    <div className={`relative ${className}`}>
      <CopyCodeButton code={code} />
      <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto relative">
        <code
          ref={codeRef}
          className={`language-${hljsLanguage} text-sm`}
        >
          {code}
        </code>
      </pre>
    </div>
  )
}

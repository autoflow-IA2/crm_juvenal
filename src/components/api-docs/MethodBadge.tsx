import { HTTPMethod } from '@/types/api-endpoints'

interface MethodBadgeProps {
  method: HTTPMethod
  className?: string
}

export default function MethodBadge({ method, className = '' }: MethodBadgeProps) {
  const methodColors: Record<HTTPMethod, string> = {
    GET: 'bg-blue-100 text-blue-700 border-blue-300',
    POST: 'bg-green-100 text-green-700 border-green-300',
    PUT: 'bg-orange-100 text-orange-700 border-orange-300',
    PATCH: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    DELETE: 'bg-red-100 text-red-700 border-red-300',
  }

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold
        border uppercase tracking-wide
        ${methodColors[method]}
        ${className}
      `}
    >
      {method}
    </span>
  )
}

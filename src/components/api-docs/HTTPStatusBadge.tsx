interface HTTPStatusBadgeProps {
  status: number
  statusText?: string
  className?: string
}

export default function HTTPStatusBadge({ status, statusText, className = '' }: HTTPStatusBadgeProps) {
  const getStatusColor = (status: number): string => {
    if (status >= 200 && status < 300) {
      return 'bg-green-100 text-green-700 border-green-300'
    } else if (status >= 400 && status < 500) {
      return 'bg-yellow-100 text-yellow-700 border-yellow-300'
    } else if (status >= 500) {
      return 'bg-red-100 text-red-700 border-red-300'
    }
    return 'bg-gray-100 text-gray-700 border-gray-300'
  }

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium
        border
        ${getStatusColor(status)}
        ${className}
      `}
    >
      {status} {statusText}
    </span>
  )
}

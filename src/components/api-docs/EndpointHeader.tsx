import { LockClosedIcon } from '@heroicons/react/24/outline'
import { APIEndpoint } from '@/types/api-endpoints'
import MethodBadge from './MethodBadge'
import Badge from '@/components/ui/Badge'

interface EndpointHeaderProps {
  endpoint: APIEndpoint
  className?: string
}

export default function EndpointHeader({ endpoint, className = '' }: EndpointHeaderProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Method and Path */}
      <div className="flex items-center space-x-3">
        <MethodBadge method={endpoint.method} />
        <code className="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded">
          {endpoint.path}
        </code>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900">
        {endpoint.title}
      </h3>

      {/* Description */}
      {endpoint.description && (
        <p className="text-sm text-gray-600">
          {endpoint.description}
        </p>
      )}

      {/* Authentication & Scopes */}
      {endpoint.authentication && (
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-xs text-orange-700 bg-orange-50 px-2 py-1 rounded-md border border-orange-200">
            <LockClosedIcon className="h-3.5 w-3.5" />
            <span className="font-medium">Requires Authentication</span>
          </div>

          {endpoint.requiredScopes && endpoint.requiredScopes.length > 0 && (
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500">Scopes:</span>
              {endpoint.requiredScopes.map((scope) => (
                <Badge key={scope} variant="info">
                  {scope}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

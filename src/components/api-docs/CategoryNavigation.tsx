import { useState } from 'react'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { APICategory } from '@/types/api-endpoints'
import MethodBadge from './MethodBadge'

interface CategoryNavigationProps {
  categories: APICategory[]
  className?: string
}

export default function CategoryNavigation({ categories, className = '' }: CategoryNavigationProps) {
  // Track which categories are expanded (all by default)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map((c) => c.name))
  )

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(categoryName)) {
        next.delete(categoryName)
      } else {
        next.add(categoryName)
      }
      return next
    })
  }

  const scrollToEndpoint = (endpointId: string) => {
    const element = document.getElementById(endpointId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className={`space-y-2 ${className}`}>
      <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide px-3 mb-3">
        Endpoints
      </h2>

      {categories.map((category) => {
        const isExpanded = expandedCategories.has(category.name)

        return (
          <div key={category.name} className="space-y-1">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.name)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <span>{category.name}</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">({category.endpoints.length})</span>
                {isExpanded ? (
                  <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </button>

            {/* Endpoints List */}
            {isExpanded && (
              <div className="ml-2 space-y-1">
                {category.endpoints.map((endpoint) => (
                  <button
                    key={endpoint.id}
                    onClick={() => scrollToEndpoint(endpoint.id)}
                    className="w-full flex items-start space-x-2 px-3 py-2 text-xs hover:bg-gray-50 rounded-md transition-colors text-left group"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <MethodBadge method={endpoint.method} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-700 group-hover:text-primary-600 truncate">
                        {endpoint.title}
                      </p>
                      <p className="text-gray-500 font-mono truncate">{endpoint.path}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}

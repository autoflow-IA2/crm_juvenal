import Card from '@/components/ui/Card'
import APIKeyManager from '@/components/api-docs/APIKeyManager'
import CategoryNavigation from '@/components/api-docs/CategoryNavigation'
import EndpointCard from '@/components/api-docs/EndpointCard'
import { apiEndpointsData } from '@/data/api-endpoints-data'
import { useAPIKey } from '@/hooks/useAPIKey'

export default function APIDocsPage() {
  const { apiKey } = useAPIKey()

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Documentação da API</h1>
        <p className="text-gray-600 mt-1">
          Referência completa e interativa da REST API do Juvenal CRM
        </p>
      </div>

      {/* API Key Manager - Sticky */}
      <div className="sticky top-0 z-10 mb-6">
        <APIKeyManager />
      </div>

      <div className="flex gap-6">
        {/* Category Navigation - Desktop Only */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <Card className="p-4">
              <CategoryNavigation
                categories={apiEndpointsData}
                className="max-h-[calc(100vh-250px)] overflow-y-auto"
              />
            </Card>
          </div>
        </aside>

        {/* Main Content - Endpoint Cards */}
        <div className="flex-1 min-w-0 space-y-6">
          {apiEndpointsData.map((category) => (
            <div key={category.name}>
              {/* Category Header */}
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {category.name}
              </h2>

              {/* Endpoints in this category */}
              <div className="space-y-4">
                {category.endpoints.map((endpoint) => (
                  <EndpointCard
                    key={endpoint.id}
                    endpoint={endpoint}
                    apiKey={apiKey}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

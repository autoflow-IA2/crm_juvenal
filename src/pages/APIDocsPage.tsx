import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Card from '@/components/ui/Card'
import APIKeyManager from '@/components/api-docs/APIKeyManager'
import CategoryNavigation from '@/components/api-docs/CategoryNavigation'
import EndpointCard from '@/components/api-docs/EndpointCard'
import { apiEndpointsData } from '@/data/api-endpoints-data'
import { useAPIKey } from '@/hooks/useAPIKey'

export default function APIDocsPage() {
  const { apiKey } = useAPIKey()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Mobile Menu Button - Fixed Top Right */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-white rounded-lg shadow-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        aria-label="Abrir navegação"
      >
        <Bars3Icon className="h-6 w-6 text-gray-700" />
      </button>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto animate-slide-in-right">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300">
                <h3 className="text-lg font-semibold text-gray-900">Navegação</h3>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  aria-label="Fechar navegação"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-700" />
                </button>
              </div>
              <CategoryNavigation
                categories={apiEndpointsData}
                onNavigate={() => setMobileMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Documentação da API</h1>
        <p className="text-gray-700 mt-1">
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

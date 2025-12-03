import Card from '@/components/ui/Card'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Bem-vindo ao Juvenal CRM</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <h3 className="text-sm font-medium text-gray-600">Total de Clientes</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-gray-600">Sessões Hoje</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-gray-600">Receita Mensal</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">R$ 0,00</p>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-gray-600">Próximas Sessões</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sessões de Hoje</h2>
        <p className="text-gray-500 text-center py-8">Nenhuma sessão agendada para hoje</p>
      </Card>
    </div>
  )
}

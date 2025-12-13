import { useState } from 'react'
import {
  ClipboardDocumentIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CodeBracketIcon,
  ServerIcon,
  KeyIcon,
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  CommandLineIcon,
  EyeIcon,
  EyeSlashIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

interface EndpointProps {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  path: string
  description: string
  children?: React.ReactNode
}

const methodColors = {
  GET: 'bg-green-100 text-green-700 border-green-300',
  POST: 'bg-blue-100 text-blue-700 border-blue-300',
  PATCH: 'bg-amber-100 text-amber-700 border-amber-300',
  DELETE: 'bg-red-100 text-red-700 border-red-300',
}

function CopyButton({ text, label = 'Copiar' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors"
      title="Copiar"
    >
      {copied ? (
        <>
          <CheckIcon className="h-4 w-4" />
          Copiado!
        </>
      ) : (
        <>
          <ClipboardDocumentIcon className="h-4 w-4" />
          {label}
        </>
      )}
    </button>
  )
}

function CopyButtonSmall({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded hover:bg-gray-700 transition-colors"
      title="Copiar"
    >
      {copied ? (
        <CheckIcon className="h-4 w-4 text-green-400" />
      ) : (
        <ClipboardDocumentIcon className="h-4 w-4 text-gray-400" />
      )}
    </button>
  )
}

function CodeBlock({ code, language = 'json' }: { code: string; language?: string }) {
  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs text-gray-400 uppercase">{language}</span>
        <CopyButtonSmall text={code} />
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code className="text-gray-300">{code}</code>
      </pre>
    </div>
  )
}

// Gerador de cURL interativo
function CurlGenerator() {
  const [baseUrl, setBaseUrl] = useState('http://localhost:3001')
  const [apiKey, setApiKey] = useState('')
  const [method, setMethod] = useState<'GET' | 'POST' | 'PATCH' | 'DELETE'>('POST')
  const [endpoint, setEndpoint] = useState('/api/agendamentos')
  const [showCurl, setShowCurl] = useState(false)
  const [body, setBody] = useState(`{
  "client_id": "uuid-do-cliente",
  "session_type": "sessao_individual",
  "date": "2025-12-25",
  "start_time": "14:00",
  "end_time": "15:00",
  "duration": 60,
  "price": 200.00,
  "payment_status": "pendente",
  "status": "agendado"
}`)

  const endpoints = [
    // Health
    { value: '/api/health', label: 'Health Check', method: 'GET' as const },
    // Agendamentos
    { value: '/api/agendamentos', label: 'Listar Agendamentos', method: 'GET' as const },
    { value: '/api/agendamentos/hoje', label: 'Agendamentos de Hoje', method: 'GET' as const },
    { value: '/api/agendamentos/proximos', label: 'Próximos Agendamentos', method: 'GET' as const },
    { value: '/api/agendamentos/stats', label: 'Estatísticas Agendamentos', method: 'GET' as const },
    { value: '/api/agendamentos', label: 'Criar Agendamento', method: 'POST' as const },
    { value: '/api/agendamentos/:id', label: 'Buscar Agendamento por ID', method: 'GET' as const },
    { value: '/api/agendamentos/:id', label: 'Atualizar Agendamento', method: 'PATCH' as const },
    { value: '/api/agendamentos/:id/status', label: 'Atualizar Status Agendamento', method: 'PATCH' as const },
    { value: '/api/agendamentos/:id/payment', label: 'Atualizar Pagamento', method: 'PATCH' as const },
    { value: '/api/agendamentos/:id', label: 'Deletar Agendamento', method: 'DELETE' as const },
    { value: '/api/agendamentos/verificar-disponibilidade', label: 'Verificar Disponibilidade', method: 'POST' as const },
    { value: '/api/agendamentos/finalizar-passados', label: 'Finalizar Passados', method: 'POST' as const },
    // Clientes
    { value: '/api/clientes', label: 'Listar Clientes', method: 'GET' as const },
    { value: '/api/clientes/stats', label: 'Estatísticas Clientes', method: 'GET' as const },
    { value: '/api/clientes/ativos', label: 'Clientes Ativos', method: 'GET' as const },
    { value: '/api/clientes/search', label: 'Buscar Clientes', method: 'GET' as const },
    { value: '/api/clientes/:id', label: 'Buscar Cliente por ID', method: 'GET' as const },
    { value: '/api/clientes', label: 'Criar Cliente', method: 'POST' as const },
    { value: '/api/clientes/:id', label: 'Atualizar Cliente', method: 'PATCH' as const },
    { value: '/api/clientes/:id/status', label: 'Atualizar Status Cliente', method: 'PATCH' as const },
    { value: '/api/clientes/:id', label: 'Deletar Cliente', method: 'DELETE' as const },
  ]

  const handleEndpointChange = (value: string) => {
    const selected = endpoints.find(e => `${e.method}:${e.value}` === value)
    if (selected) {
      setEndpoint(selected.value)
      setMethod(selected.method)

      // Atualizar body baseado no endpoint
      if (selected.value === '/api/agendamentos' && selected.method === 'POST') {
        setBody(`{
  "user_id": "uuid-do-usuario",
  "client_id": "uuid-do-cliente",
  "session_type": "sessao_individual",
  "date": "2025-12-25",
  "start_time": "14:00",
  "duration": 60,
  "price": 200.00
}`)
      } else if (selected.value === '/api/agendamentos/:id/status') {
        setBody(`{
  "status": "confirmado"
}`)
      } else if (selected.value === '/api/agendamentos/:id/payment') {
        setBody(`{
  "payment_status": "pago",
  "payment_method": "pix"
}`)
      } else if (selected.value === '/api/agendamentos/verificar-disponibilidade') {
        setBody(`{
  "date": "2025-12-25",
  "startTime": "14:00",
  "endTime": "15:00"
}`)
      } else if (selected.method === 'PATCH' && selected.value === '/api/agendamentos/:id') {
        setBody(`{
  "notes": "Observações atualizadas"
}`)
      } else if (selected.value === '/api/clientes' && selected.method === 'POST') {
        setBody(`{
  "user_id": "uuid-do-usuario",
  "full_name": "Nome do Cliente",
  "phone": "(11) 99999-9999",
  "email": "cliente@email.com",
  "birth_date": "1990-01-15",
  "cpf": "123.456.789-00",
  "city": "São Paulo",
  "state": "SP"
}`)
      } else if (selected.value === '/api/clientes/:id/status') {
        setBody(`{
  "status": "inactive"
}`)
      } else if (selected.method === 'PATCH' && selected.value === '/api/clientes/:id') {
        setBody(`{
  "full_name": "Nome Atualizado",
  "phone": "(11) 88888-8888"
}`)
      } else {
        setBody('')
      }
    }
  }

  const generateCurl = () => {
    let curl = `curl -X ${method} "${baseUrl}${endpoint}"`

    if (apiKey) {
      curl += ` \\\n  -H "X-API-Key: ${apiKey}"`
    } else {
      curl += ` \\\n  -H "X-API-Key: sua-api-key-aqui"`
    }

    if ((method === 'POST' || method === 'PATCH') && body.trim()) {
      curl += ` \\\n  -H "Content-Type: application/json"`
      curl += ` \\\n  -d '${body.replace(/\n/g, '\n')}'`
    }

    return curl
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <CommandLineIcon className="h-6 w-6 text-white" />
          <h3 className="text-lg font-bold text-white">Gerador de cURL para n8n</h3>
        </div>
        <p className="text-primary-100 text-sm mt-1">
          Preencha os campos e copie o comando cURL para usar no HTTP Request do n8n
        </p>
      </div>

      <div className="p-6 space-y-4">
        {/* Base URL e API Key */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base URL</label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="http://localhost:3001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="sua-api-key-aqui"
            />
          </div>
        </div>

        {/* Endpoint */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint</label>
          <select
            value={`${method}:${endpoint}`}
            onChange={(e) => handleEndpointChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {endpoints.map((ep) => (
              <option key={`${ep.method}:${ep.value}:${ep.label}`} value={`${ep.method}:${ep.value}`}>
                [{ep.method}] {ep.label} - {ep.value}
              </option>
            ))}
          </select>
        </div>

        {/* Body (para POST/PATCH) */}
        {(method === 'POST' || method === 'PATCH') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body (JSON)</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder='{"campo": "valor"}'
            />
          </div>
        )}

        {/* Botões */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCurl(!showCurl)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            {showCurl ? (
              <>
                <EyeSlashIcon className="h-5 w-5" />
                Esconder cURL
              </>
            ) : (
              <>
                <EyeIcon className="h-5 w-5" />
                Mostrar cURL
              </>
            )}
          </button>
          <CopyButton text={generateCurl()} label="Copiar cURL" />
        </div>

        {/* Preview do cURL */}
        {showCurl && (
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
              <span className="text-xs text-gray-400 uppercase">cURL</span>
              <CopyButtonSmall text={generateCurl()} />
            </div>
            <pre className="p-4 overflow-x-auto text-sm">
              <code className="text-green-400">{generateCurl()}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

function Endpoint({ method, path, description, children }: EndpointProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
      >
        <span className={`px-3 py-1 rounded text-xs font-bold border ${methodColors[method]}`}>
          {method}
        </span>
        <code className="text-sm font-mono text-gray-700 flex-1">{path}</code>
        <span className="text-sm text-gray-500 hidden md:block">{description}</span>
        {isOpen ? (
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronRightIcon className="h-5 w-5 text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-600 mb-4 md:hidden">{description}</p>
          {children}
        </div>
      )}
    </div>
  )
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Icon className="h-6 w-6 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </section>
  )
}

export default function ApiDocsPage() {
  const baseUrl = 'http://localhost:3001'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <CodeBracketIcon className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Juvenal CRM API</h1>
              <p className="text-primary-100 text-lg">Documentação v1.0.0</p>
            </div>
          </div>
          <p className="text-primary-100 max-w-2xl mt-4">
            API REST para integração com ferramentas externas. Gerencie agendamentos,
            verifique disponibilidade e automatize processos do seu CRM.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Gerador de cURL */}
        <Section title="Gerador de cURL" icon={CommandLineIcon}>
          <CurlGenerator />
        </Section>

        {/* Quick Start */}
        <Section title="Início Rápido" icon={ServerIcon}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Base URL</h3>
              <CodeBlock code={baseUrl} language="url" />
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Autenticação</h3>
              <p className="text-gray-600 text-sm mb-3">
                Todas as requisições requerem o header <code className="bg-gray-100 px-1.5 py-0.5 rounded text-primary-600">X-API-Key</code>
              </p>
              <CodeBlock code="X-API-Key: sua-chave-api-aqui" language="header" />
            </div>
          </div>
        </Section>

        {/* Response Format */}
        <Section title="Formato de Resposta" icon={CodeBracketIcon}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">SUCESSO</span>
              </div>
              <CodeBlock
                code={`{
  "success": true,
  "data": { ... },
  "message": "Operação realizada com sucesso"
}`}
              />
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">ERRO</span>
              </div>
              <CodeBlock
                code={`{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": [ ... ]
  }
}`}
              />
            </div>
          </div>
        </Section>

        {/* Health Check */}
        <Section title="Health Check" icon={ServerIcon}>
          <Endpoint method="GET" path="/api/health" description="Verifica se a API está funcionando">
            <p className="text-gray-600 mb-4">Retorna o status da API e informações do servidor.</p>
            <h4 className="font-semibold text-gray-900 mb-2">Resposta:</h4>
            <CodeBlock
              code={`{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2025-12-09T10:30:00.000Z",
    "uptime": 12345,
    "environment": "development"
  },
  "message": "API está funcionando corretamente"
}`}
            />
          </Endpoint>
        </Section>

        {/* Agendamentos */}
        <Section title="Agendamentos" icon={CalendarIcon}>
          {/* Listar */}
          <Endpoint method="GET" path="/api/agendamentos" description="Lista agendamentos com filtros">
            <h4 className="font-semibold text-gray-900 mb-2">Query Parameters:</h4>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4">Parâmetro</th>
                    <th className="text-left py-2 pr-4">Tipo</th>
                    <th className="text-left py-2">Descrição</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b"><td className="py-2 pr-4"><code>date</code></td><td className="pr-4">string</td><td>Data específica (YYYY-MM-DD)</td></tr>
                  <tr className="border-b"><td className="py-2 pr-4"><code>dateStart</code></td><td className="pr-4">string</td><td>Data inicial do período</td></tr>
                  <tr className="border-b"><td className="py-2 pr-4"><code>dateEnd</code></td><td className="pr-4">string</td><td>Data final do período</td></tr>
                  <tr className="border-b"><td className="py-2 pr-4"><code>status</code></td><td className="pr-4">string</td><td>Status do agendamento</td></tr>
                  <tr className="border-b"><td className="py-2 pr-4"><code>paymentStatus</code></td><td className="pr-4">string</td><td>Status do pagamento</td></tr>
                  <tr className="border-b"><td className="py-2 pr-4"><code>sessionType</code></td><td className="pr-4">string</td><td>Tipo de sessão</td></tr>
                  <tr className="border-b"><td className="py-2 pr-4"><code>clientId</code></td><td className="pr-4">uuid</td><td>ID do cliente</td></tr>
                  <tr><td className="py-2 pr-4"><code>clientName</code></td><td className="pr-4">string</td><td>Nome do cliente (busca parcial)</td></tr>
                </tbody>
              </table>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Exemplo:</h4>
            <CodeBlock
              code={`curl -X GET "${baseUrl}/api/agendamentos?dateStart=2025-12-01&status=confirmado" \\
  -H "X-API-Key: sua-api-key"`}
              language="bash"
            />
          </Endpoint>

          {/* Hoje */}
          <Endpoint method="GET" path="/api/agendamentos/hoje" description="Lista agendamentos de hoje">
            <p className="text-gray-600 mb-4">Retorna todos os agendamentos do dia atual.</p>
            <CodeBlock
              code={`curl -X GET "${baseUrl}/api/agendamentos/hoje" \\
  -H "X-API-Key: sua-api-key"`}
              language="bash"
            />
          </Endpoint>

          {/* Próximos */}
          <Endpoint method="GET" path="/api/agendamentos/proximos" description="Lista próximos agendamentos">
            <p className="text-gray-600 mb-4">Retorna os próximos agendamentos futuros.</p>
            <h4 className="font-semibold text-gray-900 mb-2">Query Parameters:</h4>
            <p className="text-gray-600 text-sm mb-4"><code className="bg-gray-100 px-1.5 py-0.5 rounded">limit</code> - Quantidade máxima (padrão: 10)</p>
            <CodeBlock
              code={`curl -X GET "${baseUrl}/api/agendamentos/proximos?limit=5" \\
  -H "X-API-Key: sua-api-key"`}
              language="bash"
            />
          </Endpoint>

          {/* Por ID */}
          <Endpoint method="GET" path="/api/agendamentos/:id" description="Busca agendamento por ID">
            <CodeBlock
              code={`curl -X GET "${baseUrl}/api/agendamentos/uuid-do-agendamento" \\
  -H "X-API-Key: sua-api-key"`}
              language="bash"
            />
          </Endpoint>

          {/* Criar */}
          <Endpoint method="POST" path="/api/agendamentos" description="Cria novo agendamento">
            <h4 className="font-semibold text-gray-900 mb-2">Body (JSON):</h4>
            <CodeBlock
              code={`{
  "client_id": "uuid-do-cliente",
  "session_type": "sessao_individual",
  "date": "2025-12-25",
  "start_time": "14:00",
  "end_time": "15:00",
  "duration": 60,
  "price": 200.00,
  "payment_status": "pendente",
  "payment_method": "pix",
  "status": "agendado",
  "notes": "Observações do agendamento"
}`}
            />
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Tipos de Sessão:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li><code className="bg-gray-100 px-1.5 py-0.5 rounded">sessao_individual</code></li>
                  <li><code className="bg-gray-100 px-1.5 py-0.5 rounded">sessao_casal</code></li>
                  <li><code className="bg-gray-100 px-1.5 py-0.5 rounded">sessao_familia</code></li>
                  <li><code className="bg-gray-100 px-1.5 py-0.5 rounded">sessao_grupo</code></li>
                  <li><code className="bg-gray-100 px-1.5 py-0.5 rounded">primeira_consulta</code></li>
                  <li><code className="bg-gray-100 px-1.5 py-0.5 rounded">retorno</code></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Status:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li><code className="bg-gray-100 px-1.5 py-0.5 rounded">agendado</code></li>
                  <li><code className="bg-gray-100 px-1.5 py-0.5 rounded">confirmado</code></li>
                  <li><code className="bg-gray-100 px-1.5 py-0.5 rounded">em_andamento</code></li>
                  <li><code className="bg-gray-100 px-1.5 py-0.5 rounded">concluido</code></li>
                  <li><code className="bg-gray-100 px-1.5 py-0.5 rounded">cancelado</code></li>
                  <li><code className="bg-gray-100 px-1.5 py-0.5 rounded">nao_compareceu</code></li>
                </ul>
              </div>
            </div>
          </Endpoint>

          {/* Atualizar */}
          <Endpoint method="PATCH" path="/api/agendamentos/:id" description="Atualiza agendamento">
            <p className="text-gray-600 mb-4">Atualiza campos específicos de um agendamento.</p>
            <CodeBlock
              code={`curl -X PATCH "${baseUrl}/api/agendamentos/uuid" \\
  -H "X-API-Key: sua-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{"notes": "Atualização das observações"}'`}
              language="bash"
            />
          </Endpoint>

          {/* Atualizar Status */}
          <Endpoint method="PATCH" path="/api/agendamentos/:id/status" description="Atualiza status">
            <CodeBlock
              code={`curl -X PATCH "${baseUrl}/api/agendamentos/uuid/status" \\
  -H "X-API-Key: sua-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{"status": "confirmado"}'`}
              language="bash"
            />
          </Endpoint>

          {/* Atualizar Pagamento */}
          <Endpoint method="PATCH" path="/api/agendamentos/:id/payment" description="Atualiza pagamento">
            <CodeBlock
              code={`curl -X PATCH "${baseUrl}/api/agendamentos/uuid/payment" \\
  -H "X-API-Key: sua-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{"payment_status": "pago", "payment_method": "pix"}'`}
              language="bash"
            />
            <h4 className="font-semibold text-gray-900 mt-4 mb-2">Status de Pagamento:</h4>
            <div className="flex flex-wrap gap-2">
              {['pendente', 'pago', 'parcial', 'cancelado', 'reembolsado'].map(s => (
                <code key={s} className="bg-gray-100 px-2 py-1 rounded text-sm">{s}</code>
              ))}
            </div>
            <h4 className="font-semibold text-gray-900 mt-4 mb-2">Métodos de Pagamento:</h4>
            <div className="flex flex-wrap gap-2">
              {['dinheiro', 'pix', 'cartao_credito', 'cartao_debito', 'transferencia', 'boleto'].map(s => (
                <code key={s} className="bg-gray-100 px-2 py-1 rounded text-sm">{s}</code>
              ))}
            </div>
          </Endpoint>

          {/* Deletar */}
          <Endpoint method="DELETE" path="/api/agendamentos/:id" description="Remove agendamento">
            <CodeBlock
              code={`curl -X DELETE "${baseUrl}/api/agendamentos/uuid" \\
  -H "X-API-Key: sua-api-key"`}
              language="bash"
            />
          </Endpoint>

          {/* Verificar Disponibilidade */}
          <Endpoint method="POST" path="/api/agendamentos/verificar-disponibilidade" description="Verifica conflitos de horário">
            <p className="text-gray-600 mb-4">Verifica se há conflitos de horário antes de criar um agendamento.</p>
            <h4 className="font-semibold text-gray-900 mb-2">Body:</h4>
            <CodeBlock
              code={`{
  "date": "2025-12-25",
  "startTime": "14:00",
  "endTime": "15:00",
  "excludeId": "uuid-opcional"
}`}
            />
            <h4 className="font-semibold text-gray-900 mt-4 mb-2">Resposta:</h4>
            <CodeBlock
              code={`{
  "success": true,
  "data": {
    "disponivel": false,
    "conflitos": [
      {
        "id": "uuid",
        "client_name": "João Silva",
        "date": "2025-12-25",
        "start_time": "14:00",
        "end_time": "15:00",
        "session_type": "sessao_individual"
      }
    ]
  },
  "message": "1 conflito(s) encontrado(s)"
}`}
            />
          </Endpoint>

          {/* Finalizar Passados */}
          <Endpoint method="POST" path="/api/agendamentos/finalizar-passados" description="Finaliza agendamentos passados">
            <p className="text-gray-600 mb-4">
              Finaliza automaticamente agendamentos que já passaram. Ideal para uso com cron jobs.
            </p>
            <CodeBlock
              code={`curl -X POST "${baseUrl}/api/agendamentos/finalizar-passados" \\
  -H "X-API-Key: sua-api-key"`}
              language="bash"
            />
            <h4 className="font-semibold text-gray-900 mt-4 mb-2">Resposta:</h4>
            <CodeBlock
              code={`{
  "success": true,
  "data": {
    "finalizados": 5,
    "ids": ["id1", "id2", "id3", "id4", "id5"]
  },
  "message": "5 agendamento(s) finalizado(s)"
}`}
            />
          </Endpoint>
        </Section>

        {/* Estatísticas */}
        <Section title="Estatísticas" icon={ChartBarIcon}>
          <Endpoint method="GET" path="/api/agendamentos/stats" description="Retorna estatísticas">
            <p className="text-gray-600 mb-4">Retorna estatísticas completas dos agendamentos.</p>
            <CodeBlock
              code={`{
  "success": true,
  "data": {
    "total": 150,
    "hoje": 5,
    "semana": 25,
    "mes": 80,
    "porStatus": {
      "agendado": 30,
      "confirmado": 45,
      "em_andamento": 2,
      "concluido": 60,
      "cancelado": 10,
      "nao_compareceu": 3
    },
    "porTipo": {
      "sessao_individual": 100,
      "sessao_casal": 20,
      "sessao_familia": 10,
      "sessao_grupo": 5,
      "primeira_consulta": 10,
      "retorno": 5
    },
    "receitaMes": 15000.00,
    "receitaPendente": 3500.00
  }
}`}
            />
          </Endpoint>
        </Section>

        {/* Clientes */}
        <Section title="Clientes" icon={UserGroupIcon}>
          {/* Listar */}
          <Endpoint method="GET" path="/api/clientes" description="Lista clientes com filtros">
            <h4 className="font-semibold text-gray-900 mb-2">Query Parameters:</h4>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4">Parâmetro</th>
                    <th className="text-left py-2 pr-4">Tipo</th>
                    <th className="text-left py-2">Descrição</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b"><td className="py-2 pr-4"><code>status</code></td><td className="pr-4">string</td><td>active, inactive, archived</td></tr>
                  <tr className="border-b"><td className="py-2 pr-4"><code>search</code></td><td className="pr-4">string</td><td>Busca por nome, email ou telefone</td></tr>
                  <tr className="border-b"><td className="py-2 pr-4"><code>city</code></td><td className="pr-4">string</td><td>Filtrar por cidade</td></tr>
                  <tr><td className="py-2 pr-4"><code>state</code></td><td className="pr-4">string</td><td>Filtrar por estado (UF)</td></tr>
                </tbody>
              </table>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Exemplo:</h4>
            <CodeBlock
              code={`curl -X GET "${baseUrl}/api/clientes?status=active&search=maria" \\
  -H "X-API-Key: sua-api-key"`}
              language="bash"
            />
          </Endpoint>

          {/* Estatísticas */}
          <Endpoint method="GET" path="/api/clientes/stats" description="Estatísticas de clientes">
            <p className="text-gray-600 mb-4">Retorna estatísticas completas dos clientes.</p>
            <CodeBlock
              code={`{
  "success": true,
  "data": {
    "total": 150,
    "ativos": 120,
    "inativos": 20,
    "arquivados": 10,
    "novosEsteMes": 5,
    "porCidade": {
      "são paulo": 80,
      "rio de janeiro": 40,
      "belo horizonte": 30
    }
  },
  "message": "Estatísticas obtidas com sucesso"
}`}
            />
          </Endpoint>

          {/* Ativos */}
          <Endpoint method="GET" path="/api/clientes/ativos" description="Lista apenas clientes ativos">
            <p className="text-gray-600 mb-4">Retorna apenas clientes com status "active". Ideal para preencher dropdowns.</p>
            <CodeBlock
              code={`curl -X GET "${baseUrl}/api/clientes/ativos" \\
  -H "X-API-Key: sua-api-key"`}
              language="bash"
            />
          </Endpoint>

          {/* Buscar */}
          <Endpoint method="GET" path="/api/clientes/search" description="Busca clientes por termo">
            <p className="text-gray-600 mb-4">Busca clientes por nome, email ou telefone. Retorna no máximo 20 resultados.</p>
            <h4 className="font-semibold text-gray-900 mb-2">Query Parameters:</h4>
            <p className="text-gray-600 text-sm mb-4"><code className="bg-gray-100 px-1.5 py-0.5 rounded">q</code> - Termo de busca (obrigatório)</p>
            <CodeBlock
              code={`curl -X GET "${baseUrl}/api/clientes/search?q=maria" \\
  -H "X-API-Key: sua-api-key"`}
              language="bash"
            />
          </Endpoint>

          {/* Por ID */}
          <Endpoint method="GET" path="/api/clientes/:id" description="Busca cliente por ID">
            <CodeBlock
              code={`curl -X GET "${baseUrl}/api/clientes/uuid-do-cliente" \\
  -H "X-API-Key: sua-api-key"`}
              language="bash"
            />
          </Endpoint>

          {/* Criar */}
          <Endpoint method="POST" path="/api/clientes" description="Cria novo cliente">
            <h4 className="font-semibold text-gray-900 mb-2">Body (JSON):</h4>
            <CodeBlock
              code={`{
  "user_id": "uuid-do-usuario",
  "full_name": "Maria Silva",
  "phone": "(11) 99999-9999",
  "email": "maria@email.com",
  "birth_date": "1990-05-15",
  "cpf": "123.456.789-00",
  "address": "Rua das Flores, 123",
  "city": "São Paulo",
  "state": "SP",
  "zip_code": "01234-567",
  "emergency_contact": "João Silva",
  "emergency_phone": "(11) 88888-8888",
  "notes": "Observações sobre o cliente"
}`}
            />
            <div className="mt-4">
              <h4 className="font-semibold text-gray-900 mb-2">Campos Obrigatórios:</h4>
              <div className="flex flex-wrap gap-2">
                {['user_id', 'full_name', 'phone'].map(s => (
                  <code key={s} className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">{s}</code>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold text-gray-900 mb-2">Campos Opcionais:</h4>
              <div className="flex flex-wrap gap-2">
                {['email', 'birth_date', 'cpf', 'address', 'city', 'state', 'zip_code', 'emergency_contact', 'emergency_phone', 'notes', 'status'].map(s => (
                  <code key={s} className="bg-gray-100 px-2 py-1 rounded text-sm">{s}</code>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold text-gray-900 mb-2">Status:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li><code className="bg-gray-100 px-1.5 py-0.5 rounded">active</code> - Ativo (padrão)</li>
                <li><code className="bg-gray-100 px-1.5 py-0.5 rounded">inactive</code> - Inativo</li>
                <li><code className="bg-gray-100 px-1.5 py-0.5 rounded">archived</code> - Arquivado</li>
              </ul>
            </div>
          </Endpoint>

          {/* Atualizar */}
          <Endpoint method="PATCH" path="/api/clientes/:id" description="Atualiza cliente">
            <p className="text-gray-600 mb-4">Atualiza campos específicos de um cliente.</p>
            <CodeBlock
              code={`curl -X PATCH "${baseUrl}/api/clientes/uuid" \\
  -H "X-API-Key: sua-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{"full_name": "Novo Nome", "phone": "(11) 77777-7777"}'`}
              language="bash"
            />
          </Endpoint>

          {/* Atualizar Status */}
          <Endpoint method="PATCH" path="/api/clientes/:id/status" description="Atualiza status do cliente">
            <CodeBlock
              code={`curl -X PATCH "${baseUrl}/api/clientes/uuid/status" \\
  -H "X-API-Key: sua-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{"status": "inactive"}'`}
              language="bash"
            />
          </Endpoint>

          {/* Deletar */}
          <Endpoint method="DELETE" path="/api/clientes/:id" description="Remove cliente">
            <p className="text-gray-600 mb-4">
              <strong>Atenção:</strong> Não é possível excluir um cliente que possui agendamentos.
              Neste caso, altere o status para "archived".
            </p>
            <CodeBlock
              code={`curl -X DELETE "${baseUrl}/api/clientes/uuid" \\
  -H "X-API-Key: sua-api-key"`}
              language="bash"
            />
          </Endpoint>

          {/* Resposta Exemplo */}
          <Endpoint method="GET" path="/api/clientes/:id" description="Exemplo de resposta">
            <p className="text-gray-600 mb-4">Todos os endpoints de cliente retornam os campos em português:</p>
            <CodeBlock
              code={`{
  "success": true,
  "data": {
    "id": "uuid",
    "nome": "Maria Silva",
    "email": "maria@email.com",
    "telefone": "(11) 99999-9999",
    "data_nascimento": "1990-05-15",
    "cpf": "123.456.789-00",
    "endereco": "Rua das Flores, 123",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234-567",
    "contato_emergencia": "João Silva",
    "telefone_emergencia": "(11) 88888-8888",
    "status": "active",
    "observacoes": "Cliente VIP",
    "criado_em": "2025-01-15T10:30:00Z",
    "atualizado_em": "2025-01-15T10:30:00Z"
  },
  "message": "Cliente encontrado"
}`}
            />
          </Endpoint>
        </Section>

        {/* Códigos de Erro */}
        <Section title="Códigos de Erro" icon={KeyIcon}>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">Código</th>
                  <th className="text-left py-3 px-4 font-semibold">HTTP</th>
                  <th className="text-left py-3 px-4 font-semibold">Descrição</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-t"><td className="py-3 px-4"><code>UNAUTHORIZED</code></td><td>401</td><td>API Key não fornecida</td></tr>
                <tr className="border-t"><td className="py-3 px-4"><code>FORBIDDEN</code></td><td>403</td><td>API Key inválida</td></tr>
                <tr className="border-t"><td className="py-3 px-4"><code>NOT_FOUND</code></td><td>404</td><td>Recurso não encontrado</td></tr>
                <tr className="border-t"><td className="py-3 px-4"><code>VALIDATION_ERROR</code></td><td>400</td><td>Dados inválidos</td></tr>
                <tr className="border-t"><td className="py-3 px-4"><code>CONFLICT</code></td><td>409</td><td>Conflito de dados</td></tr>
                <tr className="border-t"><td className="py-3 px-4"><code>DATABASE_ERROR</code></td><td>500</td><td>Erro no banco de dados</td></tr>
                <tr className="border-t"><td className="py-3 px-4"><code>INTERNAL_ERROR</code></td><td>500</td><td>Erro interno do servidor</td></tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* Cron Jobs */}
        <Section title="Automação (Cron Jobs)" icon={ClockIcon}>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <p className="text-gray-600 mb-4">
              Configure um cron job para finalizar automaticamente agendamentos passados:
            </p>
            <h4 className="font-semibold text-gray-900 mb-2">Linux/Mac (crontab -e):</h4>
            <CodeBlock
              code={`# Executa diariamente às 2h da manhã
0 2 * * * curl -X POST ${baseUrl}/api/agendamentos/finalizar-passados -H "X-API-Key: sua-api-key"`}
              language="bash"
            />
            <h4 className="font-semibold text-gray-900 mt-4 mb-2">Windows (PowerShell):</h4>
            <CodeBlock
              code={`$headers = @{ "X-API-Key" = "sua-api-key" }
Invoke-RestMethod -Uri "${baseUrl}/api/agendamentos/finalizar-passados" -Method POST -Headers $headers`}
              language="powershell"
            />
          </div>
        </Section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>Juvenal CRM API - v1.0.0</p>
          <p className="text-sm mt-2">Desenvolvido para integração com ferramentas externas</p>
        </div>
      </footer>
    </div>
  )
}

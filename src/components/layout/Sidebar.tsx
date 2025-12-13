import { NavLink } from 'react-router-dom'
import {
  HomeIcon,
  UsersIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface SidebarProps {
  className?: string
  onClose?: () => void
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Clientes', href: '/clients', icon: UsersIcon },
  { name: 'Agendamentos', href: '/appointments', icon: CalendarIcon },
  { name: 'Financeiro', href: '/finance', icon: CurrencyDollarIcon },
]

export default function Sidebar({ className = '', onClose }: SidebarProps) {
  return (
    <div className={`w-64 bg-white border-r border-gray-200 flex flex-col ${className}`}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-600">Programando Pensamentos CRM</h1>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          © 2024 Programando Pensamentos CRM
        </p>
      </div>
    </div>
  )
}

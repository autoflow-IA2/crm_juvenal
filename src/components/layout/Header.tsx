import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bars3Icon, UserCircleIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { authService } from '@/services/auth'
import { useAuth } from '@/hooks/useAuth'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      await authService.signOut()
      navigate('/login')
    }
    setDropdownOpen(false)
  }

  const handleProfile = () => {
    navigate('/profile')
    setDropdownOpen(false)
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-gray-500 hover:text-gray-700"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Breadcrumb or title - pode ser expandido depois */}
      <div className="flex-1 hidden lg:block">
        <h2 className="text-lg font-semibold text-gray-900">
          {/* Breadcrumb será implementado depois */}
        </h2>
      </div>

      {/* User menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
        >
          <UserCircleIcon className="h-8 w-8" />
          <span className="hidden md:block text-sm font-medium">
            {user?.email}
          </span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            <button
              onClick={handleProfile}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Cog6ToothIcon className="h-5 w-5 mr-2" />
              Perfil
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

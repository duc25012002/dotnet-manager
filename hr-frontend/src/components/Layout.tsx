import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  Users,
  Building2,
  BarChart3,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Bell,
  FileText,
  History,
  Sparkles,
  Briefcase,
  ClipboardList,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const navigation = [
    { name: 'Trang chủ', href: '/', icon: Home, roles: ['Employee', 'Manager', 'Admin'] },
    { name: 'Nhân viên', href: '/employees', icon: Users, roles: ['Employee', 'Manager', 'Admin'] },
    { name: 'Phòng ban', href: '/departments', icon: Building2, roles: ['Manager', 'Admin'] },
    { name: 'Chức vụ', href: '/positions', icon: Briefcase, roles: ['Manager', 'Admin'] },
    { name: 'Hợp đồng', href: '/contracts', icon: FileText, roles: ['Manager', 'Admin'] },
    { name: 'Quá trình', href: '/work-histories', icon: History, roles: ['Manager', 'Admin'] },
    { name: 'Đánh giá KPI', href: '/kpi', icon: BarChart3, roles: ['Employee', 'Manager', 'Admin'] },
    { name: 'AI đánh giá', href: '/ai-evaluation', icon: Sparkles, roles: ['Manager', 'Admin'] },
    { name: 'Báo cáo', href: '/reports', icon: ClipboardList, roles: ['Manager', 'Admin'] },
  ]

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(user?.role || 'Employee')
  )

  const getRoleBadge = (role: string) => {
    const badges = {
      Admin: 'bg-red-50 text-red-700 ring-1 ring-red-100',
      Manager: 'bg-blue-50 text-blue-700 ring-1 ring-blue-100',
      Employee: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
    }
    return badges[role as keyof typeof badges] || badges.Employee
  }

  const getRoleText = (role: string) => {
    const texts = {
      Admin: 'Quản trị viên',
      Manager: 'Quản lý',
      Employee: 'Nhân viên',
    }
    return texts[role as keyof typeof texts] || 'Nhân viên'
  }

  return (
    <div className="min-h-screen bg-[#f4f8ff]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-[#061b3a] text-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center">
            <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">HR System</h1>
              <p className="text-xs text-blue-100/80">Management Portal</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="border-b border-white/10 p-4">
          <div className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm">
              {user?.employee?.fullName?.charAt(0) || user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold text-white">
                {user?.employee?.fullName || user?.username}
              </p>
              <span
                className={`mt-1 inline-block rounded-md px-2 py-0.5 text-xs font-medium ${getRoleBadge(
                  user?.role || 'Employee'
                )}`}
              >
                {getRoleText(user?.role || 'Employee')}
              </span>
            </div>
          </div>
        </div>

        <nav className="mt-3 space-y-1 px-3">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center rounded-md px-3 py-2.5 text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-blue-100/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="mr-3 h-4 w-4" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#061b3a] p-4">
          <button
            onClick={logout}
            className="flex w-full items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium text-blue-100/85 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-lg">
          <div className="flex h-16 items-center justify-between px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 lg:block hidden">
              <h2 className="text-lg font-semibold text-gray-800">
                {navigation.find((item) => item.href === location.pathname)?.name || 'Dashboard'}
              </h2>
            </div>

            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 rounded-md px-3 py-2 transition-colors hover:bg-slate-100"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    {user?.employee?.fullName?.charAt(0) || user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden md:block">
                    {user?.employee?.fullName || user?.username}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.employee?.fullName || user?.username}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{user?.employee?.email}</p>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-5 lg:p-6">{children}</main>
      </div>
    </div>
  )
}

export default Layout

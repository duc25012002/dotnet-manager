import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Lock, User, AlertCircle, Building2 } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(formData.username, formData.password)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (role: 'employee' | 'manager') => {
    if (role === 'employee') {
      setFormData({ username: 'nhanvien', password: '123456' })
    } else {
      setFormData({ username: 'quanly', password: '123456' })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f8ff] p-4">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-sm">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">HR Management</h1>
          <p className="text-gray-600">Hệ thống Quản lý Nhân sự & KPI</p>
        </div>

        {/* Login Card */}
        <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Đăng nhập</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-800">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  className="input-field pl-10"
                  placeholder="Nhập tên đăng nhập"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="input-field pl-10"
                  placeholder="Nhập mật khẩu"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3 text-center">Tài khoản demo:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDemoLogin('employee')}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                👤 Nhân viên
              </button>
              <button
                onClick={() => handleDemoLogin('manager')}
                className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
              >
                👔 Quản lý
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Username: nhanvien / quanly | Password: 123456
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          © 2026 HR Management System. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default Login

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Mail, Phone, Building2 } from 'lucide-react'
import { employeeApi } from '../services/api'
import type { Employee } from '../types'
import { format } from 'date-fns'

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await employeeApi.getAll()
      setEmployees(response.data)
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEmployees = employees.filter((emp) =>
    emp.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý nhân viên</h1>
        <Link to="/employees/create" className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Thêm nhân viên
        </Link>
      </div>

      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm nhân viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-semibold text-lg">
                    {employee.fullName.charAt(0)}
                  </span>
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">{employee.fullName}</h3>
                  <p className="text-sm text-gray-500">{employee.position?.title}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <Building2 className="w-4 h-4 mr-2" />
                {employee.department?.name}
              </div>
              {employee.email && (
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {employee.email}
                </div>
              )}
              {employee.phoneNumber && (
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {employee.phoneNumber}
                </div>
              )}
              <div className="text-gray-500 text-xs pt-2">
                Ngày sinh: {format(new Date(employee.birthDate), 'dd/MM/yyyy')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Không tìm thấy nhân viên nào</p>
        </div>
      )}
    </div>
  )
}

export default Employees

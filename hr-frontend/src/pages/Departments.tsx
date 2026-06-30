import { useEffect, useState } from 'react'
import { Plus, Building2 } from 'lucide-react'
import { departmentApi } from '../services/api'
import type { Department } from '../types'

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await departmentApi.getAll()
      setDepartments(response.data)
    } catch (error) {
      console.error('Error fetching departments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await departmentApi.create(formData)
      setShowModal(false)
      setFormData({ name: '', description: '' })
      fetchDepartments()
    } catch (error) {
      console.error('Error creating department:', error)
      alert('Có lỗi xảy ra khi tạo phòng ban')
    }
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Quản lý phòng ban</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Thêm phòng ban
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{dept.name}</h3>
                {dept.description && (
                  <p className="text-sm text-gray-600">{dept.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {departments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Chưa có phòng ban nào</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Thêm phòng ban mới</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Tên phòng ban *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="input-field"
                  placeholder="Phòng Kỹ thuật"
                />
              </div>
              <div>
                <label className="label">Mô tả</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  placeholder="Mô tả về phòng ban"
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Tạo
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Departments

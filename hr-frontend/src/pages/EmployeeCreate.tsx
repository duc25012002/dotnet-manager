import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { employeeApi, departmentApi, positionApi } from '../services/api'
import type { Department, Position } from '../types'

const EmployeeCreate = () => {
  const navigate = useNavigate()
  const [departments, setDepartments] = useState<Department[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    address: '',
    email: '',
    phoneNumber: '',
    departmentId: '',
    positionId: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [deptResponse, posResponse] = await Promise.all([
        departmentApi.getAll(),
        positionApi.getAll(),
      ])
      setDepartments(deptResponse.data)
      setPositions(posResponse.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await employeeApi.create({
        ...formData,
        departmentId: parseInt(formData.departmentId),
        positionId: parseInt(formData.positionId),
      })
      navigate('/employees')
    } catch (error) {
      console.error('Error creating employee:', error)
      alert('Có lỗi xảy ra khi tạo nhân viên')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div>
      <button
        onClick={() => navigate('/employees')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Quay lại
      </button>

      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Thêm nhân viên mới</h1>

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label className="label">Họ và tên *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div>
            <label className="label">Ngày sinh *</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input-field"
              placeholder="123 Đường ABC, Quận 1, TP.HCM"
            />
          </div>

          <div>
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="label">Số điện thoại</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="input-field"
              placeholder="0123456789"
            />
          </div>

          <div>
            <label className="label">Phòng ban *</label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="">-- Chọn phòng ban --</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Chức vụ *</label>
            <select
              name="positionId"
              value={formData.positionId}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="">-- Chọn chức vụ --</option>
              {positions.map((pos) => (
                <option key={pos.id} value={pos.id}>
                  {pos.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4 pt-4">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Đang xử lý...' : 'Tạo nhân viên'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/employees')}
              className="btn-secondary flex-1"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EmployeeCreate

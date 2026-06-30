import { useEffect, useState } from 'react'
import { History, Plus, Trash2 } from 'lucide-react'
import { employeeApi, workHistoryApi } from '../services/api'
import type { Employee, WorkHistory } from '../types'
import { format } from 'date-fns'

const WorkHistories = () => {
  const [items, setItems] = useState<WorkHistory[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    employeeId: '',
    eventDate: new Date().toISOString().split('T')[0],
    eventType: 'Điều chuyển',
    title: '',
    description: '',
    fromDepartment: '',
    toDepartment: '',
    fromPosition: '',
    toPosition: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [historiesResponse, employeesResponse] = await Promise.all([
        workHistoryApi.getAll(),
        employeeApi.getAll(),
      ])
      setItems(historiesResponse.data)
      setEmployees(employeesResponse.data)
    } catch (error) {
      console.error('Error fetching work histories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)

    try {
      await workHistoryApi.create({
        ...formData,
        employeeId: Number(formData.employeeId),
      })
      setFormData({
        employeeId: '',
        eventDate: new Date().toISOString().split('T')[0],
        eventType: 'Điều chuyển',
        title: '',
        description: '',
        fromDepartment: '',
        toDepartment: '',
        fromPosition: '',
        toPosition: '',
      })
      fetchData()
    } catch (error) {
      console.error('Error creating work history:', error)
      alert('Có lỗi khi lưu quá trình làm việc')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa mốc quá trình này?')) return
    await workHistoryApi.delete(id)
    fetchData()
  }

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-gray-500">Đang tải...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quá trình làm việc</h1>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="mb-4 flex items-center">
          <History className="mr-2 h-5 w-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Thêm mốc quá trình</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <select
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            required
            className="input-field"
          >
            <option value="">Chọn nhân viên</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.fullName}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={formData.eventDate}
            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
            required
            className="input-field"
          />
          <select
            value={formData.eventType}
            onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
            className="input-field"
          >
            <option value="Điều chuyển">Điều chuyển</option>
            <option value="Thăng chức">Thăng chức</option>
            <option value="Khen thưởng">Khen thưởng</option>
            <option value="Kỷ luật">Kỷ luật</option>
            <option value="Đào tạo">Đào tạo</option>
          </select>
          <input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="input-field"
            placeholder="Tiêu đề"
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-4">
          <input
            value={formData.fromDepartment}
            onChange={(e) => setFormData({ ...formData, fromDepartment: e.target.value })}
            className="input-field"
            placeholder="Phòng ban cũ"
          />
          <input
            value={formData.toDepartment}
            onChange={(e) => setFormData({ ...formData, toDepartment: e.target.value })}
            className="input-field"
            placeholder="Phòng ban mới"
          />
          <input
            value={formData.fromPosition}
            onChange={(e) => setFormData({ ...formData, fromPosition: e.target.value })}
            className="input-field"
            placeholder="Chức vụ cũ"
          />
          <input
            value={formData.toPosition}
            onChange={(e) => setFormData({ ...formData, toPosition: e.target.value })}
            className="input-field"
            placeholder="Chức vụ mới"
          />
        </div>

        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="input-field mt-4"
          rows={3}
          placeholder="Ghi chú chi tiết"
        />

        <button type="submit" disabled={saving} className="btn-primary mt-4 inline-flex items-center">
          <Plus className="mr-2 h-5 w-5" />
          {saving ? 'Đang lưu...' : 'Thêm mốc'}
        </button>
      </form>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="card flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <span className="badge badge-warning">{item.eventType}</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {item.employee?.fullName} - {format(new Date(item.eventDate), 'dd/MM/yyyy')}
              </p>
              {item.description && <p className="mt-2 text-sm text-gray-600">{item.description}</p>}
              <p className="mt-2 text-sm text-gray-500">
                {item.fromDepartment || '-'} {'->'} {item.toDepartment || '-'} | {item.fromPosition || '-'} {'->'}{' '}
                {item.toPosition || '-'}
              </p>
            </div>
            <button
              onClick={() => handleDelete(item.id)}
              className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
              title="Xóa mốc"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorkHistories

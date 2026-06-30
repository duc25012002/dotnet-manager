import { useEffect, useState } from 'react'
import { Briefcase, Pencil, Plus, Trash2 } from 'lucide-react'
import { positionApi } from '../services/api'
import type { Position } from '../types'

const Positions = () => {
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ title: '', baseSalary: '' })

  useEffect(() => {
    fetchPositions()
  }, [])

  const fetchPositions = async () => {
    try {
      const response = await positionApi.getAll()
      setPositions(response.data)
    } catch (error) {
      console.error('Error fetching positions:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({ title: '', baseSalary: '' })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)

    try {
      const payload = {
        title: formData.title,
        baseSalary: Number(formData.baseSalary),
      }

      if (editingId) {
        await positionApi.update(editingId, payload)
      } else {
        await positionApi.create(payload)
      }

      resetForm()
      fetchPositions()
    } catch (error) {
      console.error('Error saving position:', error)
      alert('Có lỗi khi lưu chức vụ')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (position: Position) => {
    setEditingId(position.id)
    setFormData({
      title: position.title,
      baseSalary: String(position.baseSalary),
    })
  }

  const handleDelete = async (position: Position) => {
    if (!confirm(`Xóa chức vụ "${position.title}"?`)) return

    try {
      await positionApi.delete(position.id)
      fetchPositions()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Có lỗi khi xóa chức vụ')
    }
  }

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-gray-500">Đang tải...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản lý chức vụ</h1>
      </div>

      <form onSubmit={handleSubmit} className="card max-w-3xl">
        <div className="mb-4 flex items-center">
          <Briefcase className="mr-2 h-5 w-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            {editingId ? 'Cập nhật chức vụ' : 'Thêm chức vụ'}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="input-field"
            placeholder="Tên chức vụ"
          />
          <input
            type="number"
            min="0"
            step="100000"
            value={formData.baseSalary}
            onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
            required
            className="input-field"
            placeholder="Lương cơ bản"
          />
        </div>

        <div className="mt-4 flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary inline-flex items-center">
            <Plus className="mr-2 h-5 w-5" />
            {saving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Thêm chức vụ'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              Hủy sửa
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {positions.map((position) => (
          <div key={position.id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{position.title}</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {position.baseSalary.toLocaleString('vi-VN')} VND
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  {position.employees?.length || 0} nhân viên
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(position)}
                  className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
                  title="Sửa"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(position)}
                  className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                  title="Xóa"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Positions

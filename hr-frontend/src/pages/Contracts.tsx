import { useEffect, useState } from 'react'
import { FileText, Plus, Trash2 } from 'lucide-react'
import { contractApi, employeeApi } from '../services/api'
import type { Contract, Employee } from '../types'
import { format } from 'date-fns'

const Contracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    contractNumber: '',
    employeeId: '',
    contractType: 'Full-time',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [contractsResponse, employeesResponse] = await Promise.all([
        contractApi.getAll(),
        employeeApi.getAll(),
      ])
      setContracts(contractsResponse.data)
      setEmployees(employeesResponse.data)
    } catch (error) {
      console.error('Error fetching contracts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)

    try {
      await contractApi.create({
        contractNumber: formData.contractNumber,
        employeeId: Number(formData.employeeId),
        contractType: formData.contractType,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
      })
      setFormData({
        contractNumber: '',
        employeeId: '',
        contractType: 'Full-time',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
      })
      fetchData()
    } catch (error) {
      console.error('Error creating contract:', error)
      alert('Có lỗi khi tạo hợp đồng')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa hợp đồng này?')) return
    await contractApi.delete(id)
    fetchData()
  }

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-gray-500">Đang tải...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản lý hợp đồng</h1>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="mb-4 flex items-center">
          <FileText className="mr-2 h-5 w-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Thêm hợp đồng</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <input
            value={formData.contractNumber}
            onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
            required
            className="input-field"
            placeholder="Số hợp đồng"
          />
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
          <select
            value={formData.contractType}
            onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
            className="input-field"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Probation">Thử việc</option>
            <option value="Fixed-term">Có thời hạn</option>
          </select>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
            className="input-field"
          />
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="input-field"
          />
        </div>

        <button type="submit" disabled={saving} className="btn-primary mt-4 inline-flex items-center">
          <Plus className="mr-2 h-5 w-5" />
          {saving ? 'Đang lưu...' : 'Thêm hợp đồng'}
        </button>
      </form>

      <div className="space-y-4">
        {contracts.map((contract) => (
          <div key={contract.id} className="card flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">{contract.contractNumber}</h3>
                <span className="badge badge-info">{contract.contractType}</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {contract.employee?.fullName} - {contract.employee?.position?.title}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {format(new Date(contract.startDate), 'dd/MM/yyyy')} -{' '}
                {contract.endDate ? format(new Date(contract.endDate), 'dd/MM/yyyy') : 'Không thời hạn'}
              </p>
            </div>
            <button
              onClick={() => handleDelete(contract.id)}
              className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
              title="Xóa hợp đồng"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Contracts

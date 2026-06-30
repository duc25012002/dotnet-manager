import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { employeeApi, kpiApi } from '../services/api'
import type { Employee, KpiCategory } from '../types'

const KpiCreate = () => {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [categories, setCategories] = useState<KpiCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    employeeId: '',
    period: '',
    reviewDate: new Date().toISOString().split('T')[0],
    feedback: '',
  })
  const [scores, setScores] = useState<Record<number, number>>({})

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [empResponse, catResponse] = await Promise.all([
        employeeApi.getAll(),
        kpiApi.getCategories(),
      ])
      setEmployees(empResponse.data)
      setCategories(catResponse.data)

      // Initialize scores
      const initialScores: Record<number, number> = {}
      catResponse.data.forEach((cat) => {
        initialScores[cat.id] = 5
      })
      setScores(initialScores)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await kpiApi.createReview({
        employeeId: parseInt(formData.employeeId),
        period: formData.period,
        reviewDate: formData.reviewDate,
        feedback: formData.feedback,
        scores,
      })
      navigate('/kpi')
    } catch (error) {
      console.error('Error creating review:', error)
      alert('Có lỗi xảy ra khi tạo đánh giá')
    } finally {
      setLoading(false)
    }
  }

  const handleScoreChange = (categoryId: number, value: number) => {
    setScores({
      ...scores,
      [categoryId]: value,
    })
  }

  const calculateTotalScore = () => {
    let total = 0
    categories.forEach((cat) => {
      const score = scores[cat.id] || 0
      total += (score * cat.weight) / 100
    })
    return total.toFixed(2)
  }

  return (
    <div>
      <button
        onClick={() => navigate('/kpi')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Quay lại
      </button>

      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Tạo đánh giá KPI mới</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Thông tin chung</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Nhân viên *</label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  required
                  className="input-field"
                >
                  <option value="">-- Chọn nhân viên --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} - {emp.position?.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Kỳ đánh giá *</label>
                  <input
                    type="text"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    required
                    className="input-field"
                    placeholder="Q1 2026"
                  />
                </div>
                <div>
                  <label className="label">Ngày đánh giá *</label>
                  <input
                    type="date"
                    value={formData.reviewDate}
                    onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="label">Nhận xét</label>
                <textarea
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Nhận xét về hiệu suất làm việc..."
                />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Tiêu chí đánh giá</h2>
            <div className="space-y-6">
              {categories.map((category) => (
                <div key={category.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-gray-600">{category.description}</p>
                      )}
                    </div>
                    <span className="text-sm font-medium text-primary-600">
                      Trọng số: {category.weight}%
                    </span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={scores[category.id] || 5}
                      onChange={(e) => handleScoreChange(category.id, parseFloat(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="w-16 text-center">
                      <span className="text-2xl font-bold text-primary-600">
                        {scores[category.id] || 5}
                      </span>
                      <span className="text-sm text-gray-500">/10</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Tổng điểm:</span>
                <span className="text-3xl font-bold text-primary-600">{calculateTotalScore()}</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Đang xử lý...' : 'Tạo đánh giá'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/kpi')}
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

export default KpiCreate

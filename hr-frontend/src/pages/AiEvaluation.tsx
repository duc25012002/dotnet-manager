import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { aiApi, employeeApi } from '../services/api'
import type { AiEvaluationResponse, Employee } from '../types'
import { format } from 'date-fns'

const AiEvaluation = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [employeeId, setEmployeeId] = useState('')
  const [period, setPeriod] = useState('Q1 2026')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AiEvaluationResponse | null>(null)
  const [history, setHistory] = useState<AiEvaluationResponse[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [employeesResponse, historyResponse] = await Promise.all([
        employeeApi.getAll(),
        aiApi.getEvaluationHistory(),
      ])
      setEmployees(employeesResponse.data)
      setHistory(historyResponse.data)
    } catch (error) {
      console.error('Error fetching AI evaluation data:', error)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await aiApi.evaluatePerformance(Number(employeeId), period)
      setResult(response.data)
      fetchData()
    } catch (error: any) {
      console.error('Error generating AI evaluation:', error)
      alert(error.response?.data?.message || 'Có lỗi khi gọi Gemini AI')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI đánh giá hiệu suất</h1>
      </div>

      <form onSubmit={handleSubmit} className="card max-w-3xl">
        <div className="mb-4 flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Tạo nhận xét từ dữ liệu HR</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="label">Nhân viên</label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
              className="input-field"
            >
              <option value="">Chọn nhân viên</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.fullName} - {employee.position?.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Kỳ đánh giá</label>
            <input
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="input-field"
              placeholder="Q1 2026"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary mt-4 inline-flex items-center">
          <Sparkles className="mr-2 h-5 w-5" />
          {loading ? 'Gemini đang phân tích...' : 'Tạo đánh giá AI'}
        </button>
      </form>

      {result && (
        <div className="card max-w-5xl">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{result.employeeName}</h2>
            <p className="text-sm text-gray-500">Kỳ đánh giá: {result.period || 'Không chỉ định'}</p>
          </div>
          <div className="whitespace-pre-wrap rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm leading-7 text-gray-800">
            {result.evaluation}
          </div>
        </div>
      )}

      <div className="card max-w-5xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Lịch sử đánh giá AI</h2>
        <div className="space-y-4">
          {history.length === 0 && <p className="text-sm text-gray-500">Chưa có đánh giá AI nào</p>}
          {history.map((item) => (
            <div key={item.id} className="rounded-xl border border-gray-200 p-4">
              <div className="mb-2 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.employeeName}</h3>
                  <p className="text-sm text-gray-500">
                    {item.period || 'Không chỉ định'} - {format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}
                  </p>
                </div>
              </div>
              <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                {item.evaluation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AiEvaluation

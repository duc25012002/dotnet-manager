import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Award, Calendar } from 'lucide-react'
import { kpiApi } from '../services/api'
import type { PerformanceReview } from '../types'
import { format } from 'date-fns'

const KpiReviews = () => {
  const [reviews, setReviews] = useState<PerformanceReview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await kpiApi.getReviews()
      setReviews(response.data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100'
    if (score >= 6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      Draft: 'bg-gray-100 text-gray-700',
      Finalized: 'bg-green-100 text-green-700',
    }
    return colors[status as keyof typeof colors] || colors.Draft
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
        <h1 className="text-3xl font-bold text-gray-900">Đánh giá KPI</h1>
        <Link to="/kpi/create" className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Tạo đánh giá mới
        </Link>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 mr-3">
                    {review.employee?.fullName}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                      review.status
                    )}`}
                  >
                    {review.status === 'Finalized' ? 'Hoàn thành' : 'Nháp'}
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {format(new Date(review.reviewDate), 'dd/MM/yyyy')}
                  </div>
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    Kỳ: {review.period}
                  </div>
                </div>

                {review.feedback && (
                  <p className="text-sm text-gray-600 mb-3">{review.feedback}</p>
                )}
              </div>

              <div className="ml-6">
                <div
                  className={`text-3xl font-bold px-4 py-2 rounded-lg ${getScoreColor(
                    review.totalScore
                  )}`}
                >
                  {review.totalScore.toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Chưa có đánh giá KPI nào</p>
        </div>
      )}
    </div>
  )
}

export default KpiReviews

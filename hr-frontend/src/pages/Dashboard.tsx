import { useEffect, useState } from 'react'
import { Users, Building2, Briefcase, TrendingUp } from 'lucide-react'
import { reportApi } from '../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalContracts: 0,
    totalReviews: 0,
    avgScore: 0,
    expiringContracts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await reportApi.getSummary()

        setStats({
          totalEmployees: response.data.totalEmployees,
          totalDepartments: response.data.totalDepartments,
          totalContracts: response.data.totalContracts,
          totalReviews: response.data.totalKpiReviews,
          avgScore: Math.round(response.data.averageKpiScore * 10) / 10,
          expiringContracts: response.data.expiringContracts.length,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Tổng nhân viên',
      value: stats.totalEmployees,
      icon: Users,
      color: 'bg-blue-600',
    },
    {
      title: 'Phòng ban',
      value: stats.totalDepartments,
      icon: Building2,
      color: 'bg-emerald-500',
    },
    {
      title: 'Hợp đồng',
      value: stats.totalContracts,
      icon: Briefcase,
      color: 'bg-violet-500',
    },
    {
      title: 'Điểm TB',
      value: stats.avgScore,
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-950">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.title} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-950">{stat.value}</p>
              </div>
              <div className={`${stat.color} rounded-lg p-3 shadow-sm`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 text-base font-semibold text-slate-950">Hoạt động gần đây</h2>
          <div className="space-y-3">
            <div className="flex items-center rounded-md bg-slate-50 p-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <p className="text-sm text-gray-700">Hệ thống đang hoạt động bình thường</p>
            </div>
            <div className="flex items-center rounded-md bg-slate-50 p-3">
              <div className="mr-3 h-2 w-2 rounded-full bg-blue-500"></div>
              <p className="text-sm text-gray-700">{stats.totalReviews} lượt đánh giá KPI đã ghi nhận</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="mb-4 text-base font-semibold text-slate-950">Thông báo</h2>
          <div className="space-y-3">
            <div className="flex items-center rounded-md bg-blue-50 p-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <p className="text-sm text-gray-700">Chào mừng đến với hệ thống HR Management</p>
            </div>
            <div className="flex items-center rounded-md bg-amber-50 p-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <p className="text-sm text-gray-700">
                {stats.expiringContracts} hợp đồng sắp hết hạn trong 30 ngày
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

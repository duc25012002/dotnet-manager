import { useEffect, useState } from 'react'
import { AlertTriangle, Award, BarChart3, Briefcase, Download } from 'lucide-react'
import { reportApi } from '../services/api'
import type { ReportSummary } from '../types'
import { format } from 'date-fns'

const Reports = () => {
  const [summary, setSummary] = useState<ReportSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reportApi
      .getSummary()
      .then((response) => setSummary(response.data))
      .catch((error) => console.error('Error fetching reports:', error))
      .finally(() => setLoading(false))
  }, [])

  const exportCsv = () => {
    if (!summary) return

    const rows = [
      ['Loai bao cao', 'Ten', 'Gia tri', 'Ky/Ngay'],
      ...summary.departmentStats.map((item) => [
        'Phong ban',
        item.departmentName,
        `${item.employeeCount} nhan vien - KPI ${item.averageKpiScore.toFixed(2)}`,
        '',
      ]),
      ...summary.expiringContracts.map((item) => [
        'Hop dong sap het han',
        item.employeeName,
        `${item.contractNumber} - con ${item.daysLeft} ngay`,
        format(new Date(item.endDate), 'dd/MM/yyyy'),
      ]),
      ...summary.topEmployees.map((item) => [
        'Top KPI',
        item.employeeName,
        item.score.toFixed(2),
        item.period,
      ]),
    ]

    const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'hr-report.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-gray-500">Đang tải...</div>
  }

  if (!summary) {
    return <div className="text-gray-500">Không tải được báo cáo</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Báo cáo thống kê</h1>
        <button onClick={exportCsv} className="btn-secondary inline-flex items-center">
          <Download className="mr-2 h-5 w-5" />
          Xuất CSV
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <p className="text-sm text-gray-600">Nhân viên</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{summary.totalEmployees}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Chức vụ</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{summary.totalPositions}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Hợp đồng</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{summary.totalContracts}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">KPI trung bình</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{summary.averageKpiScore}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="card">
          <div className="mb-4 flex items-center">
            <BarChart3 className="mr-2 h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Theo phòng ban</h2>
          </div>
          <div className="space-y-3">
            {summary.departmentStats.map((item) => (
              <div key={item.departmentName} className="rounded-lg border border-gray-200 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{item.departmentName}</span>
                  <span className="text-sm text-gray-600">{item.employeeCount} nhân viên</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  KPI trung bình: {item.averageKpiScore.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="mb-4 flex items-center">
            <Briefcase className="mr-2 h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Hợp đồng sắp hết hạn</h2>
          </div>
          <div className="space-y-3">
            {summary.expiringContracts.length === 0 && (
              <p className="text-sm text-gray-500">Không có hợp đồng hết hạn trong 30 ngày tới</p>
            )}
            {summary.expiringContracts.map((item) => (
              <div key={item.id} className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{item.employeeName}</span>
                  <span className="text-sm text-yellow-700">Còn {item.daysLeft} ngày</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {item.contractNumber} - {format(new Date(item.endDate), 'dd/MM/yyyy')}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="mb-4 flex items-center">
            <Award className="mr-2 h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Top KPI</h2>
          </div>
          <div className="space-y-3">
            {summary.topEmployees.map((item) => (
              <div key={`${item.employeeId}-${item.period}`} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                <div>
                  <p className="font-medium text-gray-900">{item.employeeName}</p>
                  <p className="text-sm text-gray-500">{item.period}</p>
                </div>
                <span className="text-lg font-bold text-green-600">{item.score.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="mb-4 flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900">Cần theo dõi</h2>
          </div>
          <div className="space-y-3">
            {summary.lowKpiEmployees.length === 0 && (
              <p className="text-sm text-gray-500">Không có nhân viên KPI dưới 6</p>
            )}
            {summary.lowKpiEmployees.map((item) => (
              <div key={`${item.employeeId}-${item.period}`} className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3">
                <div>
                  <p className="font-medium text-gray-900">{item.employeeName}</p>
                  <p className="text-sm text-gray-500">{item.period}</p>
                </div>
                <span className="text-lg font-bold text-red-600">{item.score.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports

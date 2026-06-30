import axios from 'axios'
import type {
  Employee,
  Department,
  Position,
  PerformanceReview,
  KpiCategory,
  User,
  Contract,
  WorkHistory,
  AiEvaluationResponse,
  ReportSummary,
} from '../types'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const employeeApi = {
  getAll: () => api.get<Employee[]>('/employees'),
  getById: (id: number) => api.get<Employee>(`/employees/${id}`),
  create: (data: Partial<Employee>) => api.post<Employee>('/employees', data),
  update: (id: number, data: Partial<Employee>) => api.put<Employee>(`/employees/${id}`, data),
  delete: (id: number) => api.delete(`/employees/${id}`),
}

export const departmentApi = {
  getAll: () => api.get<Department[]>('/departments'),
  create: (data: Partial<Department>) => api.post<Department>('/departments', data),
}

export const positionApi = {
  getAll: () => api.get<Position[]>('/positions'),
  create: (data: { title: string; baseSalary: number }) => api.post<Position>('/positions', data),
  update: (id: number, data: { title: string; baseSalary: number }) =>
    api.put(`/positions/${id}`, data),
  delete: (id: number) => api.delete(`/positions/${id}`),
}

export const kpiApi = {
  getCategories: () => api.get<KpiCategory[]>('/kpi/categories'),
  getReviews: () => api.get<PerformanceReview[]>('/kpi/reviews'),
  createReview: (data: {
    employeeId: number
    period: string
    reviewDate: string
    feedback: string
    scores: Record<number, number>
  }) => api.post<PerformanceReview>('/kpi/reviews', data),
}

export const contractApi = {
  getAll: () => api.get<Contract[]>('/contracts'),
  create: (data: {
    contractNumber: string
    startDate: string
    endDate?: string | null
    contractType: string
    employeeId: number
  }) => api.post<Contract>('/contracts', data),
  delete: (id: number) => api.delete(`/contracts/${id}`),
}

export const workHistoryApi = {
  getAll: (employeeId?: number) =>
    api.get<WorkHistory[]>('/work-histories', { params: employeeId ? { employeeId } : undefined }),
  create: (data: {
    employeeId: number
    eventDate: string
    eventType: string
    title: string
    description?: string
    fromDepartment?: string
    toDepartment?: string
    fromPosition?: string
    toPosition?: string
  }) => api.post<WorkHistory>('/work-histories', data),
  delete: (id: number) => api.delete(`/work-histories/${id}`),
}

export const aiApi = {
  evaluatePerformance: (employeeId: number, period?: string) =>
    api.post<AiEvaluationResponse>('/ai/performance-evaluation', { employeeId, period }),
  getEvaluationHistory: (employeeId?: number) =>
    api.get<AiEvaluationResponse[]>('/ai/performance-evaluation/history', {
      params: employeeId ? { employeeId } : undefined,
    }),
}

export const reportApi = {
  getSummary: () => api.get<ReportSummary>('/reports/summary'),
}

export const authApi = {
  login: (username: string, password: string) =>
    api.post<User>('/auth/login', { username, password }),
  register: (data: { username: string; password: string; role?: string; employeeId?: number }) =>
    api.post<User>('/auth/register', data),
  getCurrentUser: (userId: number) => api.get<User>(`/auth/me?userId=${userId}`),
}

export default api

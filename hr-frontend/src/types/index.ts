export interface Department {
  id: number
  name: string
  description?: string
}

export interface Position {
  id: number
  title: string
  baseSalary: number
  employees?: Employee[]
}

export interface Employee {
  id: number
  fullName: string
  birthDate: string
  address?: string
  email?: string
  phoneNumber?: string
  username?: string
  role?: string
  avatar?: string
  departmentId: number
  department?: Department
  positionId: number
  position?: Position
}

export interface KpiCategory {
  id: number
  name: string
  description?: string
  weight: number
}

export interface PerformanceDetail {
  id: number
  performanceReviewId: number
  kpiCategoryId: number
  kpiCategory?: KpiCategory
  score: number
  note?: string
}

export interface PerformanceReview {
  id: number
  employeeId: number
  employee?: Employee
  reviewDate: string
  period: string
  totalScore: number
  feedback?: string
  status: string
  details?: PerformanceDetail[]
}

export interface Contract {
  id: number
  contractNumber: string
  startDate: string
  endDate?: string
  contractType: string
  employeeId: number
  employee?: Employee
}

export interface WorkHistory {
  id: number
  employeeId: number
  employee?: Employee
  eventDate: string
  eventType: string
  title: string
  description?: string
  fromDepartment?: string
  toDepartment?: string
  fromPosition?: string
  toPosition?: string
}

export interface AiEvaluationResponse {
  id: number
  employeeId: number
  employeeName: string
  period?: string
  evaluation: string
  createdAt: string
}

export interface ReportSummary {
  totalEmployees: number
  totalDepartments: number
  totalPositions: number
  totalContracts: number
  totalKpiReviews: number
  averageKpiScore: number
  departmentStats: DepartmentReport[]
  expiringContracts: ExpiringContractReport[]
  topEmployees: EmployeeKpiReport[]
  lowKpiEmployees: EmployeeKpiReport[]
}

export interface DepartmentReport {
  departmentName: string
  employeeCount: number
  averageKpiScore: number
}

export interface ExpiringContractReport {
  id: number
  contractNumber: string
  employeeName: string
  endDate: string
  daysLeft: number
}

export interface EmployeeKpiReport {
  employeeId: number
  employeeName: string
  period: string
  score: number
}

export interface User {
  id: number
  username: string
  role: string
  employee?: Employee
  token: string
}

export interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isManager: boolean
  isAdmin: boolean
}

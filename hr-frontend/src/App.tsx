import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import EmployeeCreate from './pages/EmployeeCreate'
import Departments from './pages/Departments'
import KpiReviews from './pages/KpiReviews'
import KpiCreate from './pages/KpiCreate'
import Contracts from './pages/Contracts'
import WorkHistories from './pages/WorkHistories'
import AiEvaluation from './pages/AiEvaluation'
import Positions from './pages/Positions'
import Reports from './pages/Reports'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

const ManagerRoute = ({ children }: { children: React.ReactNode }) => {
  const { isManager } = useAuth()
  return isManager ? <>{children}</> : <Navigate to="/" />
}

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/employees" element={<Employees />} />
                <Route
                  path="/employees/create"
                  element={
                    <ManagerRoute>
                      <EmployeeCreate />
                    </ManagerRoute>
                  }
                />
                <Route path="/departments" element={<Departments />} />
                <Route path="/positions" element={<Positions />} />
                <Route path="/contracts" element={<Contracts />} />
                <Route path="/work-histories" element={<WorkHistories />} />
                <Route path="/kpi" element={<KpiReviews />} />
                <Route path="/ai-evaluation" element={<AiEvaluation />} />
                <Route path="/reports" element={<Reports />} />
                <Route
                  path="/kpi/create"
                  element={
                    <ManagerRoute>
                      <KpiCreate />
                    </ManagerRoute>
                  }
                />
              </Routes>
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App

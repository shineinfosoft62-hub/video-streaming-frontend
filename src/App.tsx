import { Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from './constants/routes'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardSettings from './pages/DashboardSettings'
import Landing from './pages/Landing'
import VideoList from './pages/VideoList'
import VideoUpload from './pages/VideoUpload'
import Login from './components/user/Login'
import Register from './components/user/Register'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<Landing />} />
      <Route path={ROUTES.SIGN_IN} element={<Login />} />
      <Route path={ROUTES.SIGN_UP} element={<Register />} />
      <Route path={ROUTES.dashboard} element={<DashboardLayout />}>
        <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route path={ROUTES.DASHBOARD} element={<VideoList />} />
        <Route
          path={ROUTES.DASHBOARD_UPLOAD}
          element={(
            <ProtectedRoute>
              <VideoUpload />
            </ProtectedRoute>
          )}
        />
        <Route path={ROUTES.DASHBOARD_SETTINGS} element={<DashboardSettings />} />
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
    </Routes>
  )
}

export default App

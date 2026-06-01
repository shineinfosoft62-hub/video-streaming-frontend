import { Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from './constants/routes'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardSettings from './pages/DashboardSettings'
import Landing from './pages/Landing'
import VideoList from './pages/VideoList'
import VideoUpload from './pages/VideoUpload'
import Login from './components/user/Login'
import Register from './components/user/Register'

function App() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<Landing />} />
      <Route path={ROUTES.SIGN_IN} element={<Login />} />
      <Route path={ROUTES.SIGN_UP} element={<Register />} />
      <Route path={ROUTES.dashboard} element={<DashboardLayout />}>
        <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route path="videos" element={<VideoList />} />
        <Route path="upload" element={<VideoUpload />} />
        <Route path="settings" element={<DashboardSettings />} />
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
    </Routes>
  )
}

export default App

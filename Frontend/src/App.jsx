import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastProvider } from './components/ToastProvider';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Labs } from './pages/Labs';
import { Equipment } from './pages/Equipment';
import { Bookings } from './pages/Bookings';
import { Maintenance } from './pages/Maintenance';
import { Users } from './pages/Users';
import { Reports } from './pages/Reports';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <ToastProvider />
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/labs"
              element={
                <ProtectedRoute>
                  <Labs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/equipment"
              element={
                <ProtectedRoute>
                  <Equipment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <Bookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/maintenance"
              element={
                <ProtectedRoute>
                  <Maintenance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

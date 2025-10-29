import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import LeaveList from './components/leave/LeaveList';
import LeaveForm from './components/leave/LeaveForm';
import ComplaintList from './components/complaint/ComplaintList';
import ComplaintForm from './components/complaint/ComplaintForm';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import Analytics from './components/admin/Analytics';
import SystemSettings from './components/admin/SystemSettings';


// Layout wrapper component
function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

// Auth wrapper to check if user is logged in
function AuthWrapper({ children }) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />

          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <AuthWrapper>
                  <Login />
                </AuthWrapper>
              }
            />
            <Route
              path="/register"
              element={
                <AuthWrapper>
                  <Register />
                </AuthWrapper>
              }
            />

            {/* Protected Routes with Layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Leave Routes */}
            <Route
              path="/leaves"
              element={
                <ProtectedRoute>
                  <Layout>
                    <LeaveList />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaves/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <LeaveForm />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaves/all"
              element={
                <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}>
                  <Layout>
                    <LeaveList showAll={true} />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Complaint Routes */}
            <Route
              path="/complaints"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ComplaintList />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/complaints/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ComplaintForm />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/complaints/all"
              element={
                <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}>
                  <Layout>
                    <ComplaintList showAll={true} />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Layout>
                    <UserManagement />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Layout>
                    <Analytics />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Layout>
                    <SystemSettings />
                  </Layout>
                </ProtectedRoute>
              }
            />



            {/* Default Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

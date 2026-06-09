import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { MainLayout } from './components/layout/MainLayout';

// Public pages
import { LandingPage } from './pages/auth/LandingPage/LandingPage';
import { SelectRole } from './pages/auth/SelectRole/SelectRole';

// Auth pages
import { Login } from './pages/auth/Login/Login';
import { Register } from './pages/auth/Register/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword/ForgotPassword';
import { VerifyOTP } from './pages/auth/VerifyOTP/VerifyOTP';
import { ResetPassword } from './pages/auth/ResetPassword/ResetPassword';
import { RegistrationSuccess } from './pages/auth/RegistrationSuccess/RegistrationSuccess';

// App pages
import { Analytics } from './pages/management/Analytics/Analytics';
import { Reports } from './pages/management/Reports/Reports';
import { UserDashboard } from './pages/user/UserDashboard/UserDashboard';
import { UploadImage } from './pages/user/UploadImage/UploadImage';
import { SymptomAnalysis } from './pages/user/SymptomAnalysis/SymptomAnalysis';
import { RequestConsultation } from './pages/user/RequestConsultation/RequestConsultation';
import { PendingList } from './pages/doctor/PendingList/PendingList';
import { ReviewCase } from './pages/doctor/ReviewCase/ReviewCase';
import { CompletedCases } from './pages/doctor/CompletedCases/CompletedCases';
import { DiagnosisHistory } from './pages/user/DiagnosisHistory/DiagnosisHistory';
import { Settings as UserSettings } from './pages/user/Settings/Settings';
// User pages - these are handled within the Settings page components
import { ToastTest } from './pages/ToastTest';
import { ThemeDemo } from './pages/ThemeDemo';

// Role-based redirect component
const RoleBasedRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // All roles (manager/user/doctor/patient) go to user-dashboard
  return <Navigate to="/app/user-dashboard" replace />;
};

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <div className="w-full max-w-full overflow-x-hidden">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
                <Route path="/select-role" element={<PublicRoute><SelectRole /></PublicRoute>} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                <Route path="/verify-otp" element={<PublicRoute><VerifyOTP /></PublicRoute>} />
                <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
                <Route path="/registration-success" element={<PublicRoute><RegistrationSuccess /></PublicRoute>} />
                <Route path="/toast-test" element={<PublicRoute><ToastTest /></PublicRoute>} />
                <Route path="/theme-demo" element={<PublicRoute><ThemeDemo /></PublicRoute>} />

                {/* Protected routes */}
                <Route
                  path="/app"
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<RoleBasedRedirect />} />
                  
                  {/* User Dashboard */}
                  <Route 
                    path="user-dashboard" 
                    element={
                      <ProtectedRoute allowedRoles={['user', 'manager', 'patient', 'doctor']}>
                        <UserDashboard />
                      </ProtectedRoute>
                    } 
                  />

                  <Route 
                    path="consult" 
                    element={
                      <ProtectedRoute allowedRoles={['user', 'patient']}>
                        <RequestConsultation />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="pending-list" 
                    element={
                      <ProtectedRoute allowedRoles={['manager', 'doctor']}>
                        <PendingList />
                      </ProtectedRoute>
                    } 
                  />
                  <Route
                    path="review/:id"
                    element={
                      <ProtectedRoute allowedRoles={['manager', 'doctor']}>
                        <ReviewCase />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="completed-cases"
                    element={
                      <ProtectedRoute allowedRoles={['manager', 'doctor']}>
                        <CompletedCases />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="my-history"
                    element={
                      <ProtectedRoute allowedRoles={['user', 'patient']}>
                        <DiagnosisHistory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="upload-image"
                    element={
                      <ProtectedRoute allowedRoles={['manager', 'doctor']}>
                        <UploadImage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="symptoms"
                    element={
                      <ProtectedRoute allowedRoles={['manager', 'doctor']}>
                        <SymptomAnalysis />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route 
                    path="analytics" 
                    element={
                      <ProtectedRoute allowedRoles={['manager', 'doctor']}>
                        <Analytics />
                      </ProtectedRoute>
                    } 
                  />
                  <Route
                    path="reports"
                    element={
                      <ProtectedRoute allowedRoles={['user', 'patient', 'manager', 'doctor']}>
                        <Reports />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route 
                    path="user-settings" 
                    element={
                      <ProtectedRoute allowedRoles={['user', 'manager', 'patient', 'doctor']}>
                        <UserSettings />
                      </ProtectedRoute>
                    } 
                  />
                  {/* User routes - redirect to user-settings for now */}
                  <Route 
                    path="profile" 
                    element={
                      <ProtectedRoute allowedRoles={['user', 'manager', 'patient', 'doctor']}>
                        <Navigate to="/app/user-settings" replace />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="profile/edit" 
                    element={
                      <ProtectedRoute allowedRoles={['user', 'manager', 'patient', 'doctor']}>
                        <Navigate to="/app/user-settings" replace />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="security" 
                    element={
                      <ProtectedRoute allowedRoles={['user', 'manager', 'patient', 'doctor']}>
                        <Navigate to="/app/user-settings" replace />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="notifications" 
                    element={
                      <ProtectedRoute allowedRoles={['user', 'manager', 'patient', 'doctor']}>
                        <Navigate to="/app/user-settings" replace />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="preferences" 
                    element={
                      <ProtectedRoute allowedRoles={['user', 'manager', 'patient', 'doctor']}>
                        <Navigate to="/app/user-settings" replace />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="view-profile" 
                    element={
                      <ProtectedRoute allowedRoles={['user', 'manager', 'patient', 'doctor']}>
                        <Navigate to="/app/user-settings" replace />
                      </ProtectedRoute>
                    } 
                  />
                </Route>

                {/* Catch all - redirect to landing */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { TechpackEditorPage } from './pages/TechpackEditorPage';
import { ViewTechpackPage } from './pages/ViewTechpackPage';
import { AppShell } from './components/Navigation/AppShell';
import { useAuthStore } from './store/useAuthStore';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-hover)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes use the app shell (sidebar layout) */}
        <Route element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/templates" element={<DashboardPage />} />
          <Route path="/settings" element={<DashboardPage />} />
        </Route>

        {/* Editor — full screen, no sidebar */}
        <Route path="/techpack/:id" element={
          <ProtectedRoute>
            <TechpackEditorPage />
          </ProtectedRoute>
        } />
        <Route path="/techpack/:id/view" element={
          <ProtectedRoute>
            <ViewTechpackPage />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

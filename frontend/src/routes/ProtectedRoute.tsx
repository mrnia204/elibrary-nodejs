// components/ProtectedRoute.tsx
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'admin';
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // Redirect to appropriate login page based on required role
    const loginPath = requiredRole === 'admin' ? '/admin-login' : '/student-login';
    return <Navigate to={loginPath} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to unauthorized or appropriate dashboard
    if (user?.role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      return <Navigate to="/student-dashboard" replace />;
    }
  }

  return <>{children}</>;
};

// Specific protected route components for convenience
export const AdminRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>
);

export const StudentRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute requiredRole="student">{children}</ProtectedRoute>
);
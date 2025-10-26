import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'remixicon/fonts/remixicon.css';
import App from './App.tsx'
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';

import { createBrowserRouter, RouterProvider , Navigate} from 'react-router-dom'
import Index from './pages/index.tsx';
import StudentLoginpage from './pages/StudentLogin.tsx';
import AdminLoginpage from './pages/AdminLogin.tsx';
import Admin from './components/admin/Admin.tsx';
import Student from './components/student/Student.tsx';


export type UserRole = 'student' | 'admin';

interface User {
  username: string;
  role: UserRole;
  user_id?: string;
  activity_id?:string;
  login_time?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}


const ProtectedRoute = ({ children,  requiredRole,}: { children: React.ReactNode; requiredRole?: 'student' | 'admin'; ) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={requiredRole === 'admin' ? '/admin-login' : '/student-login'} />
  }
}


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Index />},
      { path: "/student-login", element: <StudentLoginpage />},
      { path: "/admin-login", element: <AdminLoginpage />},

      // admin
      {path: "/admin-dashboard", element: <Admin />},
      // student
      {path: '/student-dashboard', element: <Student />}
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

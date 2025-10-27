import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'remixicon/fonts/remixicon.css';
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx';

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Index from './pages/index.tsx';
import StudentLoginpage from './pages/StudentLogin.tsx';
import AdminLoginpage from './pages/AdminLogin.tsx';
import Admin from './components/admin/NavigationAdmin.tsx';
import Student from './components/student/NavigationStudent.tsx';
import { AdminRoute, StudentRoute } from './routes/ProtectedRoute.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Remove AuthProvider from here
    children: [
      { index: true, element: <Index />},
      { path: "/student-login", element: <StudentLoginpage />},
      { path: "/admin-login", element: <AdminLoginpage />},

      // admin
      {
        path: "/admin-dashboard",
        element: (
          <AdminRoute>
            <Admin />
          </AdminRoute>
        )
      },
      // student
      {
        path: '/student-dashboard', 
        element: (
          <StudentRoute>
            <Student />
          </StudentRoute>
        )
      }
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Wrap everything with AuthProvider */}
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
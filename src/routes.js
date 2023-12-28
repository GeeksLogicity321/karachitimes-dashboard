import { useEffect } from 'react';

import { Navigate, useNavigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//

import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import CategoryPage from './pages/CategoryPage';
import DashboardAppPage from './pages/DashboardAppPage';
import BlogPage from './pages/BlogPage';
import QueryPage from './pages/QueryPage';
import CommentPage from './pages/CommentPage';

// ----------------------------------------------------------------------

export default function Router() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
    }
  }, []);
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'category', element: <CategoryPage /> },
        { path: 'blog', element: <BlogPage /> },
        {path:"comment/:id",element:<CommentPage/>},
        { path: 'query', element: <QueryPage /> },

      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}

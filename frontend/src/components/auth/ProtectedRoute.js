import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute({ isAuthenticated, redirectPath = '/login' }) {
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
}
import { Outlet, Navigate } from 'react-router-dom';

export default function ProtectedRoutes({ user }) {
    return user ? <Outlet /> : <Navigate to="/login" />;
}

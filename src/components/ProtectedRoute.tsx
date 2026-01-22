import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../store/store';
import Loader from './shared/Loader';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isInitialized, initializeAuth } = useStore();

    useEffect(() => {
        if (!isInitialized) {
            initializeAuth();
        }
    }, [isInitialized, initializeAuth]);

    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader size="lg" text="Loading..." />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;


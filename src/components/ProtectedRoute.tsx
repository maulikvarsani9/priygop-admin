import React from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    // For now, allow access without auth (can be added later)
    // const { isAuthenticated } = useStore();
    // if (!isAuthenticated) {
    //     return <Navigate to="/login" replace />;
    // }

    return <>{children}</>;
};

export default ProtectedRoute;


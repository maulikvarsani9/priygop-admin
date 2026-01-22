import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useNavigate,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './contexts/ToastContext';
import { setNavigateFunction } from './utils/navigation';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Authors from './pages/Authors';
import BlogList from './pages/BlogList';
import BlogForm from './pages/BlogForm';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: (failureCount, error: unknown) => {
                const status = (error as { response?: { status?: number } })?.response
                    ?.status;
                if (status && status >= 400 && status < 500) {
                    return false;
                }
                return failureCount < 1;
            },
            retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        },
        mutations: {
            retry: false,
        },
    },
});

// App Routes Component
const AppRoutes: React.FC = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        setNavigateFunction(navigate);
    }, [navigate]);

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/"
                element={
                    <Layout>
                        <Navigate to="/dashboard" replace />
                    </Layout>
                }
            />
            <Route
                path="/dashboard"
                element={
                    <Layout>
                        <Dashboard />
                    </Layout>
                }
            />
            <Route
                path="/authors"
                element={
                    <Layout>
                        <Authors />
                    </Layout>
                }
            />
            <Route
                path="/blogs"
                element={
                    <Layout>
                        <BlogList />
                    </Layout>
                }
            />
            <Route
                path="/blogs/add"
                element={
                    <Layout>
                        <BlogForm />
                    </Layout>
                }
            />
            <Route
                path="/blogs/edit/:id"
                element={
                    <Layout>
                        <BlogForm />
                    </Layout>
                }
            />
        </Routes>
    );
};

// Main App Component
function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ToastProvider>
                <Router>
                    <AppRoutes />
                </Router>
            </ToastProvider>
        </QueryClientProvider>
    );
}

export default App;


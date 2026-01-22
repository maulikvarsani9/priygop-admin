import React from 'react';
import { FiBook } from 'react-icons/fi';
import { useBlogs } from '../hooks/useBlogs';
import Loader from '../components/shared/Loader';

const Dashboard: React.FC = () => {
    const { blogs, loading } = useBlogs();

    if (loading) {
        return <Loader isCenter size="lg" text="Loading dashboard..." />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your blog.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Blogs</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{blogs.length}</p>
                        </div>
                        <div className="bg-[#10b981] p-3 rounded-lg">
                            <FiBook className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;


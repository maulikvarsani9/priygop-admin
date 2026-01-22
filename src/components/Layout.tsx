import React, { useState } from 'react';
import ProtectedRoute from './ProtectedRoute';
import Sidebar from './Sidebar';
import { FiMenu, FiX } from 'react-icons/fi';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-gray-50">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-gray-200">
                    <Sidebar />
                </aside>

                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Mobile Sidebar */}
                <aside
                    className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-30 transform transition-transform duration-300 lg:hidden ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="p-4 flex justify-end border-b border-gray-200">
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>
                    <Sidebar onLinkClick={() => setSidebarOpen(false)} />
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 w-full min-w-0">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden fixed top-4 left-4 z-10 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 border border-gray-200"
                        aria-label="Open menu"
                    >
                        <FiMenu className="w-5 h-5" />
                    </button>
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
};

export default Layout;


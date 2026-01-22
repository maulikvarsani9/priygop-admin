import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiLogOut, FiUser, FiUsers } from 'react-icons/fi';
import { useStore } from '../store/store';

interface SidebarProps {
    onLinkClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLinkClick }) => {
    const location = useLocation();
    const { user, logout } = useStore();

    const menuItems = [
        {
            id: 'dashboard',
            title: 'Dashboard',
            icon: FiHome,
            url: '/dashboard',
        },
        {
            id: 'authors',
            title: 'Authors',
            icon: FiUsers,
            url: '/authors',
        },
        {
            id: 'blogs',
            title: 'Blogs',
            icon: FiBook,
            url: '/blogs',
        },
    ];

    const isActive = (url: string) => {
        if (url === '/dashboard') {
            return location.pathname === '/dashboard' || location.pathname === '/';
        }
        return location.pathname.startsWith(url);
    };

    return (
        <div className="w-full bg-white flex flex-col h-full border-r border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#10b981] rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-white font-bold text-xl">P</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-lg font-bold text-gray-800 truncate">Priygop</h1>
                        <p className="text-xs text-gray-500 truncate">Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.url);
                    return (
                        <Link
                            key={item.id}
                            to={item.url}
                            onClick={onLinkClick}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${active
                                    ? 'bg-[#10b981] text-white font-medium hover:bg-[#059669]'
                                    : 'text-gray-700 hover:bg-[#10b981]/10'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.title}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-gray-200">
                {user && (
                    <div className="flex items-center space-x-3 mb-3 px-4 py-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                            <FiUser className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                                {user.name || user.email}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => {
                        onLinkClick?.();
                        logout();
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                    <FiLogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;


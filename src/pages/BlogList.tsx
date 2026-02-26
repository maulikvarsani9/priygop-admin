import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiFileText, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useBlogs } from '../hooks/useBlogs';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/ui/button';
import Loader from '../components/shared/Loader';
import Pagination from '../components/shared/Pagination';
import DeleteConfirmationDialog from '../components/shared/DeleteConfirmationDialog';

const BlogList: React.FC = () => {
    const navigate = useNavigate();
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean;
        blogId: string | null;
    }>({ isOpen: false, blogId: null });

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'draft' | 'published' | 'archived' | ''>('');

    const { blogs, loading, pagination, fetchBlogs, deleteBlog: deleteBlogMutation, publishBlog: publishBlogMutation, unpublishBlog: unpublishBlogMutation } = useBlogs();
    const { showSuccess, showError } = useToast();

    const handleDeleteClick = (blogId: string) => {
        setDeleteConfirmation({ isOpen: true, blogId });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirmation.blogId) return;

        try {
            await deleteBlogMutation(deleteConfirmation.blogId);
            showSuccess('Success', 'Blog deleted successfully');
            setDeleteConfirmation({ isOpen: false, blogId: null });
        } catch (error) {
            showError('Error', error instanceof Error ? error.message : 'Failed to delete blog');
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmation({ isOpen: false, blogId: null });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchBlogs(page, searchQuery, statusFilter || undefined);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchBlogs(1, searchQuery, statusFilter || undefined);
    };

    const handleStatusFilterChange = (status: 'draft' | 'published' | 'archived' | '') => {
        setStatusFilter(status);
        setCurrentPage(1);
        fetchBlogs(1, searchQuery, status || undefined);
    };

    const handlePublish = async (blogId: string) => {
        try {
            await publishBlogMutation(blogId);
            showSuccess('Success', 'Blog published successfully');
        } catch (error) {
            showError('Error', error instanceof Error ? error.message : 'Failed to publish blog');
        }
    };

    const handleUnpublish = async (blogId: string) => {
        try {
            await unpublishBlogMutation(blogId);
            showSuccess('Success', 'Blog unpublished successfully');
        } catch (error) {
            showError('Error', error instanceof Error ? error.message : 'Failed to unpublish blog');
        }
    };

    const getStatusBadge = (status: 'draft' | 'published' | 'archived') => {
        const statusConfig = {
            draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' },
            published: { bg: 'bg-green-100', text: 'text-green-800', label: 'Published' },
            archived: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Archived' },
        };
        const config = statusConfig[status];
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const stripHtml = (html: string) => {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
                    <p className="text-gray-600 mt-1">Manage your blog posts</p>
                </div>
                <Button
                    onClick={() => navigate('/blogs/add')}
                    className="bg-[#10b981] hover:bg-[#059669] whitespace-nowrap"
                >
                    <FiPlus className="w-4 h-4 mr-2" />
                    Add Blog Post
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            placeholder="Search blogs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
                        />
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => handleStatusFilterChange(e.target.value as 'draft' | 'published' | 'archived' | '')}
                                className="appearance-none bg-white px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent cursor-pointer min-w-[160px] text-gray-700 font-medium hover:border-gray-400"
                            >
                                <option value="">All Status</option>
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <Button type="submit" className="bg-[#10b981] hover:bg-[#059669] whitespace-nowrap">
                            Search
                        </Button>
                    </form>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader size="lg" text="Loading blogs..." />
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <FiFileText className="w-8 h-8 text-gray-400" />
                            </div>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
                        <p className="text-gray-500 mb-6">
                            {searchQuery
                                ? 'Try adjusting your search terms'
                                : 'Get started by creating your first blog post'}
                        </p>
                        {!searchQuery && (
                            <Button
                                onClick={() => navigate('/blogs/add')}
                                className="bg-[#10b981] hover:bg-[#059669]"
                            >
                                <FiPlus className="w-4 h-4 mr-2" />
                                Create Your First Blog Post
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px]">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Blog Post
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Author
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {blogs.map((blog) => (
                                    <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 sm:px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 sm:h-16 sm:w-16">
                                                    <img
                                                        className="h-12 w-12 sm:h-16 sm:w-16 rounded object-cover"
                                                        src={blog.mainImage}
                                                        alt={blog.title}
                                                        onError={(e) => {
                                                            e.currentTarget.src = 'https://via.placeholder.com/64';
                                                        }}
                                                    />
                                                </div>
                                                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                                                    <div className="text-sm font-medium text-gray-900 truncate">
                                                        {truncateText(blog.title, 60)}
                                                    </div>
                                                    <div className="text-sm text-gray-500 truncate mt-1">
                                                        {truncateText(stripHtml(blog.content), 80)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">
                                                {typeof blog.author === 'object' && blog.author?.name
                                                    ? blog.author.name
                                                    : typeof blog.author === 'string'
                                                        ? blog.author
                                                        : 'Unknown Author'}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(blog.status || 'draft')}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(blog.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(blog.createdAt).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                {(blog.status === 'draft' || !blog.status) && (
                                                    <Button
                                                        onClick={() => handlePublish(blog._id)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-green-600 hover:text-green-900 hover:bg-green-50"
                                                        aria-label="Publish blog"
                                                        title="Publish"
                                                    >
                                                        <FiCheckCircle className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                {blog.status === 'published' && (
                                                    <Button
                                                        onClick={() => handleUnpublish(blog._id)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50"
                                                        aria-label="Unpublish blog"
                                                        title="Unpublish"
                                                    >
                                                        <FiXCircle className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    onClick={() => navigate(`/blogs/edit/${blog._id}`)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-[#10b981] hover:text-[#059669] hover:bg-[#10b981]/10"
                                                    aria-label="Edit blog"
                                                >
                                                    <FiEdit2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    onClick={() => handleDeleteClick(blog._id)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-900 hover:bg-red-50"
                                                    aria-label="Delete blog"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && blogs.length > 0 && (
                    <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <Pagination
                            currentPage={currentPage}
                            pages={pagination.pages}
                            totalItems={pagination.total}
                            itemsPerPage={pagination.limit}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            <DeleteConfirmationDialog
                isOpen={deleteConfirmation.isOpen}
                onConfirm={handleDeleteConfirm}
                onClose={handleDeleteCancel}
                title="Delete Blog Post"
                message="Are you sure you want to delete this blog post? This action cannot be undone."
            />
        </div>
    );
};

export default BlogList;


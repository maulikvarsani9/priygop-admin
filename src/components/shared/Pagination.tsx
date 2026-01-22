import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
    currentPage: number;
    pages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    pages,
    totalItems,
    itemsPerPage,
    onPageChange,
}) => {
    const safeTotalItems = totalItems || 0;
    const safeTotalPages = pages || 1;
    const safeCurrentPage = currentPage || 1;

    const startIndex = (safeCurrentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, safeTotalItems);

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxVisible = 5;
        let startPage = Math.max(1, safeCurrentPage - Math.floor(maxVisible / 2));
        const endPage = Math.min(safeTotalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        if (startPage > 1) {
            pageNumbers.push(
                <button
                    key="first"
                    onClick={() => onPageChange(1)}
                    className={`px-3 py-1 rounded-md ${
                        safeCurrentPage === 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border hover:bg-gray-100'
                    }`}
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pageNumbers.push(<span key="dots-start" className="px-2">...</span>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`px-3 py-1 rounded-md ${
                        safeCurrentPage === i
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border hover:bg-gray-100'
                    }`}
                >
                    {i}
                </button>
            );
        }

        if (endPage < safeTotalPages) {
            if (endPage < safeTotalPages - 1) {
                pageNumbers.push(<span key="dots-end" className="px-2">...</span>);
            }
            pageNumbers.push(
                <button
                    key="last"
                    onClick={() => onPageChange(safeTotalPages)}
                    className={`px-3 py-1 rounded-md ${
                        safeCurrentPage === safeTotalPages
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border hover:bg-gray-100'
                    }`}
                >
                    {safeTotalPages}
                </button>
            );
        }

        return pageNumbers;
    };

    return (
        <div className="bg-white px-4 py-3 border-t rounded-b-lg border-gray-200 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="text-sm text-gray-700">
                    Showing {startIndex + 1} to {endIndex} of {safeTotalItems} results
                </div>

                <div className="flex items-center space-x-1">
                    <button
                        onClick={() => onPageChange(safeCurrentPage - 1)}
                        disabled={safeCurrentPage === 1}
                        className="px-2 py-1 border rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiChevronLeft className="h-4 w-4" />
                    </button>
                    {renderPageNumbers()}
                    <button
                        onClick={() => onPageChange(safeCurrentPage + 1)}
                        disabled={safeCurrentPage === safeTotalPages}
                        className="px-2 py-1 border rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pagination;


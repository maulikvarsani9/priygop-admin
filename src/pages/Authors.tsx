import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from 'react-icons/fi';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuthors } from '../hooks/useAuthors';
import { uploadService } from '../services/uploadService';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/ui/button';
import FormInput from '../components/shared/FormInput';
import Loader from '../components/shared/Loader';
import Pagination from '../components/shared/Pagination';
import DeleteConfirmationDialog from '../components/shared/DeleteConfirmationDialog';
import type { Author } from '../types/api';

const authorSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Name must be at least 2 characters').max(100).required('Name is required'),
});

const Authors: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean;
        authorId: string | null;
    }>({ isOpen: false, authorId: null });
    const [currentPage, setCurrentPage] = useState(1);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const { authors, loading, pagination, fetchAuthors, createAuthor, updateAuthor, deleteAuthor: deleteAuthorMutation } = useAuthors();
    const { showSuccess, showError } = useToast();

    const handleOpenModal = (author?: Author) => {
        if (author) {
            setEditingAuthor(author);
            const existingImage = author.image || '';
            setImageUrl(existingImage);
            setImagePreview(existingImage || null);
        } else {
            setEditingAuthor(null);
            setImageUrl('');
            setImagePreview(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAuthor(null);
        setImageUrl('');
        setImagePreview(null);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        setIsUploading(true);
        try {
            const url = await uploadService.uploadAuthorImage(file);
            if (url && url.trim() !== '') {
                setImageUrl(url);
                setImagePreview(url);
                showSuccess('Upload Successful', 'Image uploaded successfully');
            } else {
                throw new Error('No image URL returned from server');
            }
        } catch (error) {
            showError('Upload Failed', error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
            setImagePreview(null);
            setImageUrl('');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (values: { name: string }) => {
        try {
            const data: { name: string; image?: string } = {
                name: values.name,
            };
            
            // Only include image if it's not empty
            if (imageUrl && imageUrl.trim() !== '') {
                data.image = imageUrl.trim();
            }

            if (editingAuthor) {
                await updateAuthor(editingAuthor._id, data);
                showSuccess('Success', 'Author updated successfully');
            } else {
                await createAuthor(data);
                showSuccess('Success', 'Author created successfully');
            }
            handleCloseModal();
        } catch (error) {
            showError('Error', error instanceof Error ? error.message : 'Failed to save author');
        }
    };

    const handleDeleteClick = (authorId: string) => {
        setDeleteConfirmation({ isOpen: true, authorId });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirmation.authorId) return;

        try {
            await deleteAuthorMutation(deleteConfirmation.authorId);
            showSuccess('Success', 'Author deleted successfully');
            setDeleteConfirmation({ isOpen: false, authorId: null });
        } catch (error) {
            showError('Error', 'Failed to delete author');
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchAuthors(page);
    };

    const formik = useFormik({
        initialValues: {
            name: editingAuthor?.name || '',
        },
        validationSchema: authorSchema,
        onSubmit: handleSubmit,
        enableReinitialize: true,
    });

    // Update formik values when editingAuthor changes
    useEffect(() => {
        if (editingAuthor && isModalOpen) {
            formik.setFieldValue('name', editingAuthor.name);
        } else if (!editingAuthor && isModalOpen) {
            formik.resetForm();
        }
    }, [editingAuthor, isModalOpen]);

    if (loading && !authors.length) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader size="lg" text="Loading authors..." />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Authors</h1>
                    <p className="text-gray-600 mt-1">Manage blog authors</p>
                </div>
                <Button
                    onClick={() => handleOpenModal()}
                    className="bg-[#10b981] hover:bg-[#059669] whitespace-nowrap"
                >
                    <FiPlus className="w-4 h-4 mr-2" />
                    Add Author
                </Button>
            </div>

            {/* Authors Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader size="lg" text="Loading authors..." />
                    </div>
                ) : authors.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No authors found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px]">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Image
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {authors.map((author) => (
                                    <tr key={author._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 sm:px-6 py-4">
                                            {author.image ? (
                                                <img
                                                    src={author.image}
                                                    alt={author.name}
                                                    className="h-12 w-12 rounded-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.src = 'https://via.placeholder.com/48';
                                                    }}
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <span className="text-gray-600 text-sm font-semibold">
                                                        {author.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4">
                                            <span className="text-sm font-medium text-gray-900">{author.name}</span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    onClick={() => handleOpenModal(author)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-[#10b981] hover:text-[#059669] hover:bg-[#10b981]/10"
                                                >
                                                    <FiEdit2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    onClick={() => handleDeleteClick(author._id)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-900 hover:bg-red-50"
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

                {!loading && authors.length > 0 && (
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingAuthor ? 'Edit Author' : 'Add Author'}
                                </h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
                            <FormInput
                                name="name"
                                label="Name"
                                placeholder="John Doe"
                                required
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.errors.name}
                                touched={formik.touched.name}
                            />

                            {/* Image Upload */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Profile Image
                                </label>
                                <div className="space-y-3">
                                    {(imagePreview || imageUrl) && (
                                        <div className="relative inline-block">
                                            <img
                                                src={imagePreview || imageUrl}
                                                alt="Preview"
                                                className="h-32 w-32 rounded-full object-cover border-2 border-gray-200"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <label
                                            htmlFor="image-upload"
                                            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            <FiUpload />
                                            {isUploading ? 'Uploading...' : imageUrl ? 'Change Image' : 'Upload Image'}
                                        </label>
                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                            disabled={isUploading}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <Button type="button" onClick={handleCloseModal} variant="outline">
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={formik.isSubmitting || isUploading}
                                    className="bg-[#10b981] hover:bg-[#059669]"
                                >
                                    {formik.isSubmitting ? 'Saving...' : editingAuthor ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            <DeleteConfirmationDialog
                isOpen={deleteConfirmation.isOpen}
                onClose={() => setDeleteConfirmation({ isOpen: false, authorId: null })}
                onConfirm={handleDeleteConfirm}
                title="Delete Author"
                message="Are you sure you want to delete this author? This action cannot be undone."
            />
        </div>
    );
};

export default Authors;


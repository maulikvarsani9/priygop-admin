import React, { useState, useEffect, useRef } from 'react';
import { FiUpload, FiArrowLeft } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useBlogs } from '../hooks/useBlogs';
import { blogsService } from '../services/blogsService';
import { authorsService } from '../services/authorsService';
import { uploadService } from '../services/uploadService';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/ui/button';
import FormInput from '../components/shared/FormInput';
import Loader from '../components/shared/Loader';
import { RichTextEditor } from '../components/RichTextEditor';
import type { Author } from '../types/api';

const blogSchema = Yup.object().shape({
    title: Yup.string().min(5, 'Title must be at least 5 characters').max(200).required('Title is required'),
    content: Yup.string().min(50, 'Content must be at least 50 characters').required('Content is required'),
    author: Yup.string().required('Author is required'),
    status: Yup.string().oneOf(['draft', 'published', 'archived'], 'Invalid status').optional(),
});

const countWords = (text: string): number => {
    if (!text || text.trim().length === 0) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

const stripHtmlAndCount = (html: string): { text: string; chars: number; words: number } => {
    if (!html) return { text: '', chars: 0, words: 0 };
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || '';
    return {
        text,
        chars: text.length,
        words: countWords(text),
    };
};

const BlogForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [mainImageUrl, setMainImageUrl] = useState<string>('');
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [coverImageUrl, setCoverImageUrl] = useState<string>('');
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [initialValues, setInitialValues] = useState({
        title: '',
        content: '',
        author: '',
        status: 'draft' as 'draft' | 'published' | 'archived',
    });

    const hasLoadedAuthors = useRef(false);
    const hasLoadedBlog = useRef(false);
    const { showSuccess, showError } = useToast();
    const { createBlog, updateBlog } = useBlogs();

    // Load authors
    useEffect(() => {
        const loadAuthors = async () => {
            if (hasLoadedAuthors.current) return;
            hasLoadedAuthors.current = true;

            try {
                const response = await authorsService.getAuthors({ limit: 100 });
                setAuthors(response.authors || []);
            } catch (error) {
                showError('Error', 'Failed to load authors');
            }
        };
        loadAuthors();
    }, [showError]);

    // Load blog for editing
    useEffect(() => {
        const loadBlog = async () => {
            if (!isEditMode || hasLoadedBlog.current) return;
            hasLoadedBlog.current = true;
            setLoading(true);

            try {
                const blog = await blogsService.getBlog(id!);

                setInitialValues({
                    title: blog.title,
                    content: blog.content,
                    author: typeof blog.author === 'object' ? (blog.author as any)._id : blog.author,
                    status: (blog.status || 'draft') as 'draft' | 'published' | 'archived',
                });

                setMainImageUrl(blog.mainImage);
                setMainImagePreview(blog.mainImage);
                setCoverImageUrl(blog.coverImage);
                setCoverImagePreview(blog.coverImage);
            } catch (error) {
                showError('Error', 'Failed to load blog');
                navigate('/blogs');
            } finally {
                setLoading(false);
            }
        };
        loadBlog();
    }, [id, isEditMode, navigate, showError]);

    const handleImageUpload = async (
        file: File,
        setUrl: (url: string) => void,
        setPreview: (url: string | null) => void
    ) => {
        try {
            setIsUploading(true);
            const url = await uploadService.uploadBlogImage(file);
            setUrl(url);
            setPreview(url);
            showSuccess('Success', 'Image uploaded successfully');
        } catch (error) {
            showError('Error', error instanceof Error ? error.message : 'Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (values: { title: string; content: string; author: string; status?: 'draft' | 'published' | 'archived' }) => {
        try {
            if (!mainImageUrl || !coverImageUrl) {
                showError('Error', 'Please upload both main and cover images');
                return;
            }

            const data = {
                title: values.title,
                content: values.content,
                mainImage: mainImageUrl,
                coverImage: coverImageUrl,
                author: values.author,
                status: values.status || 'draft',
            };

            if (isEditMode) {
                await updateBlog(id!, data);
                showSuccess('Success', 'Blog updated successfully');
            } else {
                await createBlog(data);
                showSuccess('Success', 'Blog created successfully');
            }
            navigate('/blogs');
        } catch (error) {
            showError('Error', error instanceof Error ? error.message : 'Failed to save blog');
        }
    };

    const formik = useFormik({
        initialValues,
        validationSchema: blogSchema,
        onSubmit: handleSubmit,
        enableReinitialize: true,
    });

    if (loading) {
        return <Loader isCenter size="lg" text="Loading blog..." />;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => navigate('/blogs')}>
                    <FiArrowLeft />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditMode ? 'Edit Blog' : 'Create New Blog'}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {isEditMode ? 'Update blog post details' : 'Fill in the details to create a new blog post'}
                    </p>
                </div>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <FormInput
                            name="title"
                            label="Title"
                            placeholder="Enter blog title"
                            required
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.errors.title}
                            touched={formik.touched.title}
                        />
                        <div className="mt-1 text-xs text-gray-500">
                            {formik.values.title.length} characters, {countWords(formik.values.title)} words
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Author <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="author"
                                value={formik.values.author}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full rounded-lg border px-4 py-2 ${
                                    formik.errors.author && formik.touched.author
                                        ? 'border-red-500'
                                        : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent`}
                            >
                                <option value="">Select an author</option>
                                {authors.map((author) => (
                                    <option key={author._id} value={author._id}>
                                        {author.name}
                                    </option>
                                ))}
                            </select>
                            {formik.errors.author && formik.touched.author && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.author}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formik.values.status}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full rounded-lg border px-4 py-2 ${
                                    formik.errors.status && formik.touched.status
                                        ? 'border-red-500'
                                        : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent`}
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                            {formik.errors.status && formik.touched.status && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.status}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Main Image <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-3">
                                {mainImagePreview && (
                                    <img
                                        src={mainImagePreview}
                                        alt="Main preview"
                                        className="h-40 w-full rounded-lg object-cover"
                                    />
                                )}
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                handleImageUpload(file, setMainImageUrl, setMainImagePreview);
                                            }
                                        }}
                                        className="hidden"
                                        id="mainImage"
                                    />
                                    <label htmlFor="mainImage">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="w-full"
                                            onClick={() => document.getElementById('mainImage')?.click()}
                                            disabled={isUploading}
                                        >
                                            <FiUpload className="mr-2" />
                                            {isUploading ? 'Uploading...' : 'Upload Main Image'}
                                        </Button>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Cover Image <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-3">
                                {coverImagePreview && (
                                    <img
                                        src={coverImagePreview}
                                        alt="Cover preview"
                                        className="h-40 w-full rounded-lg object-cover"
                                    />
                                )}
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                handleImageUpload(file, setCoverImageUrl, setCoverImagePreview);
                                            }
                                        }}
                                        className="hidden"
                                        id="coverImage"
                                    />
                                    <label htmlFor="coverImage">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="w-full"
                                            onClick={() => document.getElementById('coverImage')?.click()}
                                            disabled={isUploading}
                                        >
                                            <FiUpload className="mr-2" />
                                            {isUploading ? 'Uploading...' : 'Upload Cover Image'}
                                        </Button>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Content <span className="text-red-500">*</span>
                        </label>
                        <RichTextEditor
                            value={formik.values.content}
                            onChange={(value) => {
                                formik.setFieldValue('content', value);
                                formik.setFieldTouched('content', true);
                            }}
                            placeholder="Write your blog content here..."
                            className="border border-gray-300 rounded-lg"
                        />
                        {formik.errors.content && formik.touched.content && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.content}</p>
                        )}
                        {(() => {
                            const { chars, words } = stripHtmlAndCount(formik.values.content);
                            return (
                                <div className="mt-1 text-xs text-gray-500">
                                    {chars} characters, {words} words
                                </div>
                            );
                        })()}
                    </div>

                    <div className="flex justify-end gap-3 border-t pt-4 mt-4">
                        <Button type="button" onClick={() => navigate('/blogs')} variant="outline">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={formik.isSubmitting || isUploading} className="bg-[#10b981] hover:bg-[#059669]">
                            {formik.isSubmitting ? 'Saving...' : isEditMode ? 'Update Blog' : 'Create Blog'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BlogForm;

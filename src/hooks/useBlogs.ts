import { useState, useEffect, useCallback, useRef } from "react";
import { blogsService } from "../services/blogsService";
import type { Blog } from "../types/api";

interface UseBlogsReturn {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  fetchBlogs: (page?: number, search?: string) => Promise<void>;
  createBlog: (data: {
    title: string;
    content: string;
    mainImage: string;
    coverImage: string;
    author: string;
  }) => Promise<void>;
  updateBlog: (
    id: string,
    data: {
      title: string;
      content: string;
      mainImage: string;
      coverImage: string;
      author: string;
    }
  ) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
}

export const useBlogs = (): UseBlogsReturn => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const hasFetched = useRef(false);

  const fetchBlogs = useCallback(async (page = 1, search = "") => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogsService.getBlogs({ page, limit: 10, search });
      setBlogs(response.blogs);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch blogs";
      setError(errorMessage);
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createBlog = useCallback(
    async (data: {
      title: string;
      content: string;
      mainImage: string;
      coverImage: string;
      author: string;
    }) => {
      try {
        setLoading(true);
        setError(null);
        await blogsService.createBlog(data);
        await fetchBlogs(pagination.page);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create blog";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, fetchBlogs]
  );

  const updateBlog = useCallback(
    async (
      id: string,
      data: {
        title: string;
        content: string;
        mainImage: string;
        coverImage: string;
        author: string;
      }
    ) => {
      try {
        setLoading(true);
        setError(null);
        await blogsService.updateBlog(id, data);
        await fetchBlogs(pagination.page);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update blog";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, fetchBlogs]
  );

  const deleteBlog = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);
        await blogsService.deleteBlog(id);
        await fetchBlogs(pagination.page);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete blog";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, fetchBlogs]
  );

  useEffect(() => {
    // Prevent double API call in React StrictMode
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchBlogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    blogs,
    loading,
    error,
    pagination,
    fetchBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
  };
};


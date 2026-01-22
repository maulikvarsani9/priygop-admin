import { useState, useEffect, useCallback, useRef } from "react";
import { authorsService } from "../services/authorsService";
import type { Author } from "../types/api";

interface UseAuthorsReturn {
  authors: Author[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  fetchAuthors: (page?: number, search?: string) => Promise<void>;
  createAuthor: (data: { name: string; image?: string }) => Promise<void>;
  updateAuthor: (id: string, data: { name: string; image?: string }) => Promise<void>;
  deleteAuthor: (id: string) => Promise<void>;
}

export const useAuthors = (): UseAuthorsReturn => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const hasFetched = useRef(false);

  const fetchAuthors = useCallback(async (page = 1, search = "") => {
    try {
      setLoading(true);
      setError(null);
      const response = await authorsService.getAuthors({ page, limit: 10, search });
      setAuthors(response.authors || []);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch authors";
      setError(errorMessage);
      console.error("Error fetching authors:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAuthor = useCallback(
    async (data: { name: string; image?: string }) => {
      try {
        setLoading(true);
        setError(null);
        await authorsService.createAuthor(data);
        // Refresh the list after creation
        await fetchAuthors(pagination.page);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create author";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, fetchAuthors]
  );

  const updateAuthor = useCallback(
    async (id: string, data: { name: string; image?: string }) => {
      try {
        setLoading(true);
        setError(null);
        await authorsService.updateAuthor(id, data);
        // Refresh the list after update
        await fetchAuthors(pagination.page);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update author";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, fetchAuthors]
  );

  const deleteAuthor = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);
        await authorsService.deleteAuthor(id);
        await fetchAuthors(pagination.page);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete author";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, fetchAuthors]
  );

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchAuthors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    authors,
    loading,
    error,
    pagination,
    fetchAuthors,
    createAuthor,
    updateAuthor,
    deleteAuthor,
  };
};


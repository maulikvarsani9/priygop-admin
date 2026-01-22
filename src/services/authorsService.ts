import { apiClient, apiEndpoints } from "../lib/api";
import type { Author } from "../types/api";

export const authorsService = {
  // Get all authors
  getAuthors: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ authors: Author[]; pagination?: any }> => {
    const response = await apiClient.get<any>(
      apiEndpoints.authors.getAll,
      params
    );
    // Backend returns { success: true, data: { authors, pagination }, message }
    if (response.data && response.data.authors) {
      return response.data;
    }
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  // Get author by ID
  getAuthor: async (id: string): Promise<Author> => {
    const response = await apiClient.get<any>(
      apiEndpoints.authors.getById(id)
    );
    // Backend returns { success: true, data: { author }, message }
    if (response.data && response.data.author) {
      return response.data.author;
    }
    if (response.data && response.data.data && response.data.data.author) {
      return response.data.data.author;
    }
    return response.data.data || response.data;
  },

  // Create author
  createAuthor: async (data: { name: string; image?: string }): Promise<Author> => {
    const response = await apiClient.post<any>(
      apiEndpoints.authors.create,
      data
    );
    // Backend returns { success: true, data: { author }, message }
    if (response.data && response.data.author) {
      return response.data.author;
    }
    if (response.data && response.data.data && response.data.data.author) {
      return response.data.data.author;
    }
    return response.data.data || response.data;
  },

  // Update author
  updateAuthor: async (
    id: string,
    data: { name: string; image?: string }
  ): Promise<Author> => {
    const response = await apiClient.put<any>(
      apiEndpoints.authors.update(id),
      data
    );
    // Backend returns { success: true, data: { author }, message }
    if (response.data && response.data.author) {
      return response.data.author;
    }
    if (response.data && response.data.data && response.data.data.author) {
      return response.data.data.author;
    }
    return response.data.data || response.data;
  },

  // Delete author
  deleteAuthor: async (id: string): Promise<void> => {
    await apiClient.delete(apiEndpoints.authors.delete(id));
  },
};


import { apiClient, apiEndpoints } from "../lib/api";
import type { Blog, BlogsResponse } from "../types/api";

export const blogsService = {
  // Get all blogs
  getBlogs: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'draft' | 'published' | 'archived';
  }): Promise<BlogsResponse> => {
    const response = await apiClient.get<any>(
      apiEndpoints.blogs.getAll,
      params
    );
    // Backend returns { success: true, data: { blogs, pagination }, message }
    if (response.data && response.data.blogs) {
      return response.data;
    }
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  // Get blog by ID
  getBlog: async (id: string): Promise<Blog> => {
    const response = await apiClient.get<any>(
      apiEndpoints.blogs.getById(id)
    );
    // Backend returns { success: true, data: { blog }, message }
    if (response.data && response.data.blog) {
      return response.data.blog;
    }
    if (response.data && response.data.data && response.data.data.blog) {
      return response.data.data.blog;
    }
    return response.data.data || response.data;
  },

  // Create blog
  createBlog: async (data: {
    title: string;
    content: string;
    mainImage: string;
    coverImage: string;
    author: string;
    status?: 'draft' | 'published' | 'archived';
  }): Promise<Blog> => {
    const response = await apiClient.post<any>(
      apiEndpoints.blogs.create,
      data
    );
    // Backend returns { success: true, data: { blog }, message }
    if (response.data && response.data.blog) {
      return response.data.blog;
    }
    if (response.data && response.data.data && response.data.data.blog) {
      return response.data.data.blog;
    }
    return response.data.data || response.data;
  },

  // Update blog
  updateBlog: async (
    id: string,
    data: {
      title?: string;
      content?: string;
      mainImage?: string;
      coverImage?: string;
      author?: string;
      status?: 'draft' | 'published' | 'archived';
    }
  ): Promise<Blog> => {
    const response = await apiClient.put<any>(
      apiEndpoints.blogs.update(id),
      data
    );
    // Backend returns { success: true, data: { blog }, message }
    if (response.data && response.data.blog) {
      return response.data.blog;
    }
    if (response.data && response.data.data && response.data.data.blog) {
      return response.data.data.blog;
    }
    return response.data.data || response.data;
  },

  // Delete blog
  deleteBlog: async (id: string): Promise<void> => {
    await apiClient.delete(apiEndpoints.blogs.delete(id));
  },

  // Publish blog
  publishBlog: async (id: string): Promise<Blog> => {
    const response = await apiClient.patch<any>(
      apiEndpoints.blogs.publish(id)
    );
    // Backend returns { success: true, data: { blog }, message }
    if (response.data && response.data.blog) {
      return response.data.blog;
    }
    if (response.data && response.data.data && response.data.data.blog) {
      return response.data.data.blog;
    }
    return response.data.data || response.data;
  },

  // Unpublish blog
  unpublishBlog: async (id: string): Promise<Blog> => {
    const response = await apiClient.patch<any>(
      apiEndpoints.blogs.unpublish(id)
    );
    // Backend returns { success: true, data: { blog }, message }
    if (response.data && response.data.blog) {
      return response.data.blog;
    }
    if (response.data && response.data.data && response.data.data.blog) {
      return response.data.data.blog;
    }
    return response.data.data || response.data;
  },
};


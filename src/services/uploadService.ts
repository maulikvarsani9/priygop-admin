import { apiClient, apiEndpoints } from "../lib/api";

export const uploadService = {
  // Upload blog image
  uploadBlogImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiClient.post<any>(
      apiEndpoints.uploads.blogImage,
      formData
    );

    // Backend returns { success: true, data: { imageUrl }, message }
    if (response.data && response.data.imageUrl) {
      return response.data.imageUrl;
    }
    if (response.data && response.data.data && response.data.data.imageUrl) {
      return response.data.data.imageUrl;
    }
    throw new Error("Failed to get image URL from response");
  },

  // Upload author image
  uploadAuthorImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiClient.post<any>(
      apiEndpoints.uploads.authorImage,
      formData
    );

    // Backend returns { success: true, data: { imageUrl }, message }
    if (response.data && response.data.imageUrl) {
      return response.data.imageUrl;
    }
    if (response.data && response.data.data && response.data.data.imageUrl) {
      return response.data.data.imageUrl;
    }
    throw new Error("Failed to get image URL from response");
  },
};


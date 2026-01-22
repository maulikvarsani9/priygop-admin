import axios from "axios";
import { navigateToLogin } from "../utils/navigation";
import { useStore } from "../store/store";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

class ApiClient {
  private axiosInstance: ReturnType<typeof axios.create>;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 40000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const store = JSON.parse(
          localStorage.getItem("priygop-admin-store") || "{}"
        );
        const token = store?.state?.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Don't set Content-Type for FormData, let browser set it with boundary
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        }

        return config;
      },
      (error) => {
        console.error("API Request Error:", error);
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("priygop-admin-store");

          useStore.setState({
            user: null,
            token: null,
            isAuthenticated: false,
          });

          setTimeout(() => {
            navigateToLogin();
          }, 100);
        }

        if (error.response?.data) {
          const backendError = error.response.data;

          if (backendError.error) {
            if (typeof backendError.error === "string") {
              error.message = backendError.error;
            } else if (backendError.error.message) {
              error.message = backendError.error.message;
            }
          } else if (backendError.message) {
            error.message = backendError.message;
          }
        } else if (error.code === "ECONNABORTED") {
          error.message =
            "Request timeout. Please check your connection and try again.";
        } else if (error.message === "Network Error") {
          error.message =
            "Network error. Please check your internet connection and ensure the server is running.";
        }

        return Promise.reject(error);
      }
    );
  }

  private async request<T>(
    endpoint: string,
    config: Record<string, unknown> = {}
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.request({
        url: endpoint,
        ...config,
      });
      return response.data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
      params,
    });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: Record<string, unknown>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      data,
      ...config,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      data,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }

  getAxiosInstance() {
    return this.axiosInstance;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

export const api = apiClient.getAxiosInstance();

export const apiEndpoints = {
  auth: {
    login: "/admin/auth/login",
    logout: "/admin/auth/logout",
    profile: "/admin/auth/profile",
  },
  blogs: {
    getAll: "/admin/blogs",
    getById: (id: string) => `/admin/blogs/${id}`,
    create: "/admin/blogs",
    update: (id: string) => `/admin/blogs/${id}`,
    delete: (id: string) => `/admin/blogs/${id}`,
  },
  authors: {
    getAll: "/admin/authors",
    getById: (id: string) => `/admin/authors/${id}`,
    create: "/admin/authors",
    update: (id: string) => `/admin/authors/${id}`,
    delete: (id: string) => `/admin/authors/${id}`,
  },
  uploads: {
    blogImage: "/admin/blog-upload",
    authorImage: "/admin/author-upload",
  },
};

export default apiClient;


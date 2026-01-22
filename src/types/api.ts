export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface Author {
  _id: string;
  name: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  mainImage: string;
  coverImage: string;
  author: string | {
    _id: string;
    name: string;
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BlogsResponse {
  blogs: Blog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}


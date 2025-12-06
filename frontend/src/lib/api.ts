import axios from 'axios';
import type { ContentItem, User, Artwork } from './types';

const API_BASE = '/api';

// Create axios instance with auth interceptor
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (email: string, password: string, name: string) => {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  
  updateProfile: async (data: { name?: string; email?: string }) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
  
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post('/auth/change-password', { currentPassword, newPassword });
    return response.data;
  },
};

// Content API
export const contentAPI = {
  getAll: async (params?: { type?: string; status?: string; page?: number; limit?: number }) => {
    const response = await api.get('/content', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/content/${id}`);
    return response.data;
  },
  
  getBySlug: async (slug: string) => {
    const response = await api.get(`/content/slug/${slug}`);
    return response.data;
  },
  
  create: async (data: Partial<ContentItem>) => {
    const response = await api.post('/content', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<ContentItem>) => {
    const response = await api.put(`/content/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/content/${id}`);
    return response.data;
  },
};

// Upload API
export const uploadAPI = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  uploadGallery: async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    const response = await api.post('/upload/gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  deleteFile: async (filename: string) => {
    const response = await api.delete(`/upload/${filename}`);
    return response.data;
  },
  
  listFiles: async () => {
    const response = await api.get('/upload/list');
    return response.data;
  },
};

// Settings API
export const settingsAPI = {
  getPublic: async () => {
    const response = await api.get('/settings/public');
    return response.data;
  },
  
  getAll: async () => {
    const response = await api.get('/settings');
    return response.data;
  },
  
  update: async (key: string, value: any) => {
    const response = await api.put(`/settings/${key}`, { value });
    return response.data;
  },
  
  updateBulk: async (settings: Record<string, any>) => {
    const response = await api.put('/settings', { settings });
    return response.data;
  },
};

// Gallery/Artworks API (using content API with type filter)
export const galleryAPI = {
  getArtworks: async () => {
    const response = await contentAPI.getAll({ type: 'project', status: 'published', limit: 100 });
    return response.content.map((item: ContentItem) => ({
      id: item._id,
      _id: item._id,
      title: item.title,
      medium: item.tags?.find((t: string) => t.startsWith('medium:'))?.replace('medium:', '') || 'Mixed Media',
      dimensions: item.tags?.find((t: string) => t.startsWith('dim:'))?.replace('dim:', '') || '',
      year: item.tags?.find((t: string) => t.startsWith('year:'))?.replace('year:', '') || new Date(item.createdAt).getFullYear().toString(),
      imageUrl: item.featuredImage || '/placeholder.jpg',
      category: item.categories?.[0] || 'Galleri',
      description: item.excerpt || item.content,
      price: item.tags?.find((t: string) => t.startsWith('price:'))?.replace('price:', ''),
      status: item.tags?.includes('sold') ? 'sold' : item.tags?.includes('reserved') ? 'reserved' : 'available',
    })) as Artwork[];
  },
  
  createArtwork: async (artwork: Partial<Artwork>) => {
    const tags = [
      artwork.medium ? `medium:${artwork.medium}` : null,
      artwork.dimensions ? `dim:${artwork.dimensions}` : null,
      artwork.year ? `year:${artwork.year}` : null,
      artwork.price ? `price:${artwork.price}` : null,
      artwork.status === 'sold' ? 'sold' : null,
      artwork.status === 'reserved' ? 'reserved' : null,
    ].filter(Boolean) as string[];
    
    return contentAPI.create({
      title: artwork.title || 'Untitled',
      content: artwork.description || '',
      excerpt: artwork.description || '',
      type: 'project',
      status: 'published',
      featuredImage: artwork.imageUrl,
      categories: [artwork.category || 'Galleri'],
      tags,
    });
  },
  
  updateArtwork: async (id: string, artwork: Partial<Artwork>) => {
    const tags = [
      artwork.medium ? `medium:${artwork.medium}` : null,
      artwork.dimensions ? `dim:${artwork.dimensions}` : null,
      artwork.year ? `year:${artwork.year}` : null,
      artwork.price ? `price:${artwork.price}` : null,
      artwork.status === 'sold' ? 'sold' : null,
      artwork.status === 'reserved' ? 'reserved' : null,
    ].filter(Boolean) as string[];
    
    return contentAPI.update(id, {
      title: artwork.title,
      content: artwork.description,
      excerpt: artwork.description,
      featuredImage: artwork.imageUrl,
      categories: artwork.category ? [artwork.category] : undefined,
      tags,
    });
  },
  
  deleteArtwork: async (id: string) => {
    return contentAPI.delete(id);
  },
};

export default api;


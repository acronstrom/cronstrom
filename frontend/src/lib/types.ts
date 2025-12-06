export type Artwork = {
  _id?: string;
  id: string;
  title: string;
  medium: string;
  dimensions: string;
  year: string;
  imageUrl: string;
  category: string;
  description?: string;
  price?: string;
  status: 'available' | 'sold' | 'reserved';
};

export type ExhibitionCategory = 'separat' | 'samling' | 'jury' | 'kommande';

export type Exhibition = {
  id?: string;
  year?: string;
  title: string;
  location?: string;
  venue?: string;
  date?: string;
  category?: ExhibitionCategory;
  type?: 'Solo' | 'Group';
  description?: string;
};

export type ArtistBio = {
  name: string;
  tagline: string;
  shortBio: string;
  fullBio: string;
  exhibitions: Exhibition[];
};

export type EducationItem = {
  year: string;
  school: string;
  program: string;
};

export type SiteSettings = {
  artistName: string;
  tagline: string;
  shortBio: string;
  fullBio: string;
  email: string;
  phone: string;
  address: string;
  heroImage: string;
  instagram?: string;
  facebook?: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'user';
  avatar?: string;
};

export type ContentItem = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  type: 'page' | 'post' | 'project' | 'service';
  status: 'draft' | 'published' | 'archived';
  featuredImage?: string;
  gallery?: { url: string; alt?: string; caption?: string }[];
  author: { name: string; email: string };
  publishedAt?: string;
  featured: boolean;
  order: number;
  tags: string[];
  categories: string[];
  createdAt: string;
  updatedAt: string;
};


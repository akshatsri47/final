import { Timestamp } from 'firebase/firestore';

export type BlogStatus = 'draft' | 'published' | 'scheduled';
export type MediaType = 'image' | 'video';

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  cloudinaryId: string;
  altText?: string;
  caption?: string;
  position: number;
  size?: number; // File size in bytes
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface BlogAuthor {
  id: string;
  name: string;
  email: string;
}

export interface BlogSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface BlogAnalytics {
  views: number;
  lastViewed?: Timestamp;
}

export interface BlogData {
  id?: string;
  title: string;
  slug: string;
  content: string; // Rich text HTML
  excerpt: string;
  featuredImage?: {
    url: string;
    cloudinaryId: string;
    altText: string;
  };
  mediaItems: MediaItem[];
  categories: string[];
  tags: string[];
  status: BlogStatus;
  publishDate: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  author: BlogAuthor;
  seo: BlogSEO;
  analytics: BlogAnalytics;
}

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  createdAt: Timestamp;
  blogCount: number;
}

export interface BlogFilters {
  category?: string;
  tags?: string[];
  status?: BlogStatus;
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  searchQuery?: string;
}

// API Response types for public endpoints
export interface BlogListResponse {
  blogs: BlogData[];
  totalCount: number;
  hasMore: boolean;
  nextCursor?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: string;
}
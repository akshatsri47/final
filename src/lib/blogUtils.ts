import { BlogData, MediaItem } from '@/types/blog';

export const DEFAULT_BLOG_IMAGE = '/banner1.jpg';

export const isUsableBlogImageUrl = (url?: string): url is string => {
  if (!url?.trim()) return false;

  const normalized = url.trim().toLowerCase();
  if (
    normalized.includes('example.com') ||
    normalized.includes('your-uploaded-image') ||
    normalized.includes('placeholder')
  ) {
    return false;
  }

  return normalized.startsWith('/') || /^https?:\/\//i.test(normalized);
};

export const extractFirstBlogImage = (content = ''): string | undefined => {
  const imageTags = content.match(/<img\b[^>]*>/gi) || [];

  for (const tag of imageTags) {
    const source = tag.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
    if (isUsableBlogImageUrl(source)) return source.trim();
  }

  return undefined;
};

export const getBlogImageUrl = (blog: BlogData): string => {
  if (isUsableBlogImageUrl(blog.featuredImage?.url)) {
    return blog.featuredImage.url.trim();
  }

  return DEFAULT_BLOG_IMAGE;
};

/**
 * Blog bodies are rich text, not full HTML documents. Older posts can contain
 * copied head metadata and placeholder images; remove those before rendering
 * so they cannot create duplicate SEO signals or broken media.
 */
export const sanitizeBlogContent = (content = ''): string => {
  let sanitized = content
    .replace(/<!doctype[^>]*>/gi, '')
    .replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<(?:meta|base)\b[^>]*\/?\s*>/gi, '')
    .replace(/<link\b[^>]*\/?\s*>/gi, '')
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/<\/?(?:html|body)\b[^>]*>/gi, '')
    .replace(/<p\b[^>]*>\s*Replace the image URL[\s\S]*?<\/p>/gi, '')
    .replace(/<img\b[^>]*>/gi, '')
    .replace(/Replace the image URL with the one you uploaded in your website\/media library\.?/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*(["']).*?\1/gi, '')
    .replace(/\s+(href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi, '');

  return sanitized.trim();
};

// Public utility functions for the user-facing app

// Generate excerpt from content
export const generateExcerpt = (content: string, maxLength: number = 160): string => {
  const textContent = content.replace(/<[^>]*>/g, '').trim();
  if (textContent.length <= maxLength) {
    return textContent;
  }
  
  return textContent.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
};

// Format date for display
import { convertToDate } from '../types/firebase';

export const formatBlogDate = (timestamp: unknown): string => {
  if (!timestamp) return '';
  
  const date = convertToDate(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// Calculate reading time
export const calculateReadingTime = (content: string): number => {
  const textContent = content.replace(/<[^>]*>/g, '');
  const wordsPerMinute = 200;
  const wordCount = textContent.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Media utilities
export const sortMediaByPosition = (mediaItems: MediaItem[]): MediaItem[] => {
  return [...mediaItems].sort((a, b) => a.position - b.position);
};

// Generate social sharing URLs
export const generateSocialShareUrls = (blog: BlogData, baseUrl: string) => {
  const url = `${baseUrl}/blog/${blog.slug}`;
  const title = encodeURIComponent(blog.title);
  const description = encodeURIComponent(blog.excerpt);
  
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${title}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${title}%20${encodeURIComponent(url)}`,
    email: `mailto:?subject=${title}&body=${description}%0A%0A${encodeURIComponent(url)}`
  };
};

// Search and filter utilities
export const searchBlogs = (blogs: BlogData[], query: string): BlogData[] => {
  if (!query.trim()) return blogs;
  
  const searchTerm = query.toLowerCase();
  return blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm) ||
    blog.excerpt.toLowerCase().includes(searchTerm) ||
    blog.content.toLowerCase().includes(searchTerm) ||
    blog.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

export const filterBlogsByCategory = (blogs: BlogData[], category: string): BlogData[] => {
  if (!category) return blogs;
  return blogs.filter(blog => blog.categories.includes(category));
};

export const filterBlogsByTag = (blogs: BlogData[], tag: string): BlogData[] => {
  if (!tag) return blogs;
  return blogs.filter(blog => blog.tags.includes(tag.toLowerCase()));
};

import { BlogData, MediaItem } from '@/types/blog';

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
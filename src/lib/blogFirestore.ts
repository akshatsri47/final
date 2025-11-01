import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  Timestamp,
  DocumentSnapshot,
  QueryConstraint,
  updateDoc
} from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { BlogData, CategoryData, BlogFilters, BlogListResponse } from '../types/blog';
import { convertToDate } from '../types/firebase';

// Collection references
export const COLLECTIONS = {
  BLOGS: 'blogs',
  CATEGORIES: 'blog_categories',
  TAGS: 'blog_tags'
} as const;

// Public blog operations (read-only for user-facing app)
export const getBlogById = async (blogId: string): Promise<BlogData | null> => {
  try {
    const blogRef = doc(db, COLLECTIONS.BLOGS, blogId);
    const blogSnap = await getDoc(blogRef);
    
    if (blogSnap.exists()) {
      const blogData = { id: blogSnap.id, ...blogSnap.data() } as BlogData;
      // Only return published blogs for public access
      if (blogData.status === 'published') {
        return blogData;
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting blog:', error);
    throw new Error('Failed to get blog');
  }
};

export const getBlogBySlug = async (slug: string): Promise<BlogData | null> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.BLOGS),
      where('slug', '==', slug),
      where('status', '==', 'published'),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as BlogData;
    }
    return null;
  } catch (error) {
    console.error('Error getting blog by slug:', error);
    throw new Error('Failed to get blog');
  }
};

// Alias for consistency with admin interface
export const getBlogs = async (
  filters: BlogFilters = {},
  pageSize: number = 10,
  lastDoc?: DocumentSnapshot
): Promise<BlogListResponse> => {
  return getPublishedBlogs(filters, pageSize, lastDoc);
};

export const getPublishedBlogs = async (
  filters: BlogFilters = {},
  pageSize: number = 10,
  lastDoc?: DocumentSnapshot
): Promise<BlogListResponse> => {
  try {
    const constraints: QueryConstraint[] = [];
    
    // Start with just ordering by publishDate to avoid index requirements
    constraints.push(orderBy('publishDate', 'desc'));
    constraints.push(limit(pageSize * 3)); // Get more to filter client-side
    
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }
    
    const q = query(collection(db, COLLECTIONS.BLOGS), ...constraints);
    const querySnapshot = await getDocs(q);
    
    const allBlogs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BlogData[];
    
    // Client-side filtering for published blogs and other filters
    let filteredBlogs = allBlogs.filter(blog => blog.status === 'published');
    
    // Apply additional filters client-side
    if (filters.category) {
      filteredBlogs = filteredBlogs.filter(blog => 
        blog.categories.includes(filters.category!)
      );
    }
    
    if (filters.tags && filters.tags.length > 0) {
      filteredBlogs = filteredBlogs.filter(blog =>
        filters.tags!.some(tag => blog.tags.includes(tag))
      );
    }
    
    if (filters.dateRange) {
      filteredBlogs = filteredBlogs.filter(blog => {
        const blogDate = convertToDate(blog.publishDate);
        
        if (filters.dateRange!.start && blogDate < filters.dateRange!.start) {
          return false;
        }
        if (filters.dateRange!.end && blogDate > filters.dateRange!.end) {
          return false;
        }
        return true;
      });
    }
    
    // Limit to requested page size
    const blogs = filteredBlogs.slice(0, pageSize);
    const hasMore = filteredBlogs.length > pageSize;
    const nextCursor = hasMore ? blogs[blogs.length - 1].id : undefined;
    
    return {
      blogs,
      totalCount: blogs.length,
      hasMore,
      nextCursor
    };
  } catch (error) {
    console.error('Error getting published blogs:', error);
    throw new Error('Failed to get blogs');
  }
};

export const searchPublishedBlogs = async (
  searchQuery: string,
  pageSize: number = 10
): Promise<BlogData[]> => {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This is a basic implementation - for production, consider using Algolia or similar
    const q = query(
      collection(db, COLLECTIONS.BLOGS),
      where('status', '==', 'published'),
      orderBy('publishDate', 'desc'),
      limit(pageSize * 3) // Get more results to filter client-side
    );
    
    const querySnapshot = await getDocs(q);
    const allBlogs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BlogData[];
    
    // Client-side filtering for search
    const searchTerm = searchQuery.toLowerCase();
    const filteredBlogs = allBlogs.filter(blog => 
      blog.title.toLowerCase().includes(searchTerm) ||
      blog.excerpt.toLowerCase().includes(searchTerm) ||
      blog.content.toLowerCase().includes(searchTerm) ||
      blog.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    
    return filteredBlogs.slice(0, pageSize);
  } catch (error) {
    console.error('Error searching blogs:', error);
    throw new Error('Failed to search blogs');
  }
};

export const getCategories = async (): Promise<CategoryData[]> => {
  try {
    const q = query(collection(db, COLLECTIONS.CATEGORIES), orderBy('name'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CategoryData[];
  } catch (error) {
    console.error('Error getting categories:', error);
    throw new Error('Failed to get categories');
  }
};

export const getRelatedBlogs = async (
  currentBlogId: string,
  categories: string[],
  tags: string[],
  limit: number = 3
): Promise<BlogData[]> => {
  try {
    // Get blogs with similar categories or tags
    const constraints: QueryConstraint[] = [
      where('status', '==', 'published'),
      orderBy('publishDate', 'desc')
    ];
    
    // Try to find blogs with similar categories first
    if (categories.length > 0) {
      constraints.push(where('categories', 'array-contains-any', categories));
    } else if (tags.length > 0) {
      constraints.push(where('tags', 'array-contains-any', tags));
    }
    
    const q = query(collection(db, COLLECTIONS.BLOGS), ...constraints);
    const querySnapshot = await getDocs(q);
    
    const relatedBlogs = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as BlogData))
      .filter(blog => blog.id !== currentBlogId) // Exclude current blog
      .slice(0, limit);
    
    return relatedBlogs;
  } catch (error) {
    console.error('Error getting related blogs:', error);
    return [];
  }
};

// Analytics function for public use
export const incrementBlogViews = async (blogId: string): Promise<void> => {
  try {
    const blogRef = doc(db, COLLECTIONS.BLOGS, blogId);
    const blogSnap = await getDoc(blogRef);
    
    if (blogSnap.exists()) {
      const currentViews = blogSnap.data().analytics?.views || 0;
      await updateDoc(blogRef, {
        'analytics.views': currentViews + 1,
        'analytics.lastViewed': Timestamp.now()
      });
    }
  } catch (error) {
    console.error('Error incrementing blog views:', error);
    // Don't throw error for analytics - it's not critical
  }
};
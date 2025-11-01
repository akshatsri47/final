"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogById, incrementBlogViews } from '../../../lib/blogFirestore';
import { BlogData } from '../../../types/blog';
import { Calendar, User, Tag, ArrowLeft, Eye } from 'lucide-react';
import { convertToDate } from '../../../types/firebase';

export default function BlogDetailPage() {
  const params = useParams();
  const blogId = params.id as string;
  
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  const fetchBlog = useCallback(async () => {
    try {
      setLoading(true);
      const blogData = await getBlogById(blogId);
      
      if (!blogData) {
        setError('Blog not found');
        return;
      }

      // Only show published blogs to users
      if (blogData.status !== 'published') {
        setError('Blog not available');
        return;
      }

      setBlog(blogData);
      
      // Increment view count
      try {
        await incrementBlogViews(blogId);
      } catch (viewError) {
        console.error('Error incrementing views:', viewError);
        // Don't show error to user for analytics failure
      }
    } catch (err) {
      setError('Failed to load blog');
      console.error('Error fetching blog:', err);
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  const formatDate = (timestamp: unknown) => {
    if (!timestamp) return '';
    
    const date = convertToDate(timestamp);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blog...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 text-lg">{error}</p>
            <Link
              href="/blogs"
              className="mt-4 inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/blogs"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Link>
        </div>

        {/* Blog Content */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="relative h-64 md:h-96 w-full">
              <Image
                src={blog.featuredImage.url}
                alt={blog.featuredImage.altText || blog.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="p-8">
            {/* Categories */}
            {blog.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.categories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {category}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                <span className="font-medium">{blog.author.name}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{formatDate(blog.publishDate)}</span>
              </div>
              {blog.analytics?.views && (
                <div className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  <span>{blog.analytics.views} views</span>
                </div>
              )}
            </div>

            {/* Excerpt */}
            {blog.excerpt && (
              <div className="text-xl text-gray-700 mb-8 p-4 bg-gray-50 rounded-lg border-l-4 border-emerald-500">
                {blog.excerpt}
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none prose-emerald prose-headings:text-gray-900 prose-a:text-emerald-600 hover:prose-a:text-emerald-700"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Media Items */}
            {blog.mediaItems && blog.mediaItems.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Media Gallery</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {blog.mediaItems.map((media) => (
                    <div key={media.id} className="relative">
                      {media.type === 'image' ? (
                        <div className="relative h-48 w-full rounded-lg overflow-hidden">
                          <Image
                            src={media.url}
                            alt={media.altText || 'Blog media'}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <video
                          src={media.url}
                          controls
                          className="w-full h-48 rounded-lg"
                        >
                          Your browser does not support the video tag.
                        </video>
                      )}
                      {media.caption && (
                        <p className="mt-2 text-sm text-gray-600 italic">{media.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* SEO Meta */}
        {blog.seo && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">SEO Information</h3>
            {blog.seo.metaTitle && (
              <p className="text-sm text-gray-600 mb-1">
                <strong>Meta Title:</strong> {blog.seo.metaTitle}
              </p>
            )}
            {blog.seo.metaDescription && (
              <p className="text-sm text-gray-600 mb-1">
                <strong>Meta Description:</strong> {blog.seo.metaDescription}
              </p>
            )}
            {blog.seo.keywords && blog.seo.keywords.length > 0 && (
              <p className="text-sm text-gray-600">
                <strong>Keywords:</strong> {blog.seo.keywords.join(', ')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
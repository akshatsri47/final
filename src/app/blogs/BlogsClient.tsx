"use client";

import Link from 'next/link';
import Image from 'next/image';
import { BlogData } from '../../types/blog';
import { Calendar, User, Tag, Eye } from 'lucide-react';
import { convertToDate } from '../../types/firebase';

interface BlogsClientProps { initialBlogs?: BlogData[]; categories?: string[]; selectedCategory?: string; currentPage?: number; totalPages?: number; }

export default function BlogsClient({ initialBlogs: blogs = [], categories = [], selectedCategory = '', currentPage = 1, totalPages = 1 }: BlogsClientProps) {

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

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover insights, tips, and stories from our agricultural experts
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              <Link href="/blogs"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === '' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Categories
              </Link>
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/blogs?category=${encodeURIComponent(category)}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        )}
        {totalPages > 1 && <nav aria-label="Blog pagination" className="mt-10 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <Link key={page} href={`/blogs?${selectedCategory ? `category=${encodeURIComponent(selectedCategory)}&` : ''}page=${page}`} className={`rounded px-4 py-2 ${page === currentPage ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700'}`}>{page}</Link>)}
        </nav>}

        {/* Blog Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No blogs found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Featured Image */}
                {blog.featuredImage && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={blog.featuredImage.url}
                      alt={blog.featuredImage.altText || blog.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Categories */}
                  {blog.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {blog.categories.slice(0, 2).map((category) => (
                        <span
                          key={category}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {category}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    <Link href={`/blogs/${blog.id}`} className="hover:text-emerald-600 transition-colors">
                      {blog.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.excerpt || stripHtml(blog.content).substring(0, 150) + '...'}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {blog.author.name}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(blog.publishDate)}
                      </div>
                    </div>
                    {blog.analytics?.views && (
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {blog.analytics.views}
                      </div>
                    )}
                  </div>

                  {/* Read More Link */}
                  <div className="mt-4">
                    <Link
                      href={`/blogs/${blog.id}`}
                      className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Read More
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

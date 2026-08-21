import { Metadata } from 'next';
import BlogsClient from './BlogsClient';
import { getBlogs } from '../../lib/blogFirestore';
import { BlogData } from '../../types/blog';
import { convertToDate } from '../../types/firebase';

type SearchParams = Promise<{ category?: string; page?: string }>;
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { category, page } = await searchParams;
  const suffix = `${category ? ` - ${category}` : ''}${Number(page) > 1 ? ` - Page ${page}` : ''}`;
  const query = new URLSearchParams(); if (category) query.set('category', category); if (Number(page) > 1) query.set('page', page!);
  return { title: `Agricultural Blog${suffix}`, description: 'Expert agricultural insights, farming tips and crop-management advice from KrishDoctor.', alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.krishdoctor.in'}/blogs${query.size ? `?${query}` : ''}` }, robots: { index: true, follow: true } };
}

export const revalidate = 3600;

const serializeBlog = (blog: BlogData): BlogData => ({
  ...blog,
  publishDate: convertToDate(blog.publishDate).toISOString() as unknown as BlogData['publishDate'],
  createdAt: convertToDate(blog.createdAt).toISOString() as unknown as BlogData['createdAt'],
  updatedAt: convertToDate(blog.updatedAt).toISOString() as unknown as BlogData['updatedAt'],
});

export default async function BlogsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const { blogs } = await getBlogs({}, 500);
  const categories = Array.from(new Set(blogs.flatMap((blog) => blog.categories))).sort();
  const filtered = params.category ? blogs.filter((blog) => blog.categories.includes(params.category!)) : blogs;
  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(Math.max(Number.parseInt(params.page || '1', 10) || 1, 1), totalPages);
  const pageBlogs = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return <BlogsClient initialBlogs={pageBlogs.map(serializeBlog)} categories={categories} selectedCategory={params.category || ''} currentPage={currentPage} totalPages={totalPages} />;
}

import { Metadata } from 'next';
import { getBlogById } from '../../../lib/blogFirestore';
import BlogDetailClient from './BlogDetailClient';
import StructuredDataComponent from '../../../components/StructuredData';
import { generateArticleStructuredData } from '../../../lib/seo';
import { notFound } from 'next/navigation';
import { BlogData } from '../../../types/blog';
import { convertToDate } from '../../../types/firebase';

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: blogId } = await params;

  try {
    const blog = await getBlogById(blogId);

    if (!blog) {
      return {
        title: 'Blog Not Found',
        description: 'The requested blog post could not be found.',
        robots: { index: false, follow: false },
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.krishdoctor.in';
    const blogUrl = `${baseUrl}/blogs/${blogId}`;

    return {
      title: blog.seo?.metaTitle || blog.title,
      description: blog.seo?.metaDescription || blog.excerpt || blog.title,
      keywords: blog.seo?.keywords || blog.tags,
      authors: [{ name: blog.author.name }],
      openGraph: {
        title: blog.seo?.metaTitle || blog.title,
        description: blog.seo?.metaDescription || blog.excerpt || blog.title,
        url: blogUrl,
        siteName: 'KrishDoctor',
        images: blog.featuredImage ? [
          {
            url: blog.featuredImage.url,
            width: 1200,
            height: 630,
            alt: blog.featuredImage.altText || blog.title,
          }
        ] : [],
        type: 'article',
        publishedTime: blog.publishDate ? new Date(blog.publishDate.seconds * 1000).toISOString() : undefined,
        modifiedTime: blog.updatedAt ? new Date(blog.updatedAt.seconds * 1000).toISOString() : undefined,
        authors: [blog.author.name],
        tags: blog.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.seo?.metaTitle || blog.title,
        description: blog.seo?.metaDescription || blog.excerpt || blog.title,
        images: blog.featuredImage ? [blog.featuredImage.url] : [],
      },
      alternates: {
        canonical: blogUrl,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    console.error('Error generating blog metadata:', error);
    return {
      title: 'Blog Not Found',
      description: 'The requested blog post could not be found.',
    };
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { id: blogId } = await params;
  
  const blog = await getBlogById(blogId);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.krishdoctor.in';
  
  if (!blog) {
    notFound();
  }

  const serializedBlog: BlogData = {
    ...blog,
    publishDate: convertToDate(blog.publishDate).toISOString() as unknown as BlogData['publishDate'],
    createdAt: convertToDate(blog.createdAt).toISOString() as unknown as BlogData['createdAt'],
    updatedAt: convertToDate(blog.updatedAt).toISOString() as unknown as BlogData['updatedAt'],
  };

  const articleData = generateArticleStructuredData({
    title: blog.seo?.metaTitle || blog.title,
    description: blog.seo?.metaDescription || blog.excerpt || blog.title,
    image: blog.featuredImage?.url || `${baseUrl}/banner1.jpg`,
    url: `${baseUrl}/blogs/${blogId}`,
    datePublished: blog.publishDate ? new Date(blog.publishDate.seconds * 1000).toISOString() : new Date().toISOString(),
    dateModified: blog.updatedAt ? new Date(blog.updatedAt.seconds * 1000).toISOString() : undefined,
    authorName: blog.author?.name || 'KrishDoctor Expert',
  });

  return (
    <>
      <StructuredDataComponent data={articleData} />
      <BlogDetailClient blogId={blogId} initialBlog={serializedBlog} />
    </>
  );
}

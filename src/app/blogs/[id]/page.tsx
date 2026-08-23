import { Metadata } from 'next';
import { getBlogById } from '../../../lib/blogFirestore';
import BlogDetailClient from './BlogDetailClient';
import StructuredDataComponent from '../../../components/StructuredData';
import { generateArticleStructuredData } from '../../../lib/seo';
import { notFound } from 'next/navigation';
import { BlogData } from '../../../types/blog';
import { convertToDate } from '../../../types/firebase';
import { getBlogImageUrl, sanitizeBlogContent } from '../../../lib/blogUtils';

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
    const imageUrl = new URL(getBlogImageUrl(blog), baseUrl).toString();

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
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: blog.featuredImage?.altText || blog.title,
          }
        ],
        type: 'article',
        publishedTime: blog.publishDate ? convertToDate(blog.publishDate).toISOString() : undefined,
        modifiedTime: blog.updatedAt ? convertToDate(blog.updatedAt).toISOString() : undefined,
        authors: [blog.author.name],
        tags: blog.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.seo?.metaTitle || blog.title,
        description: blog.seo?.metaDescription || blog.excerpt || blog.title,
        images: [imageUrl],
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
    content: sanitizeBlogContent(blog.content),
    publishDate: convertToDate(blog.publishDate).toISOString() as unknown as BlogData['publishDate'],
    createdAt: convertToDate(blog.createdAt).toISOString() as unknown as BlogData['createdAt'],
    updatedAt: convertToDate(blog.updatedAt).toISOString() as unknown as BlogData['updatedAt'],
  };

  const articleData = generateArticleStructuredData({
    title: blog.seo?.metaTitle || blog.title,
    description: blog.seo?.metaDescription || blog.excerpt || blog.title,
    image: new URL(getBlogImageUrl(blog), baseUrl).toString(),
    url: `${baseUrl}/blogs/${blogId}`,
    datePublished: blog.publishDate ? convertToDate(blog.publishDate).toISOString() : new Date().toISOString(),
    dateModified: blog.updatedAt ? convertToDate(blog.updatedAt).toISOString() : undefined,
    authorName: blog.author?.name || 'KrishDoctor Expert',
  });

  return (
    <>
      <StructuredDataComponent data={articleData} />
      <BlogDetailClient blogId={blogId} initialBlog={serializedBlog} />
    </>
  );
}

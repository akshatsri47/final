import { Metadata } from 'next';
import BlogsClient from './BlogsClient';

export const metadata: Metadata = {
  title: 'Agricultural Blog - Expert Tips & Insights',
  description: 'Discover expert agricultural insights, farming tips, crop management advice, and the latest trends in agriculture from KrishDoctor professionals.',
  keywords: ['agricultural blog', 'farming tips', 'crop management', 'agriculture insights', 'farming advice', 'agricultural experts', 'India farming'],
  openGraph: {
    title: 'Agricultural Blog - Expert Tips & Insights | KrishDoctor',
    description: 'Discover expert agricultural insights, farming tips, crop management advice, and the latest trends in agriculture from KrishDoctor professionals.',
    type: 'website',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.krishdoctor.in'}/blogs`,
  },
};

export default function BlogsPage() {
  return <BlogsClient />;
}
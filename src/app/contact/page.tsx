import { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";
import StructuredDataComponent from "@/components/StructuredData";
import { generateLocalBusinessStructuredData } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us - Get Expert Agricultural Advice",
  description: "Contact PaceIT for expert agricultural advice, product information, and technical support. Our team of agricultural experts is here to help you with farming solutions.",
  keywords: [
    "contact agricultural experts",
    "farming advice",
    "agricultural consultation",
    "crop protection support",
    "farmer helpline",
    "agricultural products inquiry"
  ],
  openGraph: {
    title: "Contact Us - Get Expert Agricultural Advice | PaceIT",
    description: "Contact PaceIT for expert agricultural advice, product information, and technical support.",
    url: "https://paceit.com/contact",
    images: [
      {
        url: "/banner1.jpg",
        width: 1200,
        height: 630,
        alt: "Contact PaceIT Agricultural Experts",
      },
    ],
  },
  alternates: {
    canonical: "https://paceit.com/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <StructuredDataComponent data={generateLocalBusinessStructuredData()} />
      <ContactPageClient />
    </>
  );
}
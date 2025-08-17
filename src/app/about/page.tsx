
import { Metadata } from "next";
import AboutUsClient from "./AboutUsClient";
import StructuredDataComponent from "@/components/StructuredData";
import { generateOrganizationStructuredData } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Us - Agricultural Excellence Since 1973",
  description: "Discover our 50+ year journey in agricultural solutions. From traditional farming to digital innovation, we've been serving 10,000+ farmers with quality products and expert advice.",
  keywords: [
    "agricultural company",
    "farming solutions",
    "50 years experience",
    "farmer support",
    "agricultural expertise",
    "Gupta Trading Company",
    "sustainable agriculture",
    "crop protection"
  ],
  openGraph: {
    title: "About Us - Agricultural Excellence Since 1973 | PaceIT",
    description: "Discover our 50+ year journey in agricultural solutions. Serving 10,000+ farmers with quality products and expert advice.",
    url: "https://paceit.com/about",
    images: [
      {
        url: "/profile/downloads1.jpg",
        width: 1200,
        height: 630,
        alt: "PaceIT Agricultural Excellence",
      },
    ],
  },
  alternates: {
    canonical: "https://paceit.com/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <StructuredDataComponent data={generateOrganizationStructuredData()} />
      <AboutUsClient />
    </>
  );
}